import { DataPersistenceRepository } from '@src/view_models/DataPersistenceRepository';

export default class FakeDataPersistenceRepository implements DataPersistenceRepository {
	public items: Record<string, any>;

	constructor() {
		this.items = {};
	}

	getItems(): Record<string, any> {
		return this.items;
	}

	getItem( key: string ): ArrayBuffer | null {
		const item = this.items[ key ];
		return item !== undefined ? item : null;
	}

	removeItem( key: string ): void {
		delete this.items[ key ];
	}

	setItem( key: string, data: ArrayBuffer ): void {
		this.items[ key ] = data;
	}
}
