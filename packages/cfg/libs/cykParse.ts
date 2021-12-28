import { IContextFreeGrammar } from './types';
import { setCrossProduct } from './utils/setOperations';

interface CykTableCellCombination<Type extends Set<string> | Array<string>> {
	parts: [Type?, Type?];
	merged: Type;
}

type CykTable<Type extends Set<string> | Array<string>> = Array<
	Array<{
		combinations: CykTableCellCombination<Type>[];
		value: Type;
	}>
>;

/**
 * Parses a sentence given a cfg
 * @param cfg Input cfg production rules and start variable
 * @param sentenceTokens An array of sentence tokens
 * @returns Boolean value on whether the sentence is part of the grammar and steps that the CYK algo took to resolve it
 */
export function cykParse(
	cfg: Pick<IContextFreeGrammar, 'productionRules' | 'startVariable'>,
	sentenceTokens: string[]
) {
	const stringTokensLength = sentenceTokens.length;
	const { productionRules, startVariable } = cfg;
	const productionRulesEntries = Object.entries(productionRules);

	const cykTable: CykTable<Array<string>> = [];
	// Initialize the cykTable first, a left sided right angled triangle with height and base equal to the length of sentence tokens
	for (let i = 0; i < stringTokensLength; i += 1) {
		const cytTableRows: typeof cykTable[0] = [];
		for (let j = 0; j <= i; j += 1) {
			// Each cell will contain a set
			cytTableRows.push({
				combinations: [
					{
						merged: [],
						parts: [],
					},
				],
				value: [],
			});
		}
		cykTable.push(cytTableRows);
	}

	// A record that maps which nodes (T, VV) is reachable by which variables
	const nodeVariablesRecord: Record<string, Array<string>> = {};

	// Populating the nodeVariables record
	// Loop through each of the production rules
	productionRulesEntries.forEach(([productionRuleVariable, productionRuleSubstitutions]) => {
		// Loop through each of the substitutions
		productionRuleSubstitutions.forEach((productionRuleSubstitution) => {
			// Add the substitution to the record, it it doesn't exist
			if (!nodeVariablesRecord[productionRuleSubstitution]) {
				nodeVariablesRecord[productionRuleSubstitution] = [];
			}
			// Add the production rule variable to the set
			nodeVariablesRecord[productionRuleSubstitution].push(productionRuleVariable);
		});
	});

	// filling the bottom row, with values from the record, since the bottom row will contain only direct terminals
	sentenceTokens.forEach((sentenceToken, sentenceTokenIndex) => {
		cykTable[stringTokensLength - 1][sentenceTokenIndex] = {
			combinations: [
				{
					merged: nodeVariablesRecord[sentenceToken],
					parts: [nodeVariablesRecord[sentenceToken]],
				},
			],
			value: nodeVariablesRecord[sentenceToken],
		};
	});

	// Start from the row top of the bottom row, all the way to the first row
	for (let cykTableRow = stringTokensLength - 2; cykTableRow >= 0; cykTableRow -= 1) {
		// The total number of combinations that is possible from the current row
		// if input is aabab and we are in row index 2, total combinations are aa+bab, aab+ab
		const totalCombinations = stringTokensLength - (cykTableRow + 1); // Adding 1 as row is 0 index based;
		// Loop from left most column to the right most column, since its a left right angled triangle, the number of column will be the same as the number of rows
		for (let cykTableCol = 0; cykTableCol <= cykTableRow; cykTableCol += 1) {
			const combinations: typeof cykTable[0][0]['combinations'] = [];
			// Each cell will contain a set of variables that can be derived from all the cross products
			const variablesContainingCrossProduct: Set<string> = new Set();
			for (
				let combinationNumber = 1;
				combinationNumber <= totalCombinations;
				combinationNumber += 1
			) {
				// The combinationNumber'th bottom cell from the current cell
				const bottomRowCell = cykTable[cykTableRow + combinationNumber][cykTableCol],
					// The combinationNumber'th right diagonal cell from the current cell
					rightDiagonalCell =
						cykTable[stringTokensLength - combinationNumber][
							stringTokensLength - cykTableRow + cykTableCol - combinationNumber
						];
				// Get the cross product of all the variables in those two cells
				const crossProduct = setCrossProduct(
					new Set(bottomRowCell.value),
					new Set(rightDiagonalCell.value)
				);
				crossProduct.forEach((crossProductItem) => {
					// Making sure that cross product item is present in the record
					if (nodeVariablesRecord[crossProductItem]) {
						// Loop through all the cross product items and add them to the above set
						nodeVariablesRecord[crossProductItem].forEach((variable) => {
							variablesContainingCrossProduct.add(variable);
						});
					}
				});
				combinations.push({
					merged: Array.from(crossProduct),
					parts: [bottomRowCell.value, rightDiagonalCell.value],
				});
			}
			// Update the set for the corresponding cell
			cykTable[cykTableRow][cykTableCol] = {
				combinations,
				value: Array.from(variablesContainingCrossProduct),
			};
		}
	}

	// If the first cell has the startVariable, the sentence is valid for the grammar
	return {
		verdict: cykTable[0][0].value.includes(startVariable),
		cykTable: JSON.parse(JSON.stringify(cykTable)) as CykTable<Array<string>>,
		nodeVariablesRecord: JSON.parse(JSON.stringify(nodeVariablesRecord)) as Record<
			string,
			Array<string>
		>,
		sentenceTokens,
	};
}
