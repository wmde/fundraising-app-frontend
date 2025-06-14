import type { DataEncryptor } from '@src/view_models/DataEncryptor';
import type { DataPersistenceRepository } from '@src/view_models/DataPersistenceRepository';
import type { DataPersistenceItem, DataPersister } from '@src/view_models/DataPersistence';
import { DataPersistenceMutationType } from '@src/view_models/DataPersistence';
import { MutationPayload, Store } from 'vuex';

export class ActiveDataPersister implements DataPersister {
	dataEncryptor: DataEncryptor;
	repository: DataPersistenceRepository;
	keyNamespace: string;
	initialValues: { key: string; value: any }[];

	constructor( dataEncryptor: DataEncryptor, repository: DataPersistenceRepository, keyNamespace: string ) {
		this.dataEncryptor = dataEncryptor;
		this.repository = repository;
		this.keyNamespace = keyNamespace;
		this.initialValues = [];
	}

	async saveToRepository( key: string, data: string ) {
		const encrypted = await this.dataEncryptor.encrypt( data );
		if ( encrypted !== undefined ) {
			this.repository.setItem( `${this.keyNamespace}/${key}`, encrypted );
		}
	}

	async loadFromRepository( key: string ) {
		const data = this.repository.getItem( `${this.keyNamespace}/${key}` );

		if ( !data ) {
			return null;
		}

		try {
			return await this.dataEncryptor.decrypt( data );
		} catch {
			this.repository.removeItem( `${this.keyNamespace}/${key}` );
			return null;
		}
	}

	getPlugin( items: DataPersistenceItem[] ) {
		return ( store: Store<any> ) => {
			store.subscribe( ( mutation: MutationPayload ) => {
				const persistenceItem = items.find( item => item.mutationKey === mutation.type );
				if ( !persistenceItem ) {
					return;
				}
				switch ( persistenceItem.mutationType ) {
					case DataPersistenceMutationType.VALUE:
						this.saveToRepository( persistenceItem.storageKey, JSON.stringify( mutation.payload ) );
						break;
					case DataPersistenceMutationType.KEY_VALUE_PAIR:
						if ( persistenceItem.fields.includes( mutation.payload.name ) ) {
							this.saveToRepository( mutation.payload.name, JSON.stringify( mutation.payload.value ) );
						}
						break;
				}
			} );
		};
	}

	async initialize( items: DataPersistenceItem[] ) {
		for ( const item of items ) {
			switch ( item.mutationType ) {
				case DataPersistenceMutationType.VALUE:
					await this.decryptValue( item.storageKey );
					break;
				case DataPersistenceMutationType.KEY_VALUE_PAIR:
					for ( let i = 0; i < item.fields.length; i++ ) {
						await this.decryptValue( item.fields[ i ] );
					}
					break;
			}
		}
	}

	async decryptValue( key: string ) {
		await this.loadFromRepository( key ).then( result => {
			if ( result ) {
				this.initialValues.push( { key: key, value: JSON.parse( result ) } );
			}
		} );
	}

	getValue( key: string ) {
		const initialValue = this.initialValues.find( item => item.key === key );
		return initialValue ? initialValue.value : null;
	}
}
