<template>
	<div class="feedback-content-box">

		<a @click="$emit( 'collapse-feedback-box' )" class="feedback-close">
			<CloseIcon/>
		</a>
		<h3 class="text-desktop">Haben Sie evtl. Schwierigkeiten beim Ausfüllen des Formulars?</h3>
		<h3 class="text-mobile">Haben Sie Schwierigkeiten?</h3>
		<p>
			Wenn Sie Probleme beim Ausfüllen des Spendenformulars haben oder etwas vermissen, dann freuen
			wir uns über Ihr Feedback.
		</p>

		<div class="button-group has-margin-top-18" >
			<b-button @click="$emit( 'collapse-feedback-box' )"
				class="button is-primary">
				Nein, alles gut
			</b-button>
			<a href="https://lime.wikimedia.de/index.php/426896"
				target="_blank"
				class="button is-primary">
				Ja, Feedback geben
			</a>
		</div>

	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import CloseIcon from '@/components/pages/donation_form/FeedbackOverlay/CloseIcon.vue';

export default Vue.extend( {
	name: 'FeedbackBoxContent',
	components: { CloseIcon },
	data() {
		return {
			isExpanded: this.$props.isExpanded,
		};
	},
	props: {
		isExpanded: Boolean,
	},
} );
</script>
