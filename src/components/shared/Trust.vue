<template>
	<div class="trust-message">
		<img :src="assetsPath + '/images/Icon_trust.svg'"/> {{ $t( 'form_trust_message' ) }}
	</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend( {
	name: 'trust',
	props: {
		assetsPath: String,
	},
} );
</script>
