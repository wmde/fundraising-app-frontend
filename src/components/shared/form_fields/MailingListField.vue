<template>
	<FieldContainer :input-id="inputId" :is-max-width-field="isMaxWidthField">
		<template #field>
			<div class="verbose-checkbox flow">
				<CheckboxSingleFormInput
					v-model="fieldModel"
					name="info"
					:input-id="inputId"
					@update:modelValue="onUpdateModel"
					aria-describedby="mailing-list-hint"
				>
					{{ $t( 'donation_form_newsletter_label_paragraph_1' ) }}
				</CheckboxSingleFormInput>
				<p id="mailing-list-hint" v-html="appendCampaignQueryParams( $t( 'donation_form_newsletter_label_paragraph_2'), campaignParams )"/>
			</div>
		</template>
	</FieldContainer>
</template>

<script setup lang="ts">

import CheckboxSingleFormInput from '@src/components/shared/form_elements/CheckboxSingleFormInput.vue';
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import { appendCampaignQueryParams } from '@src/util/append_campaign_query_params';
import { inject } from 'vue';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';
import FieldContainer from '@src/components/patterns/FieldContainer.vue';

interface Props {
	modelValue: boolean;
	inputId: string;
	isMaxWidthField?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'update:modelValue' ] );

const fieldModel = useFieldModel<boolean>( () => props.modelValue, props.modelValue );

const onUpdateModel = ( newValue: boolean ): void => {
	emit( 'update:modelValue', newValue );
};

const campaignParams = inject<string>( QUERY_STRING_INJECTION_KEY, '' );

</script>
