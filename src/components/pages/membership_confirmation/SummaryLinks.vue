<template>
	<div class="membership-summary-links is-hidden-print">
		<ul>
			<li><a href="javascript:window.print()">{{ $t( 'donation_confirmation_print_confirmation' ) }}</a></li>
		</ul>
	</div>
</template>

<style lang="scss">
.membership-summary-links {
	ul {
		list-style-type: none;
		padding-left: 0;
	}
}
</style>
