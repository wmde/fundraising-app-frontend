export enum MembershipTypeModel {
	SUSTAINING,
	ACTIVE,
}

export type MembershipType = 'sustaining' | 'active';

export const MembershipTypeNames = new Map<number, MembershipType>( [
	[ MembershipTypeModel.SUSTAINING, 'sustaining' ],
	[ MembershipTypeModel.ACTIVE, 'active' ],
] );

export function membershipTypeName( t: MembershipTypeModel ): MembershipType {
	const name = MembershipTypeNames.get( t );
	// poor man's type check to protect against future extensions of MembershipTypeNames, e.g. https://phabricator.wikimedia.org/T220367
	if ( typeof name === 'undefined' ) {
		throw new Error( 'Unknown membership type: ' + t );
	}
	return name;
}
