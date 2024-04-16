import { Store } from 'vuex';
import { DataEncryptor } from '@src/view_models/DataEncryptor';
import { DataPersistenceRepository } from '@src/view_models/DataPersistenceRepository';
import { DataPersister } from '@src/view_models/DataPersistence';
import { FakeDataEncryptor } from './FakeDataEncryptor';
import FakeDataPersistenceRepository from './FakeDataPersistenceRepository';

export default class FakeDataPersister implements DataPersister {
	dataEncryptor: DataEncryptor;
	initialValues: { key: string; value: any }[];
	keyNamespace: string;
	repository: DataPersistenceRepository;

	constructor( initialValues: { key: string; value: any }[] ) {
		this.initialValues = initialValues;

		this.dataEncryptor = new FakeDataEncryptor();
		this.keyNamespace = 'not a real namespace';
		this.repository = new FakeDataPersistenceRepository();
	}

	async initialize(): Promise<void> {
		return Promise.resolve( undefined );
	}

	getValue( key: string ): any {
		const foundItem = this.initialValues.find( item => item.key === key );
		return foundItem ? foundItem.value : null;
	}

	getPlugin(): ( store: Store<any> ) => void {
		return () => {};
	}

	async loadFromRepository(): Promise<null | string> {
		return Promise.resolve( null );
	}

	async saveToRepository(): Promise<void> {
		return Promise.resolve( undefined );
	}
}
