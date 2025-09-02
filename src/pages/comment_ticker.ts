import 'core-js/stable';
import { createApp } from 'vue';
import PageDataInitializer from '@src/util/page_data_initializer';
import { createLocalisation } from '@src/util/createLocalisation';
import CommentTicker from '@src/components/pages/CommentTicker.vue';
import { windowPageTools } from '@src/util/PageTools';

const pageData = new PageDataInitializer<any>( '#appdata' );

const i18n = createLocalisation( pageData.messages );
const app = createApp( CommentTicker, {
	pageTitle: 'comment_ticker_page_title',
	pageTools: windowPageTools,
	pageProps: {
	},
} );

app.use( i18n );
app.mount( '#app' );
