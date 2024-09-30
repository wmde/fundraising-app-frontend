import axios, { AxiosResponse } from 'axios';

export interface CommentRequest {
	donationId: number;
	updateToken: string;
	comment: string;
	withName: boolean;
	isPublic: boolean;
}

interface CommentResponse {
	status: string;
	message: string;
}

export interface CommentResource {
	post: ( data: CommentRequest ) => Promise<string>;
}

export class ApiCommentResource implements CommentResource {
	postEndpoint: string;

	constructor( postEndpoint: string ) {
		this.postEndpoint = postEndpoint;
	}

	post( data: CommentRequest ): Promise<string> {
		return axios.post( this.postEndpoint, data ).then( ( validationResult: AxiosResponse<CommentResponse> ) => {
			if ( validationResult.data.status !== 'OK' ) {
				return Promise.reject( validationResult.data.message );
			}
			return validationResult.data.message;
		} );
	}
}
