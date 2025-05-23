<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Pagination Example</h2>
			<hr/>
		</div>

		<nav class="pagination">
			<ul class="cluster">
				<li><button disabled><span class="visually-hidden">Previous Page</span><ChevronLeftIcon/></button></li>
				<li><button aria-current="true"><span class="visually-hidden">Page </span>1</button></li>
				<li><button><span class="visually-hidden">Page </span>2</button></li>
				<li><button><span class="visually-hidden">Page </span>3</button></li>
				<li><button><span class="visually-hidden">Page </span>4</button></li>
				<li><button><span class="visually-hidden">Page </span>5</button></li>
				<li><button><span class="visually-hidden">Page </span>6</button></li>
				<li><button><span class="visually-hidden">Page </span>7</button></li>
				<li><button><span class="visually-hidden">Page </span>8</button></li>
				<li><button><span class="visually-hidden">Page </span>9</button></li>
				<li><button><span class="visually-hidden">Page </span>10</button></li>
				<li><button><span class="visually-hidden">Next Page</span><ChevronRightIcon/></button></li>
			</ul>
		</nav>
	</div>
</template>
<script setup lang="ts">
import ChevronRightIcon from '@src/components/shared/icons/ChevronRightIcon.vue';
import ChevronLeftIcon from '@src/components/shared/icons/ChevronLeftIcon.vue';
defineOptions( { inheritAttrs: false } );
</script>
