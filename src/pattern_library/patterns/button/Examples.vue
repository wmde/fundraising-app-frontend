<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Button Examples</h2>
			<hr/>
		</div>

		<h3>Primary Button</h3>
		<div>
			<p><em><small>(Default / Disabled / Link)</small></em></p>
			<div class="callout cluster" data-transparent>
				<button class="button">Donate Now</button>
				<button class="button" disabled aria-disabled="true">Donate Now</button>
				<a href="/pattern-library/button" class="button">View Our F.A.Q.</a>
			</div>
		</div>

		<h3>Secondary Button</h3>
		<div>
			<p><em><small>(Default / Disabled / Link)</small></em></p>
			<div class="callout cluster" data-transparent>
				<button class="button" data-secondary>Change Payment Details</button>
				<button class="button" data-secondary disabled aria-disabled="true">Change Payment Details</button>
				<a href="/pattern-library/button" class="button" data-secondary>View Our F.A.Q.</a>
			</div>
		</div>

		<h3>Primary Button Small</h3>
		<div>
			<p><em><small>(Default / Disabled / Link)</small></em></p>
			<div class="callout cluster" data-transparent>
				<button class="button" data-size="small">Donate Now</button>
				<button class="button" disabled aria-disabled="true" data-size="small">Donate Now</button>
				<a href="/pattern-library/button" class="button" data-size="small">View Our F.A.Q.</a>
			</div>
		</div>

		<h3>Secondary Button Small</h3>
		<div>
			<p><em><small>(Default / Disabled / Link)</small></em></p>
			<div class="callout cluster" data-transparent>
				<button class="button" data-size="small" data-secondary>Change Payment Details</button>
				<button class="button" data-size="small" data-secondary disabled aria-disabled="true">Change Payment Details</button>
				<a href="/pattern-library/button" class="button" data-secondary data-size="small">View Our F.A.Q.</a>
			</div>
		</div>

		<h3>Primary Button Icon</h3>
		<div>
			<p><em><small>(Default / Disabled / Link)</small></em></p>
			<div class="callout flow" data-transparent>
				<div class="cluster">
					<button class="button"><ShieldIcon/>Donate Now</button>
					<button class="button" disabled aria-disabled="true"><ShieldIcon/>Donate Now</button>
					<a href="/pattern-library/button" class="button"><ShieldIcon/>View Our F.A.Q.</a>
				</div>
				<div class="cluster">
					<button class="button">Donate Now<ShieldIcon/></button>
					<button class="button" disabled aria-disabled="true">Donate Now<ShieldIcon/></button>
					<a href="/pattern-library/button" class="button">View Our F.A.Q.<ShieldIcon/></a>
				</div>
			</div>
		</div>

		<h3>Secondary Button Icon</h3>
		<div>
			<p><em><small>(Default / Disabled / Link)</small></em></p>
			<div class="callout flow" data-transparent>
				<div class="cluster">
					<button class="button" data-secondary><ShieldIcon/>Change Payment Details</button>
					<button class="button" data-secondary disabled aria-disabled="true"><ShieldIcon/>Change Payment Details</button>
					<a href="/pattern-library/button" class="button" data-secondary><ShieldIcon/>View Our F.A.Q.</a>
				</div>
				<div class="cluster">
					<button class="button" data-secondary>Change Payment Details<ShieldIcon/></button>
					<button class="button" data-secondary disabled aria-disabled="true">Change Payment Details<ShieldIcon/></button>
					<a href="/pattern-library/button" class="button" data-secondary>View Our F.A.Q.<ShieldIcon/></a>
				</div>
			</div>
		</div>

		<h3>Primary Button Small Icon</h3>
		<div>
			<p><em><small>(Default / Disabled / Link)</small></em></p>
			<div class="callout flow" data-transparent>
				<div class="cluster">
					<button class="button" data-size="small"><ShieldIcon/>Donate Now</button>
					<button class="button" disabled aria-disabled="true" data-size="small"><ShieldIcon/>Donate Now</button>
					<a href="/pattern-library/button" class="button" data-size="small"><ShieldIcon/>View Our F.A.Q.</a>
				</div>
				<div class="cluster">
					<button class="button" data-size="small">Donate Now<ShieldIcon/></button>
					<button class="button" disabled aria-disabled="true" data-size="small">Donate Now<ShieldIcon/></button>
					<a href="/pattern-library/button" class="button" data-size="small">View Our F.A.Q.<ShieldIcon/></a>
				</div>
			</div>
		</div>

		<h3>Secondary Button Small Icon</h3>
		<div>
			<p><em><small>(Default / Disabled / Link)</small></em></p>
			<div class="callout flow" data-transparent>
				<div class="cluster">
					<button class="button" data-size="small" data-secondary><ShieldIcon/>Change Payment Details</button>
					<button class="button" data-size="small" data-secondary disabled aria-disabled="true"><ShieldIcon/>Change Payment Details</button>
					<a href="/pattern-library/button" class="button" data-secondary data-size="small"><ShieldIcon/>View Our F.A.Q.</a>
				</div>
				<div class="cluster">
					<button class="button" data-size="small" data-secondary>Change Payment Details<ShieldIcon/></button>
					<button class="button" data-size="small" data-secondary disabled aria-disabled="true">Change Payment Details<ShieldIcon/></button>
					<a href="/pattern-library/button" class="button" data-secondary data-size="small">View Our F.A.Q.<ShieldIcon/></a>
				</div>
			</div>
		</div>

	</div>
</template>
<script setup lang="ts">
import ShieldIcon from '@src/pattern_library/components/icons/ShieldIcon.vue';

defineOptions( { inheritAttrs: false } );
</script>
