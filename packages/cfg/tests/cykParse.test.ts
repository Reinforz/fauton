import { cykParse } from '../libs/cykParse';

describe('cykParse', () => {
	it(`Basic CYK parsing`, () => {
		const cykParseResult = cykParse(
			{
				startVariable: 'S',
				productionRules: {
					S: ['A B', 'B'],
					A: ['B A', 'a'],
					B: ['A', 'b'],
				},
			},
			'b a b'.split(' ')
		);
		expect(cykParseResult).toStrictEqual({
			verdict: true,
			cykTableDetailed: [
				[
					{
						combinations: [
							{
								merged: ['A B'],
								parts: [['A'], ['B']],
							},
							{
								merged: ['B S'],
								parts: [['B'], ['S']],
							},
						],
						value: ['S'],
					},
				],
				[
					{
						combinations: [
							{
								merged: ['B A'],
								parts: [['B'], ['A']],
							},
						],
						value: ['A'],
					},
					{
						combinations: [
							{
								merged: ['A B'],
								parts: [['A'], ['B']],
							},
						],
						value: ['S'],
					},
				],
				[
					{
						combinations: [
							{
								merged: ['B'],
								parts: [['B']],
							},
						],
						value: ['B'],
					},
					{
						combinations: [
							{
								merged: ['A'],
								parts: [['A']],
							},
						],
						value: ['A'],
					},
					{
						combinations: [
							{
								merged: ['B'],
								parts: [['B']],
							},
						],
						value: ['B'],
					},
				],
			],
			cykTable: [['S'], ['A', 'S'], ['B', 'A', 'B']],
			nodeVariablesRecord: {
				'A B': ['S'],
				B: ['S'],
				'B A': ['A'],
				a: ['A'],
				A: ['B'],
				b: ['B'],
			},
			sentenceTokens: ['b', 'a', 'b'],
		});
	});
});
