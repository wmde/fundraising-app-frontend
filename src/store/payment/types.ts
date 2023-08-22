import { Payment } from '@src/view_models/Payment';
import { Prefillable } from '@src/view_models/Prefillable';

export type DonationPayment = Payment & Prefillable;
