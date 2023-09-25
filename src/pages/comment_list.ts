import 'core-js/stable';
import { createVueApp } from '@src/createVueApp';
import PageDataInitializer from '@src/page_data_initializer';
import App from '@src/components/App.vue';
import CommentList from '@src/components/pages/CommentList.vue';

const PAGE_IDENTIFIER = 'comment-list';
const pageData = new PageDataInitializer<any>( '#appdata' );

createVueApp( App, pageData.messages, [], {
	assetsPath: pageData.assetsPath,
	pageIdentifier: PAGE_IDENTIFIER,
	page: CommentList,
	pageProps: {
		errorData: pageData.applicationVars,
	},
} ).mount( '#app' );
