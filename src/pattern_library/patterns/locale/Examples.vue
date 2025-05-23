<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Locale Example</h2>
			<hr/>
		</div>

		<div class="locale" :class="{ 'locale--active': localeActive }">
			<button class="locale__button" @click="localeActive = !localeActive">
				<LocaleIcon/><span>en</span><ChevronDown/>
			</button>
			<form action="/" class="locale__form">
				<label><input type="radio" name="locale" value="de"> Deutsch</label>
				<label><input type="radio" name="locale" value="en" checked> English</label>
				<button class="button" type="submit" data-button-size="small">Set Language</button>
			</form>
		</div>
	</div>
</template>
<script setup lang="ts">
import LocaleIcon from '@src/components/shared/icons/LocaleIcon.vue';
import ChevronDown from '@src/components/shared/icons/ChevronDown.vue';
import { ref } from 'vue';

defineOptions( { inheritAttrs: false } );
const localeActive = ref<boolean>( false );
</script>
