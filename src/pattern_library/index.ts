import { createApp } from 'vue';
import App from '@src/pattern_library/components/App.vue';
import PageDataInitializer from '@src/util/page_data_initializer';

const pageData = new PageDataInitializer( '#appdata' );

createApp( App, { assetsPath: pageData.assetsPath } ).mount( '#app' );
