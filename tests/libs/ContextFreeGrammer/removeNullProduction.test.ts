import { removeNullProduction } from '../../../src/libs/ContextFreeGrammar/utils/removeNullProduction';
import { arrayEquivalency } from '../../setEquivalency';

it(`Should remove null production from transition record`, () => {
	const nullProductionRemovedTransition = removeNullProduction({
		transitionRecord: {
			S: ['ABAC'],
			A: ['aA', ''],
			B: ['bB', ''],
			C: ['c'],
		},
		variables: ['S', 'A', 'B', 'C'],
	});

	expect(
		arrayEquivalency(nullProductionRemovedTransition.S, [
			'AAC',
			'ABAC',
			'ABC',
			'AC',
			'BAC',
			'BC',
			'C',
		])
	).toBe(true);
	expect(arrayEquivalency(nullProductionRemovedTransition.A, ['aA', 'a'])).toBe(true);
	expect(arrayEquivalency(nullProductionRemovedTransition.B, ['bB', 'b'])).toBe(true);
	expect(arrayEquivalency(nullProductionRemovedTransition.C, ['c'])).toBe(true);
});
