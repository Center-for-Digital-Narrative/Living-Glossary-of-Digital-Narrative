declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
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
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
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
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"authors": {
"colin-robinson.md": {
	id: "colin-robinson.md";
  slug: "colin-robinson";
  body: string;
  collection: "authors";
  data: InferEntrySchema<"authors">
} & { render(): Render[".md"] };
"john-smith.md": {
	id: "john-smith.md";
  slug: "john-smith";
  body: string;
  collection: "authors";
  data: InferEntrySchema<"authors">
} & { render(): Render[".md"] };
};
"terms": {
"antagonist.md": {
	id: "antagonist.md";
  slug: "antagonist";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"augmented-reality.md": {
	id: "augmented-reality.md";
  slug: "augmented-reality";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"avatar.md": {
	id: "avatar.md";
  slug: "avatar";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"born-digital.md": {
	id: "born-digital.md";
  slug: "born-digital";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"chatbot.md": {
	id: "chatbot.md";
  slug: "chatbot";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"chthulucene.md": {
	id: "chthulucene.md";
  slug: "chthulucene";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"cliffhanger.md": {
	id: "cliffhanger.md";
  slug: "cliffhanger";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"codework.md": {
	id: "codework.md";
  slug: "codework";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"combinatory-cinema.md": {
	id: "combinatory-cinema.md";
  slug: "combinatory-cinema";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"creative-captioning.md": {
	id: "creative-captioning.md";
  slug: "creative-captioning";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"cybertext.md": {
	id: "cybertext.md";
  slug: "cybertext";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"data-forensics.md": {
	id: "data-forensics.md";
  slug: "data-forensics";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"digital-humanities.md": {
	id: "digital-humanities.md";
  slug: "digital-humanities";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"doppelganger.md": {
	id: "doppelganger.md";
  slug: "doppelganger";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"email-narrative.md": {
	id: "email-narrative.md";
  slug: "email-narrative";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"embodiment.md": {
	id: "embodiment.md";
  slug: "embodiment";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"emulation.md": {
	id: "emulation.md";
  slug: "emulation";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"fanfiction.md": {
	id: "fanfiction.md";
  slug: "fanfiction";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"first-person.md": {
	id: "first-person.md";
  slug: "first-person";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"generative-poetry.md": {
	id: "generative-poetry.md";
  slug: "generative-poetry";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"gutenberg-parenthesis.md": {
	id: "gutenberg-parenthesis.md";
  slug: "gutenberg-parenthesis";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"hyperreading.md": {
	id: "hyperreading.md";
  slug: "hyperreading";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"implied-reader.md": {
	id: "implied-reader.md";
  slug: "implied-reader";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"indie-games.md": {
	id: "indie-games.md";
  slug: "indie-games";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"instapoetry.md": {
	id: "instapoetry.md";
  slug: "instapoetry";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"interactive-fiction.md": {
	id: "interactive-fiction.md";
  slug: "interactive-fiction";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"intertextuality.md": {
	id: "intertextuality.md";
  slug: "intertextuality";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"jane-space.md": {
	id: "jane-space.md";
  slug: "jane-space";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"kinetic-typography.md": {
	id: "kinetic-typography.md";
  slug: "kinetic-typography";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"link-rot.md": {
	id: "link-rot.md";
  slug: "link-rot";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"machine-learning.md": {
	id: "machine-learning.md";
  slug: "machine-learning";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"media-archeology.md": {
	id: "media-archeology.md";
  slug: "media-archeology";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"netprov.md": {
	id: "netprov.md";
  slug: "netprov";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"obsolescence.md": {
	id: "obsolescence.md";
  slug: "obsolescence";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"parasocial.md": {
	id: "parasocial.md";
  slug: "parasocial";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"platform-studies.md": {
	id: "platform-studies.md";
  slug: "platform-studies";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"relational-posthumanism.md": {
	id: "relational-posthumanism.md";
  slug: "relational-posthumanism";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"remix.md": {
	id: "remix.md";
  slug: "remix";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
"surveillance-capitalism.md": {
	id: "surveillance-capitalism.md";
  slug: "surveillance-capitalism";
  body: string;
  collection: "terms";
  data: InferEntrySchema<"terms">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
