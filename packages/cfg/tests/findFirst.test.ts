import { findFirst } from '../libs/findFirst';

describe('findFirst', () => {
	it(`Terminal producing rules`, () => {
		expect(
			findFirst({
				productionRules: {
					C: ['a D', 'b C', ''],
					D: ['a'],
					E: ['a b c'],
				},
			})
		).toStrictEqual({
			C: {
				first: ['a', 'b', ''],
				substitutions: [['a'], ['b'], ['']],
			},
			D: {
				first: ['a'],
				substitutions: [['a']],
			},
			E: {
				first: ['a'],
				substitutions: [['a']],
			},
		});
	});

	it(`Variable producing rules`, () => {
		expect(
			findFirst({
				productionRules: {
					S: ['A B C', 'g h i', 'j k l'],
					A: ['a', 'b', 'c'],
				},
			})
		).toStrictEqual({
			S: {
				first: ['a', 'b', 'c', 'g', 'j'],
				substitutions: [['a', 'b', 'c'], ['g'], ['j']],
			},
			A: {
				first: ['a', 'b', 'c'],
				substitutions: [['a'], ['b'], ['c']],
			},
		});
	});

	it(`Terminal + Variable + Epsilon producing rules`, () => {
		expect(
			findFirst({
				productionRules: {
					S: ['A B C g'],
					A: ['a', 'b', ''],
					B: ['c', 'd', ''],
					C: ['e', 'f', ''],
				},
			})
		).toStrictEqual({
			S: {
				first: ['a', 'b', '', 'c', 'd', 'e', 'f', 'g'],
				substitutions: [['a', 'b', '', 'c', 'd', 'e', 'f', 'g']],
			},
			A: {
				first: ['a', 'b', ''],
				substitutions: [['a'], ['b'], ['']],
			},
			B: {
				first: ['c', 'd', ''],
				substitutions: [['c'], ['d'], ['']],
			},
			C: {
				first: ['e', 'f', ''],
				substitutions: [['e'], ['f'], ['']],
			},
		});
	});

	it(`Multiple Terminal + Multiple Variable + Epsilon producing rules`, () => {
		expect(
			findFirst({
				productionRules: {
					E: ["T E'"],
					"E'": ["* T E'", ''],
					T: ["F T'"],
					"T'": ['', "+ F T'"],
					F: ['', 'id', '( E'],
				},
			})
		).toStrictEqual({
			E: {
				first: ['', 'id', '(', '+', '*'],
				substitutions: [['', 'id', '(', '+', '*']],
			},
			"E'": {
				first: ['*', ''],
				substitutions: [['*'], ['']],
			},
			T: {
				first: ['', 'id', '(', '+'],
				substitutions: [['', 'id', '(', '+']],
			},
			"T'": {
				first: ['', '+'],
				substitutions: [[''], ['+']],
			},
			F: {
				first: ['', 'id', '('],
				substitutions: [[''], ['id'], ['(']],
			},
		});
	});
});
