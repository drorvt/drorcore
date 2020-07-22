import isMobilePhone from 'validator/lib/isMobilePhone';

export function validate(phoneNumber: string): boolean {
    return isMobilePhone(phoneNumber.replace('-', ''), 'he-IL');
}
