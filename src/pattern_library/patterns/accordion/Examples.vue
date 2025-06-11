<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Standard Accordion</h2>
			<hr/>
		</div>

		<div class="accordion">
			<details>
				<summary tabindex="0">I am a details summary Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
					<span class="accordion__summary-meta"><ChevronDown/></span></summary>
				<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit
					 ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.
				</div>
			</details>
			<details>
				<summary tabindex="0">I am a details summary <span class="accordion__summary-meta">€1200 <ChevronDown/></span></summary>
				<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit
					 ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.
				</div>
			</details>
			<details>
				<summary tabindex="0">I am a details summary <span class="accordion__summary-meta"><ChevronDown/></span></summary>
				<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit
					 ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.
				</div>
			</details>
			<details>
				<summary tabindex="0">I am a details summary <span class="accordion__summary-meta">€1200 <ChevronDown/></span></summary>
				<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit
					 ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.
				</div>
			</details>
			<details>
				<summary tabindex="0">I am a details summary <span class="accordion__summary-meta"><ChevronDown/></span></summary>
				<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit
					 ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.
				</div>
			</details>
			<details>
				<summary tabindex="0">I am a details summary <span class="accordion__summary-meta">€1200 <ChevronDown/></span></summary>
				<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit
					 ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.
				</div>
			</details>
		</div>

	</div>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Wikimedia Themed Accordion</h2>
			<hr/>
		</div>

		<div class="accordion" data-theme="wikimedia">
			<details>
				<summary tabindex="0">I am a details summary Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
					<span class="accordion__summary-meta"><ChevronDown/></span></summary>
				<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit
					 ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.
				</div>
			</details>
			<details>
				<summary tabindex="0">I am a details summary <span class="accordion__summary-meta">€1200 <ChevronDown/></span></summary>
				<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit
					 ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.
				</div>
			</details>
			<details>
				<summary tabindex="0">I am a details summary <span class="accordion__summary-meta"><ChevronDown/></span></summary>
				<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit
					 ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.
				</div>
			</details>
			<details>
				<summary tabindex="0">I am a details summary <span class="accordion__summary-meta">€1200 <ChevronDown/></span></summary>
				<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit
					 ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.
				</div>
			</details>
			<details>
				<summary tabindex="0">I am a details summary <span class="accordion__summary-meta"><ChevronDown/></span></summary>
				<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit
					 ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.
				</div>
			</details>
			<details>
				<summary tabindex="0">I am a details summary <span class="accordion__summary-meta">€1200 <ChevronDown/></span></summary>
				<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, aperiam asperiores blanditiis cumque dolorum ducimus illum laboriosam minus quibusdam sit
					 ullam, vel, voluptas. Consectetur excepturi fuga in nostrum tempora veritatis.
				</div>
			</details>
		</div>
	</div>

</template>

<script setup lang="ts">
import ChevronDown from '@src/components/shared/icons/ChevronDown.vue';
defineOptions( { inheritAttrs: false } );
</script>
