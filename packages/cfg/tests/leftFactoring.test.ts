import { leftFactoring } from '../libs/leftFactoring';

describe('leftFactoring', () => {
	it(`Should be able to left factor for multiple production rule`, () => {
		const leftRefactored = leftFactoring({
      productionRules: {
        S: ["a A d", "a B"],
        A: ["a", "a b"],
        B: ["c c d", "d d c"]
      },
      startVariable: "S"
    });
		expect(leftRefactored).toStrictEqual({
			productionRules: {
				S: ["a S'"],
				"S'": ['A d', 'B'],
				A: ["a A'"],
				"A'": ['', 'b'],
				B: ['c c d', 'd d c'],
			},
			startVariable: 'S',
			variables: ['S', "S'", 'A', "A'", 'B'],
			terminals: ['a', 'd', 'b', 'c'],
		});
	});

  it(`Should be able to left factor for single production rule`, () => {
		const leftRefactored = leftFactoring({
			productionRules: {
				S: ['b', 'a S S b S', 'a S a S b', 'a b b'],
			},
			startVariable: 'S',
		});
		expect(leftRefactored).toStrictEqual({
			productionRules: {
				S: ['b', "a S'"],
				"S'": ["S S''", 'b b'],
				"S''": ['S b S', 'a S b'],
			},
			startVariable: 'S',
			variables: ['S', "S'", "S''"],
			terminals: ['b', 'a'],
		});
	});
});
