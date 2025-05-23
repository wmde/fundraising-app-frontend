import { createApp } from 'vue';
import App from '@src/pattern_library/components/App.vue';
import PageDataInitializer from '@src/util/page_data_initializer';
import { content } from '@src/pattern_library/content';

interface ApplicationVars {
	pattern: string;
}

const pageData = new PageDataInitializer<ApplicationVars>( '#appdata' );

createApp( App, {
	patternID: pageData.applicationVars.pattern,
	content,
	assetsPath: pageData.assetsPath,
} ).mount( '#app' );
