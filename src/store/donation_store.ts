import { InjectionKey } from 'vue';
import Vuex, { Store, StoreOptions } from 'vuex';
import createPayment from '@src/store/payment';
import createAddress from '@src/store/address';
import createBankData from '@src/store/bankdata';

import { REQUIRED_FIELDS } from '@src/store/address/constants';
import {
	NS_PAYMENT,
	NS_ADDRESS,
	NS_BANKDATA,
} from './namespaces';

export function createStore( plugins: Array< ( s: Store<any> ) => void > = [] ) {
	const storeBundle: StoreOptions<any> = {
		modules: {
			[ NS_PAYMENT ]: createPayment(),
			[ NS_ADDRESS ]: createAddress( REQUIRED_FIELDS ),
			[ NS_BANKDATA ]: createBankData(),
		},
		strict: process.env.NODE_ENV !== 'production',
		getters: {
			isValidating: function ( state ): boolean {
				return state[ NS_PAYMENT ].isValidating ||
					state[ NS_ADDRESS ].serverSideValidationCount > 0 ||
					state[ NS_BANKDATA ].isValidating;
			},
		},
		plugins,
	};

	return new Vuex.Store<any>( storeBundle );
}

export const StoreKey: InjectionKey<Store<any>> = Symbol( 'Store' );
