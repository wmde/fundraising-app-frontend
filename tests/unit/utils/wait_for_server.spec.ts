import { ValidationState, waitForServerValidationToFinish } from '@src/util/wait_for_server_validation';
import { createStore } from 'vuex';

describe( 'waitForServerValidationToFinish', () => {
	it( 'instantly returns when not validating', () => {
		const store = createStore( {
			getters: {
				isValidating: () => false,
			},
		} );
		return waitForServerValidationToFinish( store ).then( validationState => {
			expect( validationState ).toBe( ValidationState.IMMEDIATE );
		} );
	} );

	it( 'delays resolution until validation finishes', () => {
		const store = createStore( {
			state: {
				validationInProgress: true,
			},
			getters: {
				isValidating: state => state.validationInProgress,
			},
			mutations: {
				endValidation: state => {
					state.validationInProgress = false;
				},
			},
		} );
		const validationPromise = waitForServerValidationToFinish( store ).then( validationState => {
			expect( validationState ).toBe( ValidationState.WAS_VALIDATING );
		} );
		store.commit( 'endValidation' );
		return validationPromise;
	} );
} );
