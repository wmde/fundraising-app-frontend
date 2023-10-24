<template>
	<RadioField
		name="membershipType"
		:options="[
			{
				value: MembershipTypeModel.SUSTAINING,
				label: $t( 'membership_form_membershiptype_option_sustaining' ),
			},
			{
				value: MembershipTypeModel.ACTIVE,
				label: $t( 'membership_form_membershiptype_option_active' ),
			},
		]"
		v-model="fieldModel"
		@update:modelValue="onUpdateModel"
		alignment="column"
		:required="true"
		:disabled="disabledMembershipTypes"
		:show-error="activeTypeSelectedAndDisabled"
		:error-message="$t('membership_form_membershiptype_error')"
	>
		<template #message-0>
			<div class="option-info-message">
				{{ $t( 'membership_form_membershiptype_option_sustaining_legend' ) }}
			</div>
		</template>
		<template #message-1>
			<div class="option-info-message">
				{{ $t( 'membership_form_membershiptype_option_active_legend' ) }}
			</div>
		</template>

	</RadioField>
</template>

<script setup lang="ts">
import { MembershipTypeModel } from '@src/view_models/MembershipTypeModel';
import RadioField from '@src/components/shared/form_fields/RadioField.vue';
import { useFieldModel } from '@src/components/shared/form_fields/useFieldModel';
import { computed } from 'vue';

interface Props {
	modelValue: number;
	disabledMembershipTypes: number[];
}

const props = defineProps<Props>();
const emit = defineEmits( [ 'update:modelValue' ] );

const fieldModel = useFieldModel<number>( () => props.modelValue, props.modelValue );

const onUpdateModel = ( newValue: number ): void => {
	emit( 'update:modelValue', newValue );
};

const activeTypeSelectedAndDisabled = computed( (): boolean => {
	const activeOptionIsDisabled = props.disabledMembershipTypes.indexOf( MembershipTypeModel.ACTIVE ) > -1;
	return fieldModel.value === MembershipTypeModel.ACTIVE && activeOptionIsDisabled;
} );

</script>

<style lang="scss">

</style>
