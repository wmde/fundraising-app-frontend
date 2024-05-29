<template>
	<div
		v-if="isVisible"
		ref="errorSummary"
		class="error-summary"
		aria-live="assertive"
		aria-atomic="true"
		aria-relevant="all"
		role="region"
		aria-labelledby="error-summary-heading"
		tabindex="-1"
	>
		<h2 class="error-summary-heading" id="error-summary-heading">{{ $t( 'error_summary_headline' ) }}</h2>
		<ul class="error-summary-list">
			<template v-for="(item, index) in items">
				<li :key="index" v-if="item.validity === Validity.INVALID">
					<a
						:href="`#${item.focusElement}`"
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
import { ValidationSummaryItem } from '@src/components/shared/validation_summary/ValidationSummaryItem';
import { Validity } from '@src/view_models/Validity';
import { nextTick, ref, watch } from 'vue';

interface Props {
	isVisible: boolean;
	items: ValidationSummaryItem[];
}

const props = defineProps<Props>();
const errorSummary = ref<HTMLElement>( null );

const onClickError = ( focusElementId: string, scrollElementId: string ) => {
	const focusElement = document.getElementById( focusElementId );
	const scrollElement = document.getElementById( scrollElementId );
	const focusOptions = { preventScroll: false };

	if ( scrollElement ) {
		scrollElement.scrollIntoView( { behavior: 'smooth' } );
		focusOptions.preventScroll = true;
	}

	focusElement.focus( focusOptions );
};

watch( () => props.isVisible, async ( newIsVisible: boolean ) => {
	if ( newIsVisible ) {
		await nextTick();
		errorSummary.value.focus();
	}
} );

</script>

<style lang="scss">
@use '@src/scss/settings/colors';
@use '@src/scss/settings/units';
@use '@src/scss/settings/breakpoints';
@use 'sass:map';

.app-content .error-summary {
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
	}

	&-list {
		list-style-type: none;
		padding-left: 0;
	}
}
</style>
