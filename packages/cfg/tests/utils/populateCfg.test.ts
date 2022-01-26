import { populateCfg } from '../../libs/utils/populateCfg';

it(`Should populate cfg, when variables, startVariable and terminals is not present`, () => {
	expect(
		populateCfg({
			productionRules: {
				A: ['An'],
				B: ['A', 'B', 'The'],
			},
		})
	).toStrictEqual({
		productionRules: {
			A: ['An'],
			B: ['A', 'B', 'The'],
		},
		variables: ['A', 'B'],
		terminals: ['An', 'The'],
		startVariable: 'A',
	});
});

it(`Should not do anything when variables, startVariable and terminals is present`, () => {
	expect(
		populateCfg({
			productionRules: {
				A: ['An'],
				B: ['A', 'B', 'The'],
			},
			variables: ['A', 'B'],
			terminals: ['An', 'The'],
			startVariable: 'A',
		})
	).toStrictEqual({
		productionRules: {
			A: ['An'],
			B: ['A', 'B', 'The'],
		},
		variables: ['A', 'B'],
		terminals: ['An', 'The'],
		startVariable: 'A',
	});
});
