import { validateCfg } from '../libs/validateCfg';

it(`Should throw error if transition record contains a variable that is not present in variables array`, () => {
	try {
		validateCfg({
			productionRules: {
				S: ['a'],
			},
			startVariable: 'S',
			terminals: [],
			variables: ['A'],
		});
	} catch (err) {
		expect(err.message).toBe(
			`Transition record contains a variable S, that is not present in variables array`
		);
	}
});

it(`Should throw error if transition record substitution chunk is neither a variable nor a terminal`, () => {
	try {
		validateCfg({
			productionRules: {
				A: ['a'],
			},
			startVariable: 'S',
			terminals: ['b'],
			variables: ['A'],
		});
	} catch (err) {
		expect(err.message).toBe(
			`Transition record substitution chunk a is neither a variable nor a terminal`
		);
	}
});

it(`Should throw error if all variables are not present in transition record`, () => {
	try {
		validateCfg({
			productionRules: {
				A: ['a'],
				B: ['a'],
			},
			startVariable: 'S',
			terminals: ['b'],
			variables: ['B'],
		});
	} catch (err) {
		expect(err.message).toBe(`All variables must be present in the transition record`);
	}
});

it(`Should throw error if starting variable is not part of variables array`, () => {
	try {
		validateCfg({
			productionRules: {
				A: ['a'],
				B: ['a'],
			},
			startVariable: 'S',
			terminals: ['a'],
			variables: ['B', 'A'],
		});
	} catch (err) {
		expect(err.message).toBe(`Starting variable must be part of variables array`);
	}
});
