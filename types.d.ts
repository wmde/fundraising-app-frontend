declare module '*.md' {
	const value: string;
	export default value;
}

declare module '*.html?raw' {
	const value: string;
	export default value;
}

declare module '*.css?raw' {
	const value: string;
	export default value;
}

declare module "vuex" {
	export * from "vuex/types/index.d.ts";
	export * from "vuex/types/helpers.d.ts";
	export * from "vuex/types/logger.d.ts";
	export * from "vuex/types/vue.d.ts";
}
