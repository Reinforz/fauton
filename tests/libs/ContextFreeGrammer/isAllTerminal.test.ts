import { isAllTerminal } from '../../../src/libs/ContextFreeGrammar/utils/isAllTerminal';

it(`Should return true if all is terminal`, () => {
	expect(isAllTerminal(['The', 'A', 'An'], 'The A An')).toBe(true);
});

it(`Should return false if one is not terminal`, () => {
	expect(isAllTerminal(['The', 'A', 'An'], 'The Var An')).toBe(false);
});
