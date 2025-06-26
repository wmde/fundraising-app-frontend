<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>More Information Toggle Example</h2>
			<hr/>
		</div>

		<details class="more-info-toggle">
			<summary><small>More Information</small></summary>
			<p><small>This is all the more info. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque laudantium nisi possimus, quas repudiandae veritatis? Architecto blanditiis, et impedit in incidunt inventore laborum molestiae molestias odio pariatur rem sit veniam.</small></p>
		</details>

		<button class="button" data-button-style="hollow">Enter Postal Address</button>

		<details class="more-info-toggle">
			<summary><small>More Information</small></summary>
			<p><small>This is all the more info. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque laudantium nisi possimus, quas repudiandae veritatis? Architecto blanditiis, et impedit in incidunt inventore laborum molestiae molestias odio pariatur rem sit veniam.</small></p>
		</details>
	</div>
</template>
<script setup lang="ts">
defineOptions( { inheritAttrs: false } );
</script>
