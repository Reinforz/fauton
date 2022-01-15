import { convertStringToGrammar } from '../libs/convertStringToGrammar';

describe('convertStringToGrammar', () => {
	it(`convertStringToGrammar`, () => {
		const generatedGrammar = convertStringToGrammar(
			`S -> Noun Article Verb | Noun Adj Verb\nNoun -> Sam | Bob | Alice\nArticle -> A | The | An\nAdj -> quickly | swiftly\nVerb -> ran | ate\nVerb -> walked`
		);
		expect(generatedGrammar).toStrictEqual({
			productionRules: {
				S: ['Noun Article Verb', 'Noun Adj Verb'],
				Noun: ['Sam', 'Bob', 'Alice'],
				Article: ['A', 'The', 'An'],
				Adj: ['quickly', 'swiftly'],
				Verb: ['ran', 'ate', 'walked'],
			},
			variables: ['S', 'Noun', 'Article', 'Adj', 'Verb'],
			terminals: [
				'Sam',
				'Bob',
				'Alice',
				'A',
				'The',
				'An',
				'quickly',
				'swiftly',
				'ran',
				'ate',
				'walked',
			],
			startVariable: 'S',
		});
	});
});
