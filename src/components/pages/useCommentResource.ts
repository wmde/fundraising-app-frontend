import { ref } from 'vue';
import type { Comment } from '@src/view_models/Comment';
import { commentModelsFromObject } from '@src/view_models/Comment';
import axios from 'axios';

export function useCommentResource() {
	const comments = ref<Comment[]>( [] );

	const fetchComments = async (): Promise<void> => {
		try {
			let response = await axios.get( '/list-comments.json?n=100&anon=1' );
			comments.value = commentModelsFromObject( response.data );
			return Promise.resolve();
		} catch {
			return Promise.reject();
		}
	};

	return {
		comments,
		fetchComments,
	};
}
