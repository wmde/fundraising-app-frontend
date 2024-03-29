import { ActiveDataPersister as DataPersister } from '@src/store/data_persistence/ActiveDataPersister';
import FakeDataPersistenceRepository from '../TestDoubles/FakeDataPersistenceRepository';
import { FakeDataEncryptor, FakeFailingDataEncryptor } from '../TestDoubles/FakeDataEncryptor';

describe( 'Data Persister', () => {
	it( 'saves data', async () => {
		const testKey = 'testKey';
		const testItemKey = 'testItem';
		const testItemData = 'I AM A FREE I AM NOT MAN A NUMBER';
		const fakeDataPersistenceRepository = new FakeDataPersistenceRepository();
		const dataPersister = new DataPersister(
			new FakeDataEncryptor(),
			fakeDataPersistenceRepository,
			testKey,
		);

		await dataPersister.saveToRepository( testItemKey, testItemData );
		const storedItem = fakeDataPersistenceRepository.getItem( `${testKey}/${testItemKey}` );

		expect( storedItem ).not.toBeNull();
		expect( ( storedItem || {} ).byteLength ).toEqual( testItemData.length );
	} );

	it( 'loads data', async () => {
		const testKey = 'testKey';
		const testItemKey = 'testItem';
		const testItemData = 'I AM A FREE I AM NOT MAN A NUMBER';
		const dataPersister = new DataPersister(
			new FakeDataEncryptor(),
			new FakeDataPersistenceRepository(),
			testKey,
		);

		await dataPersister.saveToRepository( testItemKey, testItemData );
		const decoded = await dataPersister.loadFromRepository( testItemKey );

		expect( decoded ).toEqual( testItemData );
	} );

	it( 'clears data if it cant decrypt', async () => {
		const testKey = 'testKey';
		const testItemKey = 'testItem';
		const testItemData = 'I AM A FREE I AM NOT MAN A NUMBER';
		const testDataPersistenceRepository = new FakeDataPersistenceRepository();
		const dataPersister = new DataPersister(
			new FakeFailingDataEncryptor(),
			testDataPersistenceRepository,
			testKey,
		);

		await dataPersister.saveToRepository( testItemKey, testItemData );
		await dataPersister.loadFromRepository( testItemKey );

		expect( testDataPersistenceRepository.getItem( testItemKey ) ).toBeNull();
	} );
} );
