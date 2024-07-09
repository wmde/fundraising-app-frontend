import { DataPersistenceMutationType } from '@src/view_models/DataPersistence';
import { mutation } from '@src/store/util';

export default ( namespace: string ) => {
	return {
		storageKey: 'address',
		mutationType: DataPersistenceMutationType.KEY_VALUE_PAIR,
		mutationKey: mutation( namespace, 'SET_ADDRESS_FIELD' ),
		fields: [
			'salutation',
			'title',
			'firstName',
			'lastName',
			'street',
			'postcode',
			'city',
			'country',
			'email',
			'companyName',
			'date',
		],
	};
};
