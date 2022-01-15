import {
	convertToCnf,
	findLongSubstitution,
	findSubstitutionOfLengthTwo,
	processLongSubstitutions,
	processSubstitutionsOfLengthTwo,
} from '../libs/convertToCnf';
import { IContextFreeGrammar } from '../libs/types';

describe('.findLongSubstitution', () => {
	it(`Should find long substitutions`, () => {
		expect(
			findLongSubstitution([
				['A', ['A a', 'A A', 'a a', 'a b c']],
				['B', ['b A B']],
			])
		).toStrictEqual(['A', ['a', 'b', 'c'], 3]);
	});

	it(`Should not find long substitutions`, () => {
		expect(
			findLongSubstitution([
				['A', ['A a', 'A A', 'a a']],
				['B', ['b A']],
			])
		).toStrictEqual(null);
	});
});

describe('.findSubstitutionOfLengthTwo', () => {
	it(`Should find substitutions of length two`, () => {
		expect(
			findSubstitutionOfLengthTwo([['A', ['a', 'A', 'A A', 'a a', 'a b']]], ['A'])
		).toStrictEqual(['A', ['a', 'a'], 3]);
	});

	it(`Should not find substitutions of length two`, () => {
		expect(
			findLongSubstitution([
				['A', ['B', 'A', 'a']],
				['B', ['b']],
			])
		).toStrictEqual(null);
	});
});

describe('.processLongSubstitutions', () => {
	it(`Should process long substitutions`, () => {
		const productionRules: IContextFreeGrammar['productionRules'] = {
				A: ['A a b', 'a a', 'A', 'a'],
				B: ['B b a', 'A b a'],
			},
			variables: string[] = ['A', 'B'];
		jest
			.spyOn(Math, 'random')
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(0.05)
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(0.1)
			.mockReturnValueOnce(0);
		processLongSubstitutions({
			productionRules,
			variables,
		});

		expect(productionRules).toStrictEqual({
			A: ['a a', 'A', 'a', 'A0 b'],
			B: ['B0 a', 'C0 a'],
			A0: ['A a'],
			B0: ['B b'],
			C0: ['A b'],
		});
		expect(variables).toStrictEqual(['A', 'B', 'A0', 'B0', 'C0']);
	});
});

describe('.processSubstitutionsOfLengthTwo', () => {
	it(`Should process substitutions of length two`, () => {
		const productionRules: IContextFreeGrammar['productionRules'] = {
				A: ['a', 'A A', 'B a', 'a a', 'a B'],
				B: ['b B', 'a', 'c d', 'B a'],
			},
			variables: string[] = ['A', 'B'];

		jest
			.spyOn(Math, 'random')
			// A
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(0)
			// B
			.mockReturnValueOnce(0.05)
			.mockReturnValueOnce(0)
			// C
			.mockReturnValueOnce(0.1)
			.mockReturnValueOnce(0)
			// D
			.mockReturnValueOnce(0.15)
			.mockReturnValueOnce(0)
			// E
			.mockReturnValueOnce(0.2)
			.mockReturnValueOnce(0);

		processSubstitutionsOfLengthTwo({
			productionRules,
			terminals: ['a', 'b', 'c', 'd'],
			variables,
		});

		expect(productionRules).toStrictEqual({
			A: ['a', 'A A', 'B A0', 'A0 A0', 'A0 B'],
			B: ['a', 'B0 B', 'C0 D0', 'B A0'],
			A0: ['a'],
			B0: ['b'],
			C0: ['c'],
			D0: ['d'],
		});
		expect(variables).toStrictEqual(['A', 'B', 'A0', 'B0', 'C0', 'D0']);
		jest.restoreAllMocks();
	});
});

describe('convertToCnf', () => {
	beforeEach(() => {
		jest
			.spyOn(Math, 'random')
			// A
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(0)
			// B
			.mockReturnValueOnce(0.05)
			.mockReturnValueOnce(0)
			// C
			.mockReturnValueOnce(0.1)
			.mockReturnValueOnce(0);
	});

	it(`convertToCnf`, () => {
		const convertedCnfGrammar = convertToCnf({
			productionRules: {
				S: ['A S A', 'a B'],
				A: ['B', 'S'],
				B: ['b', ''],
			},
			startVariable: 'S',
			terminals: ['a', 'b'],
			variables: ['S', 'A', 'B'],
		});
		expect(convertedCnfGrammar).toStrictEqual({
			productionRules: {
				S: ['A S', 'S A', 'a', 'B0 A', 'C0 B'],
				A: ['b', 'A S', 'S A', 'a', 'B0 A', 'C0 B'],
				B: ['b'],
				A0: ['A S', 'S A', 'a', 'B0 A', 'C0 B'],
				B0: ['A S'],
				C0: ['a'],
			},
			startVariable: 'A0',
			terminals: ['a', 'b'],
			variables: ['S', 'A', 'B', 'A0', 'B0', 'C0'],
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});
});
