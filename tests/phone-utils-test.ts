import { expect } from 'chai';
import { validate } from '../src/utils/phone-utils';

describe('Phone validator', function () {
    it('Should confirm a phone number is valid', function () {
        const validNumberMobile = '0545873646';
        expect(validate(validNumberMobile)).to.be.true;
    });
    it('Should confirm a phone number with a country code is valid', function () {
        const validNumberCountryCode = '+972545873646';
        expect(validate(validNumberCountryCode)).to.be.true;
    });
    it('Should confirm a landline phone number is valid', function () {
        const validNumberLandLine = '046515354';
        expect(validate(validNumberLandLine)).to.be.true;
    });
    it('Should confirm a phone number with a dash inside', function () {
        const validNumberDash = '054-6515354';
        expect(validate(validNumberDash)).to.be.true;
    });
    it('Should confirm a phone number with invalid characters is invalid', function () {
        const invalidNumberCharacter = '+14342f46515354';
        expect(validate(invalidNumberCharacter)).to.be.false;
    });
    it('Should confirm a phone number that is too long is invalid', function () {
        const invalidNumberLength = '1434246515354';
        expect(validate(invalidNumberLength)).to.be.false;
    });
});
