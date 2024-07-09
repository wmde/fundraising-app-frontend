import { mutation } from '@src/store/util';
import { NS_ADDRESS, NS_PAYMENT } from '@src/store/namespaces';
import { SET_AMOUNT, SET_INTERVAL, SET_TYPE } from '@src/store/payment/mutationTypes';
import { DataPersistenceMutationType } from '@src/view_models/DataPersistence';
import address from '@src/store/data_persistence/address';

export default [
	{
		storageKey: 'amount',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( NS_PAYMENT, SET_AMOUNT ),
		fields: [],
	},
	{
		storageKey: 'interval',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( NS_PAYMENT, SET_INTERVAL ),
		fields: [],
	},
	{
		storageKey: 'type',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( NS_PAYMENT, SET_TYPE ),
		fields: [],
	},
	{
		storageKey: 'receipt',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( NS_ADDRESS, 'SET_RECEIPT' ),
		fields: [],
	},
	{
		storageKey: 'newsletter',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( NS_ADDRESS, 'SET_NEWSLETTER' ),
		fields: [],
	},
	{
		storageKey: 'addressType',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( NS_ADDRESS, 'SET_ADDRESS_TYPE' ),
		fields: [],
	},
	address( NS_ADDRESS ),
];
