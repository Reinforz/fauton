import { convertGrammarToString } from '@fauton/cfg';

const stringifiedGrammar = convertGrammarToString({
	S: ['Adj Noun Verb', 'Adj Verb'],
	Noun: ['Sam', 'Alice'],
	Adj: ['quickly'],
	Verb: ['talked'],
});

console.log(stringifiedGrammar);
