import { generateLL1ParsingTable } from '../libs/generateLL1ParsingTable';

describe('generateLL1ParsingTable', () => {
	it(`Simple LL1 non parsable grammar`, () => {
		expect(
			generateLL1ParsingTable({
				productionRules: {
					S: ['a S b S', 'b S a S', ''],
				},
			})
		).toStrictEqual({ parseTable: { S: { a: 2, b: 2, $: 2 } }, isParsable: false });
	});

	it(`Complex LL1 parsable grammar`, () => {
		expect(
			generateLL1ParsingTable({
				productionRules: {
					E: ["T E'"],
					"E'": ["+ T E'", ''],
					T: ["F T'"],
					"T'": ["* F T'", ''],
					F: ['id', '( E )'],
				},
			})
		).toStrictEqual({
			parseTable: {
				E: {
					id: 0,
					'(': 0,
				},
				"E'": {
					'+': 0,
					')': 1,
					$: 1,
				},
				T: {
					id: 0,
					'(': 0,
				},
				"T'": {
					'+': 1,
					'*': 0,
					')': 1,
					$: 1,
				},
				F: {
					id: 0,
					'(': 1,
				},
			},
			isParsable: true,
		});
	});
});
