<template>
	<div class="content-card contact-card" data-sidebar-card>
		<div class="section-heading">
			<h2>{{ $t( 'contact_sidebar_title' ) }}</h2>
			<hr/>
		</div>
		<div class="flow">
			<img :src="assetsPath + '/images/contact-team.png'" :alt="$t( 'contact_sidebar_image_alt' )">
			<p>
				{{ $t( 'contact_sidebar_subtitle' ) }}<br/>
				<small class="highlighted-content-text" data-neutral>{{ $t( 'contact_sidebar_opening' ) }}</small>
			</p>
			<div class="callout" data-borderless data-neutral>
				<div class="icon-text" data-small-heading>
					<div class="icon-text__icon highlighted-icon" aria-hidden="true"><PhoneIcon/></div><a :href="`tel:${ $t( 'contact_sidebar_phone' ) }`">{{ $t( 'contact_sidebar_phone' ) }}</a>
				</div>
				<div class="icon-text" data-small-heading>
					<div class="icon-text__icon highlighted-icon" aria-hidden="true"><MailIcon/></div><a :href="`mailto:${ $t( 'contact_sidebar_email' ) }`">{{ $t( 'contact_sidebar_email' ) }}</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

import PhoneIcon from '@src/components/shared/icons/PhoneIcon.vue';
import MailIcon from '@src/components/shared/icons/MailIcon.vue';

interface Props {
	assetsPath: string;
}

defineProps<Props>();
</script>
