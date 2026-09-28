#!/usr/bin/env python3
"""
Generate and submit Crossref DOIs for The Living Glossary of Digital Narrative (LGDN).

Usage:
    # Process a single entry (dry-run):
    python3 scripts/archiving/create_crossref_doi.py src/content/terms/conspiracy-theory.md --dry-run

    # Process all eligible entries (dry-run):
    python3 scripts/archiving/create_crossref_doi.py --all --dry-run

    # Live generation and upload:
    python3 scripts/archiving/create_crossref_doi.py src/content/terms/conspiracy-theory.md
    python3 scripts/archiving/create_crossref_doi.py --all
"""

import os
import re
import sys
import uuid
import time
import argparse
import urllib.request
import urllib.error
import urllib.parse
import html
from datetime import datetime, date

try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
DEFAULT_TERMS_DIR = os.path.join(PROJECT_ROOT, "src", "content", "terms")

CANDIDATE_ENV_FILES = [
    os.path.join(SCRIPT_DIR, ".env"),
    os.path.join(SCRIPT_DIR, "..", ".env"),
    os.path.join(PROJECT_ROOT, ".env"),
    os.path.expanduser("~/WebstormProjects/ebr-content/scripts/archiving/.env"),
    os.path.expanduser("~/WebstormProjects/ebr-content/.env"),
]

def load_env():
    """Load simple .env file without requiring python-dotenv."""
    for env_file in CANDIDATE_ENV_FILES:
        if os.path.exists(env_file):
            try:
                with open(env_file, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if not line or line.startswith("#") or "=" not in line:
                            continue
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip()
                        # If value is quoted, preserve inner value exactly
                        if (v.startswith('"') and v.endswith('"') and len(v) >= 2) or \
                           (v.startswith("'") and v.endswith("'") and len(v) >= 2):
                            v = v[1:-1]
                        else:
                            # Strip inline comments for unquoted values
                            if " #" in v:
                                v = v.split(" #", 1)[0].strip()
                        if k and k not in os.environ:
                            os.environ[k] = v
            except OSError:
                continue

def get_frontmatter(filepath):
    """Extract frontmatter and body from a markdown file."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"File not found: {filepath}", file=sys.stderr)
        return None, None, None, None

    match = re.search(r"^---\r?\n(.*?)\r?\n---", content, re.DOTALL)
    if not match:
        return None, None, content, None

    frontmatter_text = match.group(1)
    body = content[match.end():]

    data = {}
    if HAS_YAML:
        try:
            parsed = yaml.safe_load(frontmatter_text)
            if isinstance(parsed, dict):
                data = parsed
        except Exception as e:
            print(f"Warning: Failed to parse YAML with pyyaml ({e}), falling back to regex", file=sys.stderr)

    if not data:
        # Fallback simple line-by-line parsing
        for line in frontmatter_text.splitlines():
            m = re.match(r"^([a-zA-Z0-9_-]+):\s*(.*)$", line)
            if m:
                k = m.group(1).strip()
                v = m.group(2).strip().strip("""'" """)
                v = html.unescape(v)
                data[k] = v

    return data, body, content, match

def check_eligibility(data, body):
    """
    Check if an entry is eligible for DOI generation.
    Returns (eligible: bool, reason: str).

    Criteria:
    (1) Does not have a DOI.
    (2) Is a complete record with an explication and not just a stub
        (has author, pubDate, and markdown explication prose).
    """
    if data is None:
        return False, "Could not parse frontmatter"

    doi = data.get("doi")
    if doi and str(doi).strip():
        return False, f"Already has DOI ({str(doi).strip()})"

    author = data.get("author")
    if not author or not str(author).strip():
        return False, "Stub: Missing author"

    pubdate = data.get("pubDate") or data.get("pubdate") or data.get("publish_date")
    if not pubdate or not str(pubdate).strip():
        return False, "Stub: Missing pubDate"

    # Check for body explication
    body_clean = (body or "").strip()
    # Strip markdown headers (#+ ...) to see if actual prose exists
    prose = re.sub(r"^#+.*$", "", body_clean, flags=re.MULTILINE).strip()
    if not prose:
        return False, "Stub: No explication prose"

    return True, "Eligible"

def generate_doi_suffix():
    """Generate a random DOI suffix like 6wyx-zxyz."""
    u = uuid.uuid4().hex
    return u[0:4] + "-" + u[4:8]

def parse_authors(author_field):
    """
    Parse author string or list into individual author names.
    Supports formats like:
      - "Inge van de Ven"
      - "Christian Ulrik Andersen and Søren Pold"
      - ["Author One", "Author Two"]
    """
    if isinstance(author_field, list):
        raw_authors = author_field
    else:
        # Split on " and " or ";" or "," (if multiple authors)
        parts = re.split(r"\s+and\s+|;\s*", str(author_field).strip())
        raw_authors = [p.strip() for p in parts if p.strip()]

    parsed = []
    for raw in raw_authors:
        tokens = [t for t in re.split(r"\s+", raw.strip()) if t]
        if not tokens:
            continue
        if len(tokens) == 1:
            given = ""
            surname = tokens[0]
        else:
            # Check for particle prefixes in Dutch/German/Romance surnames:
            # e.g., "Inge van de Ven" -> given="Inge", surname="van de Ven"
            particles = {"van", "von", "de", "der", "den", "del", "da", "di", "la", "le"}
            split_idx = len(tokens) - 1
            for idx in range(1, len(tokens) - 1):
                if tokens[idx].lower() in particles:
                    split_idx = idx
                    break
            given = " ".join(tokens[:split_idx])
            surname = " ".join(tokens[split_idx:])

        parsed.append((given, surname))
    return parsed

def escape_xml(s):
    """Escape special XML characters."""
    if not s:
        return ""
    return (str(s)
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;")
            .replace("'", "&apos;"))

def build_crossref_xml(data, slug, doi_prefix, doi_suffix, timestamp, batch_id):
    """Build the Crossref deposit XML payload."""
    doi = f"{doi_prefix}/{doi_suffix}"
    title = escape_xml(data.get("title", slug.replace("-", " ").title()))

    # Parse publish date
    pub_date = data.get("pubDate") or data.get("pubdate") or data.get("publish_date")
    pub_year, pub_month, pub_day = ("", "", "")
    if isinstance(pub_date, (datetime, date)):
        pub_year = str(pub_date.year)
        pub_month = str(pub_date.month).zfill(2)
        pub_day = str(pub_date.day).zfill(2)
    elif pub_date:
        parts = str(pub_date).strip().split("-")
        if len(parts) >= 1:
            pub_year = parts[0]
        if len(parts) >= 2:
            pub_month = parts[1].zfill(2)
        if len(parts) >= 3:
            pub_day = parts[2].split("T")[0].zfill(2)

    if not pub_year:
        today = datetime.now()
        pub_year = str(today.year)
        pub_month = str(today.month).zfill(2)
        pub_day = str(today.day).zfill(2)

    # Build authors XML
    authors_xml = ""
    authors = parse_authors(data.get("author", ""))
    if authors:
        authors_xml += "        <contributors>\n"
        for i, (given, surname) in enumerate(authors):
            seq = "first" if i == 0 else "additional"
            given_safe = escape_xml(given)
            surname_safe = escape_xml(surname)
            authors_xml += f"""          <person_name sequence="{seq}" contributor_role="author">\n"""
            if given_safe.strip():
                authors_xml += f"""            <given_name>{given_safe}</given_name>\n"""
            authors_xml += f"""            <surname>{surname_safe}</surname>\n"""
            authors_xml += """          </person_name>\n"""
        authors_xml += "        </contributors>\n"

    # Build abstract XML from description
    abstract_xml = ""
    description = data.get("description") or data.get("blurb")
    if description:
        # Strip basic markdown like **bold**, *italic*, [text](url)
        text = str(description).strip()
        text = re.sub(r"(\*\*|__|\*|_)(.*?)\1", r"\2", text)
        text = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", text)
        abstract_safe = escape_xml(text)
        abstract_xml = f"""        <jats:abstract xmlns:jats="http://www.ncbi.nlm.nih.gov/JATS1" xml:lang="en">
          <jats:p>{abstract_safe}</jats:p>
        </jats:abstract>\n"""

    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<doi_batch version="4.3.7" xmlns="http://www.crossref.org/schema/4.3.7" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.crossref.org/schema/4.3.7 http://www.crossref.org/schemas/crossref4.3.7.xsd">
  <head>
    <doi_batch_id>{batch_id}</doi_batch_id>
    <timestamp>{timestamp}</timestamp>
    <depositor>
      <depositor_name>Glossary-of-Digital-Narrative script</depositor_name>
      <email_address>colin.robinson@uib.no</email_address>
    </depositor>
    <registrant>Center for Digital Narrative</registrant>
  </head>
  <body>
    <journal>
      <journal_metadata>
        <full_title>The Living Glossary of Digital Narrative</full_title>
        <abbrev_title>LGDN</abbrev_title>
        <issn media_type="electronic">3084-2808</issn>
      </journal_metadata>

      <journal_article publication_type="full_text">
        <titles>
          <title>{title}</title>
        </titles>
{authors_xml}{abstract_xml}        <publication_date media_type="online">
          <month>{pub_month}</month>
          <day>{pub_day}</day>
          <year>{pub_year}</year>
        </publication_date>
        <doi_data>
          <doi>{doi}</doi>
          <resource>https://glossary.cdn.uib.no/terms/{slug}</resource>
        </doi_data>
      </journal_article>
    </journal>
  </body>
</doi_batch>"""
    return xml, doi

def submit_to_crossref(xml_data, username, password):
    """Submit the XML deposit to the Crossref API."""
    url = os.environ.get("CROSSREF_DEPOSIT_URL", "https://doi.crossref.org/servlet/deposit")
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"

    body = (
        f"--{boundary}\r\n"
        f"Content-Disposition: form-data; name=\"operation\"\r\n\r\n"
        f"doMDUpload\r\n"
        f"--{boundary}\r\n"
        f"Content-Disposition: form-data; name=\"login_id\"\r\n\r\n"
        f"{username}\r\n"
        f"--{boundary}\r\n"
        f"Content-Disposition: form-data; name=\"login_passwd\"\r\n\r\n"
        f"{password}\r\n"
        f"--{boundary}\r\n"
        f"Content-Disposition: form-data; name=\"fname\"; filename=\"deposit.xml\"\r\n"
        f"Content-Type: application/xml\r\n\r\n"
        f"{xml_data}\r\n"
        f"--{boundary}--\r\n"
    ).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "User-Agent": "Mozilla/5.0 (compatible; CrossrefDeposit/1.0)",
        }
    )

    try:
        response = urllib.request.urlopen(req)
        response_text = response.read().decode("utf-8")
        return True, response_text
    except urllib.error.HTTPError as e:
        body_err = e.read().decode("utf-8", errors="replace")
        if e.code == 401:
            err_msg = (
                f"HTTP Error 401: Unauthorized\n"
                f"Crossref rejected the credentials for user '{username}'.\n"
                f"Target endpoint: {url}\n"
                f"Things to verify:\n"
                f"  1. Username format: If using a personal email account, Crossref often requires 'email@domain.com/role'.\n"
                f"     If using an organization role account, verify the exact username.\n"
                f"  2. Password: Ensure the password matches your Crossref account and has not been truncated or altered by shell expansion (e.g. '$' in bash).\n"
                f"  3. Endpoint: If CROSSREF_DEPOSIT_URL is pointed at test.crossref.org, production credentials will fail (test requires a separately activated account)."
            )
            return False, err_msg
        elif "<html" in body_err.lower():
            title_m = re.search(r"<title>(.*?)</title>", body_err, re.IGNORECASE)
            title = title_m.group(1).strip() if title_m else "HTML Error Page"
            return False, f"HTTP Error {e.code}: {title}"
        return False, f"HTTP Error {e.code}: {body_err.strip()}"
    except urllib.error.URLError as e:
        return False, f"Network Error: {e.reason}"

def update_frontmatter(filepath, full_content, doi, match):
    """Insert or update the doi field in the frontmatter precisely."""
    frontmatter_text = match.group(1)

    if re.search(r"^doi:\s*", frontmatter_text, re.MULTILINE):
        # Update existing doi line
        new_frontmatter = re.sub(r"(^doi:\s*).*", rf"\g<1>{doi}", frontmatter_text, flags=re.MULTILINE)
    elif re.search(r"^pubDate:\s*.*$", frontmatter_text, re.MULTILINE):
        # Insert doi immediately after pubDate
        new_frontmatter = re.sub(r"(^pubDate:\s*.*$)", rf"\1\ndoi: {doi}", frontmatter_text, flags=re.MULTILINE)
    else:
        # Append at the bottom of the frontmatter block
        new_frontmatter = frontmatter_text.rstrip() + f"\ndoi: {doi}\n"

    new_content = full_content[:match.start(1)] + new_frontmatter + full_content[match.end(1):]

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

def process_entry(filepath, prefix, username, password, dry_run=False, verbose=False):
    """Process a single markdown file."""
    slug = os.path.splitext(os.path.basename(filepath))[0]
    data, body, content, match = get_frontmatter(filepath)
    if data is None or match is None:
        print(f"[-] {slug}: Could not read YAML frontmatter in {filepath}")
        return False

    eligible, reason = check_eligibility(data, body)
    if not eligible:
        print(f"[-] {slug}: Skipped ({reason})")
        return False

    suffix = generate_doi_suffix()
    timestamp = str(int(datetime.now().timestamp() * 1000))
    batch_id = f"lgdn-{suffix}-{timestamp}"

    xml, doi = build_crossref_xml(data, slug, prefix, suffix, timestamp, batch_id)

    if dry_run:
        print(f"[+] [DRY-RUN] {slug}: Would assign DOI '{doi}'")
        if verbose:
            print(f"--- Crossref XML ({slug}) ---")
            print(xml)
            print("------------------------------")
        return True

    print(f"[*] {slug}: Submitting DOI '{doi}' to Crossref...")
    success, result = submit_to_crossref(xml, username, password)

    if success:
        print(f"[+] {slug}: Successfully deposited DOI '{doi}'. Updating markdown...")
        update_frontmatter(filepath, content, doi, match)
        return True
    else:
        print(f"[!] {slug}: Failed to submit to Crossref: {result}", file=sys.stderr)
        return False

def test_login(username, password):
    """Test Crossref credentials with a lightweight probe without registering DOIs."""
    print(f"Testing Crossref credentials for login_id: '{username}'...")
    url = os.environ.get("CROSSREF_DEPOSIT_URL", "https://doi.crossref.org/servlet/deposit")
    print(f"Target endpoint: {url}")
    probe_xml = '<?xml version="1.0" encoding="UTF-8"?><probe/>'
    success, result = submit_to_crossref(probe_xml, username, password)
    if "401" in result or "Unauthorized" in result:
        print(f"\n[-] Authentication FAILED:\n{result}")
        return False
    else:
        print(f"\n[+] Authentication SUCCESSFUL! Crossref accepted the credentials.")
        return True

def main():
    parser = argparse.ArgumentParser(
        description="Generate Crossref DOIs for The Living Glossary of Digital Narrative entries."
    )
    parser.add_argument(
        "filepath",
        nargs="?",
        default=None,
        help="Path to a single markdown file (e.g. src/content/terms/conspiracy-theory.md)"
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Process all eligible markdown files in the terms directory"
    )
    parser.add_argument(
        "--terms-dir",
        default=DEFAULT_TERMS_DIR,
        help=f"Directory containing term markdown files (default: {DEFAULT_TERMS_DIR})"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Simulate execution without submitting to Crossref or editing files"
    )
    parser.add_argument(
        "--test-login",
        action="store_true",
        help="Test Crossref authentication credentials without generating or modifying DOIs"
    )
    parser.add_argument(
        "--username",
        "-u",
        default=None,
        help="Override CROSSREF_USERNAME (useful for testing credentials)"
    )
    parser.add_argument(
        "--password",
        "-p",
        default=None,
        help="Override CROSSREF_PASSWORD (useful for testing credentials)"
    )
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Print verbose output (including generated XML)"
    )

    # Filter out bare '--' delimiter sometimes forwarded by npm/pnpm
    filtered_argv = [arg for arg in sys.argv[1:] if arg != "--"]
    args = parser.parse_args(filtered_argv)

    if not args.filepath and not args.all and not args.test_login:
        parser.print_help()
        print("\nError: Please provide a filepath, specify --all, or run with --test-login.", file=sys.stderr)
        sys.exit(1)

    load_env()

    prefix = os.environ.get("CROSSREF_PREFIX")
    username = args.username or os.environ.get("CROSSREF_USERNAME")
    password = args.password or os.environ.get("CROSSREF_PASSWORD")

    if args.test_login:
        if not username or not password:
            print("Error: Username and password must be provided via environment, .env, or CLI flags (-u, -p).", file=sys.stderr)
            sys.exit(1)
        ok = test_login(username, password)
        sys.exit(0 if ok else 1)

    missing = []
    if not prefix:
        missing.append("CROSSREF_PREFIX")
    if not username:
        missing.append("CROSSREF_USERNAME")
    if not password:
        missing.append("CROSSREF_PASSWORD")

    if missing:
        raise EnvironmentError(
            f"Missing required environment variable(s): {', '.join(missing)}. "
            f"Please set them in your environment or a .env file (see scripts/archiving/.env.example)."
        )

    if args.filepath:
        target = os.path.abspath(args.filepath)
        print(f"Processing single file: {target}")
        success = process_entry(target, prefix, username, password, dry_run=args.dry_run, verbose=args.verbose)
        sys.exit(0 if success else 1)

    if args.all:
        terms_dir = os.path.abspath(args.terms_dir)
        if not os.path.isdir(terms_dir):
            print(f"Error: Terms directory not found: {terms_dir}", file=sys.stderr)
            sys.exit(1)

        term_files = sorted([
            os.path.join(terms_dir, f)
            for f in os.listdir(terms_dir)
            if f.endswith(".md")
        ])

        print(f"Scanning {len(term_files)} term files in {terms_dir}...")
        processed_count = 0
        skipped_count = 0
        failed_count = 0

        for f in term_files:
            slug = os.path.splitext(os.path.basename(f))[0]
            data, body, _, _ = get_frontmatter(f)
            eligible, reason = check_eligibility(data, body)
            if not eligible:
                skipped_count += 1
                if args.verbose:
                    print(f"[-] {slug}: Skipped ({reason})")
                continue

            success = process_entry(f, prefix, username, password, dry_run=args.dry_run, verbose=args.verbose)
            if success:
                processed_count += 1
            else:
                failed_count += 1

            if not args.dry_run and success:
                # Small pause between deposits to avoid throttling
                time.sleep(1)

        print("\n--- Summary ---")
        print(f"Total files scanned: {len(term_files)}")
        print(f"Skipped (stubs / already have DOI): {skipped_count}")
        print(f"{'Would process' if args.dry_run else 'Successfully processed'}: {processed_count}")
        if failed_count > 0:
            print(f"Failed: {failed_count}")

if __name__ == "__main__":
    main()
