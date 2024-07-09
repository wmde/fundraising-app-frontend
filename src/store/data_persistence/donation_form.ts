import { mutation } from '@src/store/util';
import { DataPersistenceMutationType } from '@src/view_models/DataPersistence';
import address from '@src/store/data_persistence/address';

export default [
	{
		storageKey: 'amount',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( 'payment', 'SET_AMOUNT' ),
		fields: [],
	},
	{
		storageKey: 'interval',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( 'payment', 'SET_INTERVAL' ),
		fields: [],
	},
	{
		storageKey: 'type',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( 'payment', 'SET_TYPE' ),
		fields: [],
	},
	{
		storageKey: 'receipt',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( 'address', 'SET_RECEIPT' ),
		fields: [],
	},
	{
		storageKey: 'newsletter',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( 'address', 'SET_NEWSLETTER' ),
		fields: [],
	},
	{
		storageKey: 'addressType',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( 'address', 'SET_ADDRESS_TYPE' ),
		fields: [],
	},
	address( 'address' ),
];
