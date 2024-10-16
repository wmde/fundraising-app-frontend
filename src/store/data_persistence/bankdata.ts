import { DataPersistenceMutationType } from '@src/view_models/DataPersistence';
import { mutation } from '@src/store/util';

export default [
	{
		storageKey: 'bankName',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( 'bankdata', 'SET_BANK_NAME' ),
		fields: [],
	},
	{
		storageKey: 'iban',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( 'bankdata', 'SET_IBAN' ),
		fields: [],
	},
	{
		storageKey: 'bic',
		mutationType: DataPersistenceMutationType.VALUE,
		mutationKey: mutation( 'bankdata', 'SET_BIC' ),
		fields: [],
	},
];
