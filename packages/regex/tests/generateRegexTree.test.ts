import { addConcatOperatorToRegex } from '../libs/utils/addConcatOperatorToRegex';
import { convertInfixRegexToPostfix } from '../libs/utils/convertInfixRegexToPostfix';
import { generateRegexTree } from '../libs/utils/generateRegexTree';

describe('generateRegexTree', () => {
	it(`Simple regex`, () => {
		const generatedRegexTree = generateRegexTree(
			convertInfixRegexToPostfix(addConcatOperatorToRegex('a|b?c*'))
		);
		expect(generatedRegexTree).toStrictEqual([
			{
				operands: [
					{ operands: ['a'], operator: 'Literal' },
					{
						operands: [
							{ operands: [{ operands: ['b'], operator: 'Literal' }], operator: undefined },
							{ operands: [{ operands: ['c'], operator: 'Literal' }], operator: 'Kleene' },
						],
						operator: 'Concat',
					},
				],
				operator: 'Or',
			},
			'',
		]);
	});
});
