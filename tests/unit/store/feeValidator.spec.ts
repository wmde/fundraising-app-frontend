import { validateFee } from '@src/store/feeValidator';
import { FeeValidity } from '@src/view_models/MembershipFee';

describe( 'FeeValidator', () => {

	const MINIMUM_AMOUNT = 500;

	it.each( [
		[ MINIMUM_AMOUNT - 1, FeeValidity.FEE_TOO_LOW ],
		[ MINIMUM_AMOUNT, FeeValidity.FEE_VALID ],
		[ 99_999_99, FeeValidity.FEE_VALID ],
		[ 100_000_00, FeeValidity.FEE_VALID ],
		[ 100_000_01, FeeValidity.FEE_TOO_HIGH ],
		[ 100_001_00, FeeValidity.FEE_TOO_HIGH ],
	] )( 'returns correct FeeValidity state for membership fees (%d)', ( amountToTest: number, expectedValidity: FeeValidity ) => {
		const result: FeeValidity = validateFee( amountToTest, MINIMUM_AMOUNT );

		expect( result ).toEqual( expectedValidity );
	} );

} );
