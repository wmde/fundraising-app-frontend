'use strict';

const path = require( 'path' );
const root = path.resolve( __dirname, '..' );

exports.root = function ( args ) {
	args = Array.prototype.slice.call( arguments, 0 );

	return path.join.apply( path, [ root ].concat( args ) );
};

exports.assetsPath = function ( _path ) {
	return path.posix.join( 'static', _path );
};
