import { Ref, ref } from 'vue';

interface ReturnType {
	itemOpen: Ref<boolean>;
	itemAnimating: Ref<boolean>;
	itemContent: Ref<HTMLElement>;
	itemContentHeight: Ref<number>;
	open: () => void;
	close: () => void;
	toggleItem: () => void;
}

export function useFormAccordionItem( transitionTime: number, startOpen: boolean ): ReturnType {
	const itemOpen = ref<boolean>( startOpen );
	const itemAnimating = ref<boolean>( false );
	const itemContent = ref<HTMLElement>( null );
	const itemContentHeight = ref<number>( 0 );

	const open = (): void => {
		itemContentHeight.value = itemContent.value.offsetHeight;
		itemAnimating.value = true;
		setTimeout( () => {
			itemAnimating.value = false;
			itemOpen.value = true;
		}, transitionTime );
	};

	const close = (): void => {
		itemContentHeight.value = itemContent.value.offsetHeight;
		itemOpen.value = false;
		itemAnimating.value = true;
		setTimeout( () => {
			itemAnimating.value = false;
		} );
	};

	const toggleItem = (): void => {
		itemContentHeight.value = itemContent.value.offsetHeight;

		if ( !itemOpen.value ) {
			open();
		} else {
			close();
		}
	};

	return {
		itemOpen,
		itemAnimating,
		itemContent,
		itemContentHeight,
		open,
		close,
		toggleItem,
	};
}
