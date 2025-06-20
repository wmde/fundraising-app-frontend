/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import type { DataPersistenceItem, DataPersister } from '@src/view_models/DataPersistence';

export class InactiveDataPersister implements DataPersister {
	initialize( items: DataPersistenceItem[] ): Promise<void> {
		return Promise.resolve( undefined );
	}

	getValue( key: string ): string | null {
		return null;
	}

	getPlugin( items: DataPersistenceItem[] ): any {
		return () => {};
	}

	loadFromRepository( key: string ): Promise<string | null> {
		return Promise.resolve( null );
	}

	saveToRepository( key: string, data: string ): void {
	}
}
