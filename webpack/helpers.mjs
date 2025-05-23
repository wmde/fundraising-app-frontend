'use strict';

import path from 'path';

export default {
	root: function ( args ) {
		args = Array.prototype.slice.call( arguments, 0 );

		return path.join.apply( path, [ path.resolve( import.meta.dirname, '..' ) ].concat( args ) );
	},
	assetsPath: function ( _path ) {
		return path.posix.join( 'static', _path );
	},
};
