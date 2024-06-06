import { validateFee } from '@src/store/feeValidator';
import { FeeValidity } from '@src/view_models/MembershipFee';

describe( 'FeeValidator', () => {

	const MINIMUM_AMOUNT = 500;

	it.each( [
		[ 0, 0, FeeValidity.FEE_TOO_LOW ],
		[ 0, MINIMUM_AMOUNT, FeeValidity.FEE_TOO_LOW ],
		[ MINIMUM_AMOUNT - 1, MINIMUM_AMOUNT, FeeValidity.FEE_TOO_LOW ],
		[ MINIMUM_AMOUNT, MINIMUM_AMOUNT, FeeValidity.FEE_VALID ],
		[ 99_999_99, MINIMUM_AMOUNT, FeeValidity.FEE_VALID ],
		[ 100_000_00, MINIMUM_AMOUNT, FeeValidity.FEE_VALID ],
		[ 100_000_01, MINIMUM_AMOUNT, FeeValidity.FEE_TOO_HIGH ],
		[ 100_001_00, MINIMUM_AMOUNT, FeeValidity.FEE_TOO_HIGH ],
	] )( 'returns correct FeeValidity state for membership fees (amount: %d, minimum: %d)', (
		amountToTest: number,
		minimumAmount: number,
		expectedValidity: FeeValidity
	) => {
		const result: FeeValidity = validateFee( amountToTest, minimumAmount );

		expect( result ).toEqual( expectedValidity );
	} );

} );
