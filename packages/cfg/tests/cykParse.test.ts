import { cykParse } from '../libs/cykParse';

it(`Should parse the sentence and generate cyk parse information`, () => {
	expect(
		cykParse(
			{
				startVariable: 'S',
				productionRules: {
					S: ['A B', 'B C'],
					A: ['B A', 'a'],
					B: ['C C', 'b'],
					C: ['A B', 'a'],
				},
			},
			'b a a b a'.split(' ')
		)
	).toStrictEqual({
		verdict: true,
		cykTable: [
			[
				{
					combinations: [
						{
							merged: [],
							parts: [[], ['A', 'C']],
						},
						{
							merged: [],
							parts: [[], ['A', 'S']],
						},
						{
							merged: ['A B', 'S B'],
							parts: [['A', 'S'], ['B']],
						},
						{
							merged: ['B A', 'B S', 'B C'],
							parts: [['B'], ['A', 'S', 'C']],
						},
					],
					value: ['S', 'C', 'A'],
				},
			],
			[
				{
					combinations: [
						{
							merged: [],
							parts: [[], ['B']],
						},
						{
							merged: ['A S', 'A C', 'S S', 'S C'],
							parts: [
								['A', 'S'],
								['S', 'C'],
							],
						},
						{
							merged: ['B B'],
							parts: [['B'], ['B']],
						},
					],
					value: [],
				},
				{
					combinations: [
						{
							merged: ['B A', 'B C'],
							parts: [['B'], ['A', 'C']],
						},
						{
							merged: ['B A', 'B S'],
							parts: [['B'], ['A', 'S']],
						},
						{
							merged: ['A B', 'C B'],
							parts: [['A', 'C'], ['B']],
						},
					],
					value: ['A', 'S', 'C'],
				},
			],
			[
				{
					combinations: [
						{
							merged: ['A A', 'A C', 'S A', 'S C'],
							parts: [
								['A', 'S'],
								['A', 'C'],
							],
						},
						{
							merged: ['B B'],
							parts: [['B'], ['B']],
						},
					],
					value: [],
				},
				{
					combinations: [
						{
							merged: ['B B'],
							parts: [['B'], ['B']],
						},
						{
							merged: ['A S', 'A C', 'C S', 'C C'],
							parts: [
								['A', 'C'],
								['S', 'C'],
							],
						},
					],
					value: ['B'],
				},
				{
					combinations: [
						{
							merged: ['S A', 'S C', 'C A', 'C C'],
							parts: [
								['S', 'C'],
								['A', 'C'],
							],
						},
						{
							merged: ['A A', 'A S', 'C A', 'C S'],
							parts: [
								['A', 'C'],
								['A', 'S'],
							],
						},
					],
					value: ['B'],
				},
			],
			[
				{
					combinations: [
						{
							merged: ['B A', 'B C'],
							parts: [['B'], ['A', 'C']],
						},
					],
					value: ['A', 'S'],
				},
				{
					combinations: [
						{
							merged: ['A A', 'A C', 'C A', 'C C'],
							parts: [
								['A', 'C'],
								['A', 'C'],
							],
						},
					],
					value: ['B'],
				},
				{
					combinations: [
						{
							merged: ['A B', 'C B'],
							parts: [['A', 'C'], ['B']],
						},
					],
					value: ['S', 'C'],
				},
				{
					combinations: [
						{
							merged: ['B A', 'B C'],
							parts: [['B'], ['A', 'C']],
						},
					],
					value: ['A', 'S'],
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
							merged: ['A', 'C'],
							parts: [['A', 'C']],
						},
					],
					value: ['A', 'C'],
				},
				{
					combinations: [
						{
							merged: ['A', 'C'],
							parts: [['A', 'C']],
						},
					],
					value: ['A', 'C'],
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
				{
					combinations: [
						{
							merged: ['A', 'C'],
							parts: [['A', 'C']],
						},
					],
					value: ['A', 'C'],
				},
			],
		],
		nodeVariablesRecord: {
			'A B': ['S', 'C'],
			'B C': ['S'],
			'B A': ['A'],
			a: ['A', 'C'],
			'C C': ['B'],
			b: ['B'],
		},
		sentenceTokens: ['b', 'a', 'a', 'b', 'a'],
	});
});
