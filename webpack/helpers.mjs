'use strict';

import path from 'path';
const root = path.resolve( import.meta.dirname, '..' );

export default {
	root: function ( args ) {
		args = Array.prototype.slice.call( arguments, 0 );

		return path.join.apply( path, [ root ].concat( args ) );
	},
	assetsPath: function ( _path ) {
		return path.posix.join( 'static', _path );
	},
};
