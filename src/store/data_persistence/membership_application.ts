import { mutation } from '@src/store/util';
import { DataPersistenceMutationType } from '@src/view_models/DataPersistence';
import address from '@src/store/data_persistence/address';
import bankdata from '@src/store/data_persistence/bankdata';

export default [
	{
		storageKey: 'membershipType',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( 'membership_address', 'SET_MEMBERSHIP_TYPE' ),
		fields: [],
	},
	{
		storageKey: 'addressType',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( 'membership_address', 'SET_ADDRESS_TYPE' ),
		fields: [],
	},
	{
		storageKey: 'fee',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( 'membership_fee', 'SET_FEE' ),
		fields: [],
	},
	{
		storageKey: 'receipt',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( 'membership_address', 'SET_RECEIPT' ),
		fields: [],
	},
	{
		storageKey: 'incentives',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( 'membership_address', 'SET_INCENTIVES' ),
		fields: [],
	},
	{
		storageKey: 'interval',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( 'membership_fee', 'SET_INTERVAL' ),
		fields: [],
	},
	{
		storageKey: 'type',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( 'membership_fee', 'SET_TYPE' ),
		fields: [],
	},
	address( 'membership_address' ),
	...bankdata,
];
