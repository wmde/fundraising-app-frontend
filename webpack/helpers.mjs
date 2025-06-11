'use strict';

import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath( import.meta.url );
const dirname = path.dirname( filename );

export default {
	root: function ( args ) {
		args = Array.prototype.slice.call( arguments, 0 );

		return path.join.apply( path, [ path.resolve( dirname, '..' ) ].concat( args ) );
	},
	assetsPath: function ( _path ) {
		return path.posix.join( 'static', _path );
	},
};
