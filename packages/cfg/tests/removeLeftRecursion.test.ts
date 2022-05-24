import { removeLeftRecursion } from '../libs/removeLeftRecursion';

describe('removeLeftRecursion', () => {
	it(`Should remove both direct and indirect left recursion`, () => {
		const leftRecursionRemovedCfg = removeLeftRecursion({
      productionRules: {
        S: ["A f", "b"],
        A: ["A c", "S d", "B e", "C"],
        B: ["A g", "S h", "k"],
        C: ["B k m A", "A S", "j"],
      },
      startVariable: "S"
    });
		expect(leftRecursionRemovedCfg).toStrictEqual({
			productionRules: {
				S: ['A f', 'b'],
				A: ["b d A'", "B e A'", "C A'"],
				"A'": ["c A'", "f d A'", ''],
				B: ["b d A' g B'", "C A' g B'", "b d A' f h B'", "C A' f h B'", "b h B'", "k B'"],
				"B'": ["e A' g B'", "e A' f h B'", ''],
				C: [
					"b d A' g B' k m A C'",
					"b d A' f h B' k m A C'",
					"b h B' k m A C'",
					"k B' k m A C'",
					"b d A' S C'",
					"b d A' g B' e A' S C'",
					"b d A' f h B' e A' S C'",
					"b h B' e A' S C'",
					"k B' e A' S C'",
					"j C'",
				],
				"C'": [
					"A' g B' k m A C'",
					"A' f h B' k m A C'",
					"A' g B' e A' S C'",
					"A' f h B' e A' S C'",
					"A' S C'",
					'',
				],
			},
			startVariable: 'S',
			variables: ['S', 'A', "A'", 'B', "B'", 'C', "C'"],
			terminals: ['f', 'b', 'd', 'e', 'c', 'g', 'h', 'k', 'm', 'j'],
		});
	});
});
