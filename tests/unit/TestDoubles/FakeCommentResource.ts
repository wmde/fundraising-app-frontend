import type { CommentResource } from '@src/api/CommentResource';

export const successMessage = 'Success';
export const failureMessage = 'Fail';

export class FakeSucceedingCommentResource implements CommentResource {
	post(): Promise<string> {
		return Promise.resolve( successMessage );
	}
}

export class FakeFailingCommentResource implements CommentResource {
	post(): Promise<string> {
		return Promise.reject( failureMessage );
	}
}
