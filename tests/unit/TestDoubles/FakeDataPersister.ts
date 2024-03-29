import { Store } from 'vuex';
import { DataEncryptor } from '@src/view_models/DataEncryptor';
import { DataPersistenceRepository } from '@src/view_models/DataPersistenceRepository';
import { DataPersistenceItem, DataPersister } from '@src/view_models/DataPersistence';
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

	async initialize( items: DataPersistenceItem[] ): Promise<void> {
		return Promise.resolve( undefined );
	}

	getValue( key: string ): any {
		const item = this.initialValues.find( item => item.key === key );
		return item ? item.value : null;
	}

	getPlugin( items: DataPersistenceItem[] ): ( store: Store<any> ) => void {
		return () => {};
	}

	async loadFromRepository( key: string ): Promise<null | string> {
		return Promise.resolve( null );
	}

	async saveToRepository( key: string, data: string ): Promise<void> {
		return Promise.resolve( undefined );
	}
}
