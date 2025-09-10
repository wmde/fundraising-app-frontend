<template>
	<div
		v-if="isVisible"
		ref="errorSummary"
		class="error-summary"
		aria-live="assertive"
		aria-atomic="true"
		aria-relevant="all"
		role="region"
		:aria-labelledby="`${idNamespace}error-summary-heading`"
		tabindex="-1"
	>
		<ScrollTarget :target-id="`${idNamespace}error-summary-scroll-target`"/>
		<h2 class="error-summary-heading" :id="`${idNamespace}error-summary-heading`">{{ $t( 'error_summary_headline' ) }}</h2>
		<ul class="error-summary-list">
			<template v-for="item in items">
				<li :key="item.focusElement" v-if="item.validity === Validity.INVALID">
					<a
						:href="`#${ item.focusElement }`"
						:data-scroll-element="item.scrollElement"
						@click.prevent="() => onClickError( item.focusElement, item.scrollElement )"
						@keydown.space="() => onClickError( item.focusElement, item.scrollElement )"
						@keydown.enter="() => onClickError( item.focusElement, item.scrollElement )"
					>
						{{ item.message }}
					</a>
				</li>
			</template>
		</ul>
	</div>
</template>

<script setup lang="ts">
import type { ValidationSummaryItem } from '@src/components/shared/validation_summary/ValidationSummaryItem';
import { Validity } from '@src/view_models/Validity';
import { nextTick, ref, watch } from 'vue';
import ScrollTarget from '@src/components/shared/ScrollTarget.vue';

interface Props {
	isVisible: boolean;
	items: ValidationSummaryItem[];
	idNamespace?: string;
	focusOnSubmit?: boolean;
}

const props = withDefaults( defineProps<Props>(), {
	idNamespace: '',
	focusOnSubmit: true,
} );
const errorSummary = ref<HTMLElement>( null );

const onClickError = ( focusElementId: string, scrollElementId: string ) => {
	const focusElement = document.getElementById( focusElementId );
	const scrollElement = document.getElementById( scrollElementId );
	const focusOptions = { preventScroll: false };

	if ( scrollElement ) {
		scrollElement.scrollIntoView( { behavior: 'auto' } );
		focusOptions.preventScroll = true;
	}

	focusElement.focus( focusOptions );
};

watch( () => props.isVisible, async ( newIsVisible: boolean ) => {
	if ( props.focusOnSubmit && newIsVisible ) {
		await nextTick();
		const errorScrollElement = document.getElementById( `${props.idNamespace}error-summary-scroll-target` );
		errorSummary.value.focus( { preventScroll: true } );
		errorScrollElement.scrollIntoView( { behavior: 'auto' } );
	}
} );

</script>

<style lang="scss">
@use '@src/scss/settings/colors';
@use '@src/scss/settings/units';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';

.error-summary {
	background: colors.$red100;
	border: 1px solid colors.$red700;
	padding: map.get( units.$spacing, 'small' );
	margin-bottom: map.get( units.$spacing, 'large' );

	&:focus {
		box-shadow: 0 0 0 1px colors.$red700;
	}

	>:last-child {
		margin-bottom: 0;
	}

	&-heading {
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 16px;
	}

	&-list {
		padding-left: 14px;
	}
}
</style>
