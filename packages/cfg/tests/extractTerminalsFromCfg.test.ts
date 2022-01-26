import { extractTerminalsFromCfg } from '../libs/extractTerminalsFromCfg';

describe('extractTerminalsFromCfg', () => {
	it(`Extract terminals from cfg when variables is present`, () => {
		const extractedTerminals = extractTerminalsFromCfg({
			productionRules: {
				S: ['Noun Verb Adj'],
				Verb: ['walk', 'talk'],
				Noun: ['Sam', 'Alice'],
				Adj: ['quickly'],
			},
			variables: ['S', 'Verb', 'Noun', 'Adj'],
		});
		expect(extractedTerminals).toStrictEqual(['walk', 'talk', 'Sam', 'Alice', 'quickly']);
	});

	it(`Extract terminals from cfg when variables is not present`, () => {
		expect(
			extractTerminalsFromCfg({
				productionRules: {
					S: ['Noun Verb Adj'],
					Verb: ['walk', 'talk'],
					Noun: ['Sam', 'Alice'],
					Adj: ['quickly'],
				},
			})
		).toStrictEqual(['walk', 'talk', 'Sam', 'Alice', 'quickly']);
	});
});
