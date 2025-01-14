import { DataEncryptor } from '@src/view_models/DataEncryptor';
import { TextEncoder, TextDecoder } from 'util';

export class FakeDataEncryptor implements DataEncryptor {
	decrypt( data: ArrayBuffer ): Promise<string> {
		return Promise.resolve( new TextDecoder().decode( data ) );
	}

	encrypt( data: string ): Promise<ArrayBuffer> {
		return Promise.resolve( new TextEncoder().encode( data ) as unknown as ArrayBuffer );
	}
}

export class FakeFailingDataEncryptor implements DataEncryptor {

	decrypt(): Promise<string> {
		throw new Error( 'I never return anything' );
	}

	encrypt( data: string ): Promise<ArrayBuffer> {
		return Promise.resolve( new TextEncoder().encode( data ) as unknown as ArrayBuffer );
	}
}
