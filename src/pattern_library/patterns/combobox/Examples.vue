<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Combobox Examples</h2>
			<hr/>
		</div>

		<div class="field-container flow">
			<label for="country">Country</label>
			<div class="combobox">
				<input type="text" name="country" id="country" v-model="countryName">
				<ul class="combobox__dropdown" tabindex="-1">
					<li v-for="(country, index) in countries.filter(x => x.isFrequent)" :key="index">
						<label><input type="radio" name="country-selection" class="visually-hidden" v-model="selectedCountry" :value="country.label">{{ country.label }}</label>
					</li>
					<li aria-hidden="true">
						<hr>
					</li>
					<li v-for="(country, index) in countries.filter(x => !x.isFrequent).sort( ( x, y ) => x.label.localeCompare( y.label ) )" :key="index">
						<label><input type="radio" name="country-selection" class="visually-hidden" v-model="selectedCountry" :value="country.label">{{ country.label }}</label>
					</li>
				</ul>
			</div>
			<p class="field-container__error-text">Please enter a country.</p>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';

defineOptions( { inheritAttrs: false } );

interface Country {
	label: string;
	isFrequent: boolean;
}

const countries: Country[] = [
	{
		label: 'Ireland',
		isFrequent: false,
	},
	{
		label: 'Germany',
		isFrequent: true,
	},
	{
		label: 'France',
		isFrequent: true,
	},
	{
		label: 'Spain',
		isFrequent: true,
	},
	{
		label: 'Morocco',
		isFrequent: false,
	},
];

const selectedCountry = ref<string>( countries.find( x => x.label === 'Germany' ).label );
const countryName = ref<string>( selectedCountry.value );

watch( selectedCountry, ( newCountry: string ): void => {
	countryName.value = newCountry;
} );

</script>
