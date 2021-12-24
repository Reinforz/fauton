import { validate } from '../../libs/FiniteAutomaton/validate';

it(`Should throw an error`, () => {
	expect(() => validate('DFA', ['Error 1'])).toThrow(`Error validating automaton`);
});
