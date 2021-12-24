import { convertGrammarToString } from '../libs/convertGrammarToString';

it(`Should convert grammar to string`, () => {
	expect(
		convertGrammarToString({
			S: ['Adj Noun Verb', 'Adj Verb'],
			Noun: ['Sam', 'Alice'],
			Adj: ['quickly'],
			Verb: ['talked'],
		})
	).toStrictEqual(
		`S -> Adj Noun Verb | Adj Verb\nNoun -> Sam | Alice\nAdj -> quickly\nVerb -> talked`
	);
});
