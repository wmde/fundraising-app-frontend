import { Validity } from '@src/view_models/Validity';

export interface FieldInitialization {
    name: string,
    value: any,
    validity: Validity,
}
