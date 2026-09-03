<template>
	<FieldContainer :input-id="inputId" :is-max-width-field="isMaxWidthField">
		<template #field>
			<div class="verbose-checkbox flow">
				<RadioFormInput
					:id="`${inputId}-yes`"
					v-model="fieldModel"
					:native-value="true"
					name="info"
					@update:modelValue="onUpdateModel"
					aria-describedby="mailing-list-hint"
				>
					<template #label>
						{{ $t( 'donation_form_newsletter_label_yes' ) }}
					</template>
				</RadioFormInput>

				<RadioFormInput
					:id="`${inputId}-no`"
					v-model="fieldModel"
					:native-value="false"
					name="info"
					@update:modelValue="onUpdateModel"
					aria-describedby="mailing-list-hint"
				>
					<template #label>
						{{ $t( 'donation_form_newsletter_label_no' ) }}
					</template>
				</RadioFormInput>
				<p v-html="appendCampaignQueryParams( $t( 'donation_form_newsletter_label_additional'), campaignParams )"/>
			</div>
		</template>
	</FieldContainer>
</template>

<script setup lang="ts">
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import FieldContainer from '@src/components/patterns/FieldContainer.vue';
import RadioFormInput from '@src/components/shared/form_elements/RadioFormInput.vue';
import { appendCampaignQueryParams } from '@src/util/append_campaign_query_params';
import { inject } from 'vue';
import { QUERY_STRING_INJECTION_KEY } from '@src/util/createCampaignQueryString';

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
