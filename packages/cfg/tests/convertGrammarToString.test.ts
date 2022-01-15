import { convertGrammarToString } from '../libs/convertGrammarToString';

describe('.convertGrammarToString', () => {
	it(`Should convert grammar to string`, () => {
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
