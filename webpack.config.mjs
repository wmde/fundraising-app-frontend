'use strict';

const environment = ( process.env.NODE_ENV || 'development' ).trim();

import dev from './webpack/webpack.config.dev.mjs';
import prod from './webpack/webpack.config.prod.mjs';

export default environment === 'development' ? dev : prod;
