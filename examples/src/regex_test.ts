import { FiniteAutomataTest, RegularExpression } from 'fauton';
import path from 'path';

const regex = new RegularExpression(
	(inputString) => {
		return (
			inputString[0] === 'a' &&
			inputString[1] === 'b' &&
			inputString
				.slice(2)
				.split('')
				.every((char) => char === 'c')
		);
	},
	{
		alphabets: ['a', 'b', 'c'],
		label: 'Starts with a and b, ends with any number of c',
		regex: /^abc*$/g,
	}
);

const finiteAutomataTest = new FiniteAutomataTest(path.join(__dirname, 'logs'));

finiteAutomataTest.test([
	{
		automaton: regex,
		options: {
			type: 'generate',
			combo: {
				maxLength: 10,
			},
		},
	},
]);
