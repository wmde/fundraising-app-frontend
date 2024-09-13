<template>
	<div class="loading-spinner-ring"><div/><div/><div/><div/></div>
</template>

<style lang="scss">
@use 'src/scss/settings/colors';

.loading-spinner-ring {
	display: inline-block;
	position: relative;
	width: 72px;
	height: 72px;
}

.loading-spinner-ring div {
	box-sizing: border-box;
	display: block;
	position: absolute;
	width: 100%;
	height: 100%;
	border: 8px solid colors.$gray-mid;
	border-radius: 50%;
	animation: loading-spinner-ring 1.2s cubic-bezier( 0.5, 0, 0.5, 1 ) infinite;
	border-color: colors.$gray-mid transparent transparent transparent;
}

.loading-spinner-ring div:nth-child(1) {
	animation-delay: -0.45s;
}

.loading-spinner-ring div:nth-child(2) {
	animation-delay: -0.3s;
}

.loading-spinner-ring div:nth-child(3) {
	animation-delay: -0.15s;
}

@keyframes loading-spinner-ring {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
