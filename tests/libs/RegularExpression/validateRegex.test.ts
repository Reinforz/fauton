import { validateRegex } from '../../../src/libs/RegularExpression/utils/validateRegex';

it(`Should validate regex`, () => {
	expect(validateRegex('(')).toBe(false);
	expect(validateRegex(')')).toBe(false);
	expect(validateRegex('()')).toBe(false);
	expect(validateRegex('(*')).toBe(false);
	expect(validateRegex('*')).toBe(false);
	expect(validateRegex('(a**')).toBe(false);
	expect(validateRegex('((a|')).toBe(false);
	expect(validateRegex('((a|b')).toBe(false);
	expect(validateRegex('((a)|b)')).toBe(true);
	expect(validateRegex('((a)|(b))')).toBe(true);
	expect(validateRegex('((a)|(b)|)')).toBe(false);
	expect(validateRegex('a|b')).toBe(true);
	expect(validateRegex('(((a)|(b))|(c))')).toBe(true);
});
