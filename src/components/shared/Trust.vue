<template>
  <feature-toggle>
    <div class="trust-message" slot="campaigns.encryption_hint.visible">
      <img :src="assetsPath + '/images/Icon_trust.svg'"/> {{ $t( 'form_trust_message' ) }}
    </div>
    <div class="trust-message" slot="campaigns.encryption_hint.not_visible">
    </div>
  </feature-toggle>
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
