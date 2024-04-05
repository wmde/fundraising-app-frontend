<template>
	<div class="error-page">
		<h1 class="title">{{ $t( 'error_page_header' ) }}</h1>
		<p>
			<span v-html="appendCampaignQueryParams( $t( 'error_page' ), campaignParams )"></span>
		</p>

		<pre v-if="errorMessage">
			{{ errorMessage }}
		</pre>
		<div v-if="errorMessage" style="background-color: whitesmoke;font-family: monospace;white-space: pre; overflow: scroll; padding: 1.25rem 1.5rem;">
			<div v-for="(trace, idx) in errorTrace" :key="idx">
				<span>{{idx}} - </span>
				<span v-if="trace.class">{{ trace.class }}{{ trace.type }}{{ trace.function }}</span>
				<span v-else>{{ trace.function }}</span>
				-- <a :href="trace.file.replace(/^.*src\//, 'https://github.com/wmde/FundraisingFrontend/tree/master/src/')">
					{{ trace.file.replace(/^.*(src\/)/, '$1' ) }}:{{trace.line}}
				</a>
			</div>
		</div>

		<p>
			<a href="/"><span v-html="$t( 'error_pages_return_to_donation' )"></span></a>
		</p>
	</div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { appendCampaignQueryParams } from '@src/util/append_campaign_query_params';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';

interface TraceItem {
	'class': string,
	type: string,
	'function': string,
	file: string,
	line: string
}

interface Props {
	errorMessage: string,
	errorTrace: TraceItem[],
}
defineProps<Props>();

const campaignParams = inject<string>( QUERY_STRING_INJECTION_KEY, '' );

defineOptions( {
	name: 'Error',
} );

</script>
