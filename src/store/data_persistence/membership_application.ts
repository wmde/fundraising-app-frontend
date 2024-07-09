import { mutation } from '@src/store/util';
import { NS_MEMBERSHIP_ADDRESS, NS_MEMBERSHIP_FEE } from '@src/store/namespaces';
import { DataPersistenceMutationType } from '@src/view_models/DataPersistence';
import address from '@src/store/data_persistence/address';

export default [
	{
		storageKey: 'membershipType',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( NS_MEMBERSHIP_ADDRESS, 'SET_MEMBERSHIP_TYPE' ),
		fields: [],
	},
	{
		storageKey: 'addressType',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( NS_MEMBERSHIP_ADDRESS, 'SET_ADDRESS_TYPE' ),
		fields: [],
	},
	{
		storageKey: 'fee',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( NS_MEMBERSHIP_FEE, 'SET_FEE' ),
		fields: [],
	},
	{
		storageKey: 'receipt',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( NS_MEMBERSHIP_ADDRESS, 'SET_RECEIPT' ),
		fields: [],
	},
	{
		storageKey: 'incentives',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( NS_MEMBERSHIP_ADDRESS, 'SET_INCENTIVES' ),
		fields: [],
	},
	{
		storageKey: 'interval',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( NS_MEMBERSHIP_FEE, 'SET_INTERVAL' ),
		fields: [],
	},
	{
		storageKey: 'type',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( NS_MEMBERSHIP_FEE, 'SET_TYPE' ),
		fields: [],
	},
	address( NS_MEMBERSHIP_ADDRESS ),
];
