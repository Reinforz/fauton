import { IContextFreeGrammar } from '../../../types';
import { setCrossProduct } from '../../../utils';

export function cykParse(
	cfg: Pick<IContextFreeGrammar, 'productionRules' | 'startVariable'>,
	sentenceChunks: string[]
) {
	const stringChunksLength = sentenceChunks.length;
	const { productionRules, startVariable } = cfg;
	const productionRulesEntries = Object.entries(productionRules);

	const cykTable: Array<Array<Set<string>>> = [];
	for (let i = 0; i < stringChunksLength; i += 1) {
		const cytTableRows: Array<Set<string>> = [];
		for (let j = 0; j <= i; j += 1) {
			cytTableRows.push(new Set());
		}
		cykTable.push(cytTableRows);
	}

	// A record that maps which nodes (terminals and Variable Variable) is reachable by which variables
	const nodeVariablesRecord: Record<string, Set<string>> = {};

	productionRulesEntries.forEach(([productionRuleVariable, productionRuleSubstitutions]) => {
		productionRuleSubstitutions.forEach((productionRuleSubstitution) => {
			if (!nodeVariablesRecord[productionRuleSubstitution]) {
				nodeVariablesRecord[productionRuleSubstitution] = new Set();
			}
			nodeVariablesRecord[productionRuleSubstitution].add(productionRuleVariable);
		});
	});

	// filling the bottom row
	sentenceChunks.forEach((sentenceChunk, sentenceChunkIndex) => {
		cykTable[stringChunksLength - 1][sentenceChunkIndex] = nodeVariablesRecord[sentenceChunk];
	});

	// Start from the row top of the bottom row
	for (let cykTableRow = stringChunksLength - 2; cykTableRow >= 0; cykTableRow -= 1) {
		for (let cykTableCol = 0; cykTableCol <= cykTableRow; cykTableCol += 1) {
			const variablesContainingCrossProduct: Set<string> = new Set();
			const totalCombinations = stringChunksLength - (cykTableRow + 1); // Adding 1 as row is 0 index based;
			for (
				let combinationNumber = 1;
				combinationNumber <= totalCombinations;
				combinationNumber += 1
			) {
				const bottomRowCell = cykTable[cykTableRow + combinationNumber][cykTableCol],
					rightMostDiagonalCell =
						cykTable[stringChunksLength - combinationNumber][
							stringChunksLength - cykTableRow + cykTableCol - combinationNumber
						];
				const crossProduct = setCrossProduct(bottomRowCell, rightMostDiagonalCell);
				crossProduct.forEach((crossProductItem) => {
					if (nodeVariablesRecord[crossProductItem]) {
						nodeVariablesRecord[crossProductItem].forEach((variable) => {
							variablesContainingCrossProduct.add(variable);
						});
					}
				});
			}
			cykTable[cykTableRow][cykTableCol] = variablesContainingCrossProduct;
		}
	}
	return cykTable[0][0].has(startVariable);
}
