declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"terms": {
"affordances.md": {
	id: "affordances.md";
  slug: "affordances";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"aleatory.md": {
	id: "aleatory.md";
  slug: "aleatory";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"algorithmic-narrativity.md": {
	id: "algorithmic-narrativity.md";
  slug: "algorithmic-narrativity";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"alternate-reality-game.md": {
	id: "alternate-reality-game.md";
  slug: "alternate-reality-game";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"anamorphosis.md": {
	id: "anamorphosis.md";
  slug: "anamorphosis";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"appropriation.md": {
	id: "appropriation.md";
  slug: "appropriation";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"artificial-intelligence-ai.md": {
	id: "artificial-intelligence-ai.md";
  slug: "artificial-intelligence-ai";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"augmented-reality-ar.md": {
	id: "augmented-reality-ar.md";
  slug: "augmented-reality-ar";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"authoring-software.md": {
	id: "authoring-software.md";
  slug: "authoring-software";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"autopoiesis.md": {
	id: "autopoiesis.md";
  slug: "autopoiesis";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"avatar.md": {
	id: "avatar.md";
  slug: "avatar";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"biopoetics.md": {
	id: "biopoetics.md";
  slug: "biopoetics";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"bookishness.md": {
	id: "bookishness.md";
  slug: "bookishness";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"born-digital.md": {
	id: "born-digital.md";
  slug: "born-digital";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"capitalocene.md": {
	id: "capitalocene.md";
  slug: "capitalocene";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"chatbot.md": {
	id: "chatbot.md";
  slug: "chatbot";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"close-reading.md": {
	id: "close-reading.md";
  slug: "close-reading";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"codework.md": {
	id: "codework.md";
  slug: "codework";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"combinatorics.md": {
	id: "combinatorics.md";
  slug: "combinatorics";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"computational-narrative-systems.md": {
	id: "computational-narrative-systems.md";
  slug: "computational-narrative-systems";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"conspiracy-theory.md": {
	id: "conspiracy-theory.md";
  slug: "conspiracy-theory";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"constraint.md": {
	id: "constraint.md";
  slug: "constraint";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"contemporary-posteriority.md": {
	id: "contemporary-posteriority.md";
  slug: "contemporary-posteriority";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"creative-captioning.md": {
	id: "creative-captioning.md";
  slug: "creative-captioning";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"critical-code-studies.md": {
	id: "critical-code-studies.md";
  slug: "critical-code-studies";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"cybersemiotics.md": {
	id: "cybersemiotics.md";
  slug: "cybersemiotics";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"cybertext.md": {
	id: "cybertext.md";
  slug: "cybertext";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"dada.md": {
	id: "dada.md";
  slug: "dada";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"database-narrative.md": {
	id: "database-narrative.md";
  slug: "database-narrative";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"digital-narrative.md": {
	id: "digital-narrative.md";
  slug: "digital-narrative";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"digital-poetry.md": {
	id: "digital-poetry.md";
  slug: "digital-poetry";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"distant-reading.md": {
	id: "distant-reading.md";
  slug: "distant-reading";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"doomscrolling.md": {
	id: "doomscrolling.md";
  slug: "doomscrolling";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"electronic-literature-e-lit.md": {
	id: "electronic-literature-e-lit.md";
  slug: "electronic-literature-e-lit";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"email-narrative.md": {
	id: "email-narrative.md";
  slug: "email-narrative";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"embodiment.md": {
	id: "embodiment.md";
  slug: "embodiment";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"emulation.md": {
	id: "emulation.md";
  slug: "emulation";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"ergodic-literature.md": {
	id: "ergodic-literature.md";
  slug: "ergodic-literature";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"fanfiction.md": {
	id: "fanfiction.md";
  slug: "fanfiction";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"flash.md": {
	id: "flash.md";
  slug: "flash";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"generative-poetry.md": {
	id: "generative-poetry.md";
  slug: "generative-poetry";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"god-game.md": {
	id: "god-game.md";
  slug: "god-game";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"gutenberg-parenthesis.md": {
	id: "gutenberg-parenthesis.md";
  slug: "gutenberg-parenthesis";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"haptic.md": {
	id: "haptic.md";
  slug: "haptic";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"hermeneutics.md": {
	id: "hermeneutics.md";
  slug: "hermeneutics";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"histobot.md": {
	id: "histobot.md";
  slug: "histobot";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"hyperreading.md": {
	id: "hyperreading.md";
  slug: "hyperreading";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"hypertext.md": {
	id: "hypertext.md";
  slug: "hypertext";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"implied-reader.md": {
	id: "implied-reader.md";
  slug: "implied-reader";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"installation.md": {
	id: "installation.md";
  slug: "installation";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"instapoetry.md": {
	id: "instapoetry.md";
  slug: "instapoetry";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"interactive-fiction.md": {
	id: "interactive-fiction.md";
  slug: "interactive-fiction";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"intertextuality.md": {
	id: "intertextuality.md";
  slug: "intertextuality";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"jane-space.md": {
	id: "jane-space.md";
  slug: "jane-space";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"kinetic-typography.md": {
	id: "kinetic-typography.md";
  slug: "kinetic-typography";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"lexia-or-node.md": {
	id: "lexia-or-node.md";
  slug: "lexia-or-node";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"link-rot.md": {
	id: "link-rot.md";
  slug: "link-rot";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"literary-game.md": {
	id: "literary-game.md";
  slug: "literary-game";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"locative-media.md": {
	id: "locative-media.md";
  slug: "locative-media";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"machine-learning.md": {
	id: "machine-learning.md";
  slug: "machine-learning";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"materiality.md": {
	id: "materiality.md";
  slug: "materiality";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"media-ecology.md": {
	id: "media-ecology.md";
  slug: "media-ecology";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"media-specificity.md": {
	id: "media-specificity.md";
  slug: "media-specificity";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"meme.md": {
	id: "meme.md";
  slug: "meme";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"metainterface.md": {
	id: "metainterface.md";
  slug: "metainterface";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"metareference.md": {
	id: "metareference.md";
  slug: "metareference";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"multilinearity.md": {
	id: "multilinearity.md";
  slug: "multilinearity";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"multimodality.md": {
	id: "multimodality.md";
  slug: "multimodality";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"netprov.md": {
	id: "netprov.md";
  slug: "netprov";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"parasocial-relationships.md": {
	id: "parasocial-relationships.md";
  slug: "parasocial-relationships";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"participatory-narrative.md": {
	id: "participatory-narrative.md";
  slug: "participatory-narrative";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"platform-studies.md": {
	id: "platform-studies.md";
  slug: "platform-studies";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"platformization.md": {
	id: "platformization.md";
  slug: "platformization";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"player-agency.md": {
	id: "player-agency.md";
  slug: "player-agency";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"poetic-alt-text.md": {
	id: "poetic-alt-text.md";
  slug: "poetic-alt-text";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"polarization.md": {
	id: "polarization.md";
  slug: "polarization";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"post-digital.md": {
	id: "post-digital.md";
  slug: "post-digital";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"posthuman-poetics.md": {
	id: "posthuman-poetics.md";
  slug: "posthuman-poetics";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"preservation.md": {
	id: "preservation.md";
  slug: "preservation";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"procedurality.md": {
	id: "procedurality.md";
  slug: "procedurality";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"remediation.md": {
	id: "remediation.md";
  slug: "remediation";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"remix.md": {
	id: "remix.md";
  slug: "remix";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"speculative-interface.md": {
	id: "speculative-interface.md";
  slug: "speculative-interface";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"story-generation.md": {
	id: "story-generation.md";
  slug: "story-generation";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"storyspace.md": {
	id: "storyspace.md";
  slug: "storyspace";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"stretchtext.md": {
	id: "stretchtext.md";
  slug: "stretchtext";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"transhumanism.md": {
	id: "transhumanism.md";
  slug: "transhumanism";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"transmediality.md": {
	id: "transmediality.md";
  slug: "transmediality";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"twine.md": {
	id: "twine.md";
  slug: "twine";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"twitterature.md": {
	id: "twitterature.md";
  slug: "twitterature";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"virtual-reality-vr.md": {
	id: "virtual-reality-vr.md";
  slug: "virtual-reality-vr";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"visual-novel.md": {
	id: "visual-novel.md";
  slug: "visual-novel";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"walking-simulator.md": {
	id: "walking-simulator.md";
  slug: "walking-simulator";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"web-1.0.md": {
	id: "web-1.0.md";
  slug: "web-10";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"web-2.0.md": {
	id: "web-2.0.md";
  slug: "web-20";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
"web-3.0.md": {
	id: "web-3.0.md";
  slug: "web-30";
  body: string;
  collection: "terms";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
