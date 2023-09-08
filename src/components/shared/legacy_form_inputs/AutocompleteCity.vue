<template>
	<div class="autocomplete control">
		<TextInput
			v-model="city"
			:placeholder="$t( placeholder, { example: $t( examplePlaceholder ) } )"
			:has-error="hasError"
			input-id="city"
			name="city"
			@focus="onFocus"
			@blur="onBlur"
		/>
		<transition name="fade">
			<div class="dropdown-menu" v-show="autocompleteIsActive">
				<div class="dropdown-content">
					<template v-for="city in cities">
						<a class="dropdown-item" role="button" tabindex="0" @click.stop="onSelectCity( city )">
							<strong>{{ postcode }}</strong> {{ city }}
						</a>
					</template>
				</div>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, nextTick, onMounted, ref, watch } from 'vue';
import { CityAutocompleteResource, NullCityAutocompleteResource } from '@src/CityAutocompleteResource';
import TextInput from '@src/components/shared/legacy_form_inputs/TextInput.vue';
import { useCitiesResource } from '@src/components/shared/legacy_form_inputs/useCitiesResource';

export default defineComponent( {
	name: 'AutocompleteCity',
	components: { TextInput },
	props: {
		examplePlaceholder: String,
		modelValue: String,
		hasError: Boolean,
		postcode: String,
	},
	setup( props, { emit } ) {
		const autocompleteIsActive = ref<Boolean>( false );
		const city = ref<string>( props.modelValue );
		const { cities, fetchCitiesForPostcode } = useCitiesResource( inject<CityAutocompleteResource>( 'cityAutocompleteResource', NullCityAutocompleteResource ) );

		const placeholder = computed( () => {
			if ( cities.value.length > 0 ) {
				return 'form_autocomplete_prompt';
			}
			return 'form_for_example';
		} );

		const onFocus = ( event: Event ) => {
			autocompleteIsActive.value = true;
			( event.target as HTMLInputElement ).select();
		};

		const onBlur = () => {
			setTimeout( () => {
				autocompleteIsActive.value = false;
			}, 200 );
			emit( 'field-changed' );
		};

		const onSelectCity = async ( newCity: string ) => {
			city.value = newCity;
			await nextTick();
			emit( 'field-changed' );
		};

		onMounted( () => {
			fetchCitiesForPostcode( props.postcode as string );
		} );

		watch( (): string => props.postcode as string, ( value: string ) => {
			fetchCitiesForPostcode( value );
		} );

		watch( city, ( newCity: string ) => {
			emit( 'update:modelValue', newCity );
		} );

		return {
			autocompleteIsActive,
			cities,
			city,
			placeholder,
			onFocus,
			onBlur,
			onSelectCity,
		};
	},
} );
</script>
