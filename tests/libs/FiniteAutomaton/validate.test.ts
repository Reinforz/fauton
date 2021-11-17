import { validate } from '../../../src/libs/FiniteAutomaton/utils/validate';

it(`Should throw an error`, () => {
	expect(() => validate('DFA', ['Error 1'])).toThrow(`Error validating automaton`);
});
