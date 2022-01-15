import { convertGrammarToString } from '../libs/convertGrammarToString';

describe('convertGrammarToString', () => {
	it(`convertGrammarToString`, () => {
		expect(
			convertGrammarToString({
				S: ['Adj Noun Verb', 'Adj Verb'],
				Noun: ['Sam', 'Alice', ''],
				Adj: ['quickly'],
				Verb: ['talked'],
			})
		).toStrictEqual([
			`S -> Adj Noun Verb | Adj Verb`,
			'Noun -> Sam | Alice | ϵ',
			'Adj -> quickly',
			'Verb -> talked',
		]);
	});
});
