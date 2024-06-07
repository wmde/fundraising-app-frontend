/* eslint-disable camelcase */
import { mount, VueWrapper } from '@vue/test-utils';
import Contact from '@src/components/pages/Contact.vue';
import { ContactData } from '@src/components/pages/contact/ContactData';
import { contactFormValidationPatterns } from '@test/data/validation';

describe( 'Contact.vue', () => {

	const getWrapper = ( contactData: ContactData = null ): VueWrapper<any> => {
		return mount( Contact,
			{
				props: {
					contactData: contactData ?? { contact_categories: { 'category_1': 'category_1', 'category_2': 'category_2' } },
					validationPatterns: contactFormValidationPatterns,
				},
			} );
	};

	it( 'Fills fields with contact data', () => {
		const contactData: ContactData = {
			category: 'category_1',
			contact_categories: { 'category_1': 'category_1', 'category_2': 'category_2' },
			donationNumber: '12345',
			email: 'joe@dolan.com',
			errors: [],
			firstname: 'Joe',
			lastname: 'Dolan',
			messageBody: 'Oh me oh my you make me sigh',
			subject: 'Oh me oh my you make me sigh',
		};
		const wrapper = getWrapper( contactData );

		expect( wrapper.find<HTMLInputElement>( '#topic' ).element.value ).toStrictEqual( contactData.category );
		expect( wrapper.find<HTMLInputElement>( '#donationNumber' ).element.value ).toStrictEqual( contactData.donationNumber );
		expect( wrapper.find<HTMLInputElement>( '#email' ).element.value ).toStrictEqual( contactData.email );
		expect( wrapper.find<HTMLInputElement>( '#firstname' ).element.value ).toStrictEqual( contactData.firstname );
		expect( wrapper.find<HTMLInputElement>( '#lastname' ).element.value ).toStrictEqual( contactData.lastname );
		expect( wrapper.find<HTMLInputElement>( '#messageBody' ).element.value ).toStrictEqual( contactData.messageBody );
		expect( wrapper.find<HTMLInputElement>( '#subject' ).element.value ).toStrictEqual( contactData.subject );
	} );

	it( 'Shows and hides field errors', async () => {
		const wrapper = getWrapper();

		await wrapper.find( '#laika-contact' ).trigger( 'submit' );

		const email = wrapper.find( '#email' );
		const topic = wrapper.find( '#topic' );
		const subject = wrapper.find( '#subject' );
		const messageBody = wrapper.find( '#messageBody' );

		expect( email.attributes( 'aria-invalid' ) ).toStrictEqual( 'true' );
		expect( topic.attributes( 'aria-invalid' ) ).toStrictEqual( 'true' );
		expect( subject.attributes( 'aria-invalid' ) ).toStrictEqual( 'true' );
		expect( messageBody.attributes( 'aria-invalid' ) ).toStrictEqual( 'true' );

		await email.setValue( 'joe@dolan.com' );
		await email.trigger( 'blur' );
		await topic.setValue( 'category_1' );
		await topic.trigger( 'blur' );
		await subject.setValue( 'Oh me oh my you make me sigh' );
		await subject.trigger( 'blur' );
		await messageBody.setValue( 'Oh me oh my you make me sigh' );
		await messageBody.trigger( 'blur' );

		expect( email.attributes( 'aria-invalid' ) ).toStrictEqual( 'false' );
		expect( topic.attributes( 'aria-invalid' ) ).toStrictEqual( 'false' );
		expect( subject.attributes( 'aria-invalid' ) ).toStrictEqual( 'false' );
		expect( messageBody.attributes( 'aria-invalid' ) ).toStrictEqual( 'false' );
	} );
} );
