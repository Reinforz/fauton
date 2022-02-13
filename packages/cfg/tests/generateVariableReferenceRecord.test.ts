import generateVariableReferenceRecord from '../libs/generateVariableReferenceRecord';

describe('generateVariableReferenceRecord', () => {
	it(`Get variable referenced in all rules`, () => {
		expect(
			generateVariableReferenceRecord({
				productionRules: {
					A: ['word1 A word2', 'B A word3'],
					B: ['A B', 'C B B word4'],
					C: ['word1', 'C A'],
				},
				variables: ['A', 'B', 'C'],
			})
		).toStrictEqual({
			A: [
				{
					variable: 'A',
					tokenNumber: 1,
					ruleNumber: 0,
				},
				{
					variable: 'A',
					tokenNumber: 1,
					ruleNumber: 1,
				},
				{
					variable: 'B',
					tokenNumber: 0,
					ruleNumber: 0,
				},
				{
					variable: 'C',
					tokenNumber: 1,
					ruleNumber: 1,
				},
			],
			B: [
				{
					variable: 'A',
					tokenNumber: 0,
					ruleNumber: 1,
				},
				{
					variable: 'B',
					tokenNumber: 1,
					ruleNumber: 0,
				},
        {
					variable: 'B',
					tokenNumber: 1,
					ruleNumber: 1,
				},
				{
					variable: 'B',
					tokenNumber: 2,
					ruleNumber: 1,
				},
			],
      C: [
        {
          variable: 'B',
					tokenNumber: 0,
					ruleNumber: 1,
        },
        {
          variable: 'C',
					tokenNumber: 0,
					ruleNumber: 1,
        }
      ]
		});
	});
});
