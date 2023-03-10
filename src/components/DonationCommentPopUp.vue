<template>
	<form id="laika-comment" name="laika-comment" v-on:submit.prevent="postComment" method="post" ref="form" class="modal-card">
		<input type="hidden" name="donationId" :value="donation.id"/>
		<input type="hidden" name="updateToken" :value="donation.updateToken">
		<input type="hidden" name="isAnonymous" value="1" />
		<div v-if="commentHasBeenSubmitted">
			<p v-html="$t( serverResponse )"></p>
			<b-button type="is-primary is-main has-margin-top-18" @click="$parent.close()" outlined>
				{{ $t( 'back_to_donation_summary' ) }}
			</b-button>
		</div>
		<div v-else>
			<p class="modal-card-title has-margin-bottom-18">{{ $t( 'donation_comment_popup_title' ) }}</p><br>
			<p class="has-margin-bottom-18">{{ $t( 'donation_comment_popup_explanation' ) }}</p>
			<div class="has-margin-bottom-18">
				<label for="comment">{{ $t( 'donation_comment_popup_label' ) }}</label>
				<b-input id="comment" name="comment" type="textarea"></b-input>
				<p v-if="commentErrored" class="help is-danger"> {{ $t( 'donation_comment_popup_error' ) }}</p>
			</div>
			<div class="field has-margin-bottom-18" v-if="showPublishAuthor">
				<b-checkbox type="checkbox" id="isAnonymous" name="isAnonymous" native-value="0"
							v-model="commentHasPublicAuthorName">
					<span v-html="$t( 'donation_comment_popup_is_anon' )"></span>
				</b-checkbox>
			</div>
			<div class="field has-margin-bottom-18">
				<b-checkbox type="checkbox" id="public" name="public" native-value="1"
							v-model="commentIsPublic">{{ $t( 'donation_comment_popup_is_public' ) }}</b-checkbox>
			</div>
			<div class="columns">
				<div class="column">
					<b-button type="is-primary is-main level-item" @click="$parent.close()" outlined>
						{{ $t( 'donation_comment_popup_cancel' ) }}
					</b-button>
				</div>
				<div class="column">
					<b-button type="is-primary is-main level-item" native-type="submit">
						{{ $t( 'donation_comment_popup_submit' ) }}
					</b-button>
				</div>
			</div>
		</div>
	</form>
</template>

<script lang="ts">
import Vue from 'vue';
import axios, { AxiosResponse } from 'axios';
import { trackDynamicForm, trackFormSubmission } from '@/tracking';
import { addressTypeFromName, AddressTypeModel } from '@/view_models/AddressTypeModel';
import { Donation } from '@/view_models/Donation';

export default Vue.extend( {
	name: 'DonationCommentPopUp',
	data: function () {
		return {
			commentIsPublic: false,
			commentHasPublicAuthorName: false,
			commentErrored: false,
			commentHasBeenSubmitted: false,
			serverResponse: '',
		};
	},
	props: {
		donation: Object as () => Donation,
		addressType: String,
		postCommentUrl: String,
	},
	computed: {
		showPublishAuthor: {
			get(): boolean {
				return addressTypeFromName( this.$props.addressType ) !== AddressTypeModel.ANON;
			},
		},
	},
	mounted: function () {
		trackDynamicForm();
	},
	methods: {
		postComment() {
			let form = this.$refs.form as HTMLFormElement;
			trackFormSubmission( form );
			const jsonForm = new FormData( form );
			axios.post( this.$props.postCommentUrl, jsonForm )
				.then( ( validationResult: AxiosResponse<any> ) => {
					if ( validationResult.data.status === 'OK' ) {
						this.$data.commentErrored = false;
						this.$data.commentHasBeenSubmitted = true;
						this.$data.serverResponse = validationResult.data.message;
						this.$emit( 'disable-comment-link' );
					} else {
						this.$data.commentErrored = true;
					}
				} );
		},
	},
} );
</script>
