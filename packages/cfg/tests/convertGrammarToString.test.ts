import { convertGrammarToString } from '../libs/convertGrammarToString';

describe('convertGrammarToString', () => {
	it(`Convert grammar to string`, () => {
		const stringifiedGrammar = convertGrammarToString({
			S: ['Adj Noun Verb', 'Adj Verb'],
			Noun: ['Sam', 'Alice', ''],
			Adj: ['quickly'],
			Verb: ['talked'],
		});
		expect(stringifiedGrammar).toStrictEqual([
			'S -> Adj Noun Verb | Adj Verb',
			'Noun -> Sam | Alice | ϵ',
			'Adj -> quickly',
			'Verb -> talked',
		]);
	});
});
