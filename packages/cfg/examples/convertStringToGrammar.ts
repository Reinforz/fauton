import { convertStringToGrammar } from '@fauton/cfg';

const grammar = convertStringToGrammar(
	`S -> Noun Article Verb | Noun Adj Verb\nNoun -> Sam | Bob | Alice\nArticle -> A | The | An\nAdj -> quickly | swiftly\nVerb -> ran | ate\nVerb -> walked`
);

console.log(JSON.stringify(grammar, null, 2));
