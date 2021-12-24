import { extractTerminalsFromCfg } from '../../libs/utils/extractTerminalsFromCfg';

it(`should extract terminals from cfg`, () => {
	expect(
		extractTerminalsFromCfg({
			productionRules: {
				S: ['Noun Verb Adj'],
				Verb: ['walk', 'talk'],
				Noun: ['Sam', 'Alice'],
				Adj: ['quickly'],
			},
			startVariable: 'S',
			terminals: [],
			variables: ['S', 'Verb', 'Noun', 'Adj'],
		})
	).toStrictEqual(['walk', 'talk', 'Sam', 'Alice', 'quickly']);
});
