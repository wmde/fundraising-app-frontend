<template>
	<div class="feedback-wrapper has-margin-top-0 ">

		<div class="feedback-overlay-mobile transform" :class="{'animate-in': isExpanded}">

			<div class="feedback-tab-mobile">
				<a
					@click="isExpanded = !isExpanded"
					type="is-primary is-low"
					class="button is-primary is-main ">
					<span class="text-desktop"> > Schwierigkeiten beim Ausfüllen? </span>
					<span class="text-mobile">
					Feedback
					<b-icon v-if="isExpanded" icon="arrow-up" class="icon-size text-mobile"></b-icon>
					<b-icon v-else icon="arrow-down" class="icon-size text-mobile"></b-icon>
				</span>
				</a>
			</div>
			<div class="feedback-box-mobile" >
				<b-button @click="isExpanded = false" class="feedback-close" >
					X
				</b-button>
				<h3 class="text-mobile">Haben Sie Schwierigkeiten?</h3>
				<p>
					Wenn Sie Probleme beim Ausfüllen des Spendenformulars haben oder etwas vermissen, dann freuen
					wir uns über Ihr Feedback.
				</p>

				<div class="button-group has-margin-top-18" >
					<b-button @click="isExpanded = false"
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

		</div>
		<!--
			// TODO: for mobile:
				<b-button v-if="!isExpanded"
					@click="isExpanded = true"
					type="is-primary is-low"
					class="button is-primary is-main ">
					Feedback
					<b-icon v-if="isOpen" icon="arrow-up" class="icon-size"></b-icon>
					<b-icon v-else icon="arrow-down" class="icon-size"></b-icon>
				</b-button>
				<div>
				display block, style with blue color
				</div>
			-->









		<!-- desktop -->
		<div class="feedback-overlay-desktop">

			<div class="feedback-button">
				<a v-if="!isExpanded"
					@click="isExpanded = true"
					type="is-primary is-low"
					class="button is-primary is-main ">
					<span> > Schwierigkeiten beim Ausfüllen? </span>
				</a>
			</div>

			<div class="feedback-box" v-if="isExpanded">
				<b-button @click="isExpanded = false" class="feedback-close" >
					X
				</b-button>
				<h3 class="text-desktop">Haben Sie evtl. Schwierigkeiten beim Ausfüllen des Formulars?</h3>
				<h3 class="text-mobile">Haben Sie Schwierigkeiten?</h3>
				<p>
					Wenn Sie Probleme beim Ausfüllen des Spendenformulars haben oder etwas vermissen, dann freuen
					wir uns über Ihr Feedback.
				</p>

				<div class="button-group has-margin-top-18" >
					<b-button @click="isExpanded = false"
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

		</div>

	</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend( {
	name: 'FeedbackBox',
	data() {
		return {
			isExpanded: false,
		};
	},
} );
</script>
