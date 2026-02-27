<template>
	<div class="sidebar">
		<aside>
			<div class="content-card contact-card" data-sidebar-card>
				<div class="section-heading">
					<h2>Fragen oder Anmerkungen?</h2>
					<hr/>
				</div>
				<div class="flow">
					<img :src="assetsPath + '/images/contact-team.png'" alt="Wikimedia Deutschland">
					<p>
						Unser Service-Team hilft gerne<br/>
						<small class="highlighted-content-text" data-neutral>Montag bis Freitag, 9:00 - 17:00 Uhr</small>
					</p>
					<div class="callout" data-borderless data-neutral>
						<div class="icon-text" data-small-heading>
							<div class="icon-text__icon highlighted-icon" aria-hidden="true"><PhoneIcon/></div><a href="tel: (030) 577 11 62-19">(030) 577 11 62-19</a>
						</div>
						<div class="icon-text" data-small-heading>
							<div class="icon-text__icon highlighted-icon" aria-hidden="true"><MailIcon/></div><a href="mailto:kontakt@wikimedia.de">kontakt@wikimedia.de</a>
						</div>
					</div>
				</div>
			</div>
		</aside>
		<div>
			&nbsp;
		</div>
	</div>
</template>
<script setup lang="ts">
import PhoneIcon from '@src/pattern_library/components/icons/PhoneIcon.vue';
import MailIcon from '@src/pattern_library/components/icons/MailIcon.vue';

defineOptions( { inheritAttrs: false } );

interface Props {
	assetsPath: string;
}

defineProps<Props>();

</script>
