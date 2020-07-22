import { expect } from 'chai';
import { validate } from '../src/utils/phone-utils';

describe('Phone validator', function () {
    it('Should confirm a phone number is valid', function () {
        const validNumberMobile = '0545873646';
        const validNumberCountryCode = '+972545873646';
        const validNumberLandLine = '046515354';
        const validNumberDash = '054-6515354';
        const invalidNumberCharacter = '+14342f46515354';
        const invalidNumberLength = '1434246515354';

        expect(validate(validNumberMobile)).to.be.true;
        expect(validate(validNumberCountryCode)).to.be.true;
        expect(validate(validNumberDash)).to.be.true;
        expect(validate(validNumberLandLine)).to.be.true;
        expect(validate(invalidNumberCharacter)).to.be.false;
        expect(validate(invalidNumberLength)).to.be.false;
    });
});
