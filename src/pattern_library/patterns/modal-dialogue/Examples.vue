<template>
	<div class="content-card flow">
		<div class="section-heading">
			<h2>Modal Dialogue Example</h2>
			<hr/>
		</div>

		<button class="button" @click="modalIsVisible = true">Show Modal</button>
	</div>

	<div>
		<dialog class="modal-dialogue" closedby="any" ref="dialog">
			<div class="modal-dialogue__heading repel" data-nowrap>
				<h2>I am a modal</h2>
				<button class="modal-dialogue__close" @click="modalIsVisible = false"><Close/></button>
			</div>
			<div class="modal-dialogue__scroll">
				<div class="modal-dialogue__content flow">
					<p v-for="n in 20" :key="n">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur culpa molestiae molestias sapiente.
						Architecto dignissimos dolorem doloremque excepturi hic laborum magni minima nulla numquam perferendis
						repudiandae sit totam, voluptates. Maiores.
					</p>
				</div>
			</div>
		</dialog>
	</div>
</template>
<script setup lang="ts">
import Close from '@src/pattern_library/components/icons/Close.vue';
import { ref, watch } from 'vue';

defineOptions( { inheritAttrs: false } );
const dialog = ref<HTMLDialogElement>( null );
const modalIsVisible = ref<boolean>( false );

watch( modalIsVisible, ( visible: boolean ) => {
	if ( visible ) {
		dialog.value.showModal();
	} else {
		dialog.value.close();
	}
} );

</script>
