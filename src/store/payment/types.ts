import type { Payment } from '@src/view_models/Payment';
import type { Prefillable } from '@src/view_models/Prefillable';

export type DonationPayment = Payment & Prefillable;
