import { extractTerminalsFromCfg } from '../libs/extractTerminalsFromCfg';

it(`should extract terminals from cfg`, () => {
	expect(
		extractTerminalsFromCfg({
			productionRules: {
				S: ['Noun Verb Adj'],
				Verb: ['walk', 'talk'],
				Noun: ['Sam', 'Alice'],
				Adj: ['quickly'],
			},
			variables: ['S', 'Verb', 'Noun', 'Adj'],
		})
	).toStrictEqual(['walk', 'talk', 'Sam', 'Alice', 'quickly']);
});
