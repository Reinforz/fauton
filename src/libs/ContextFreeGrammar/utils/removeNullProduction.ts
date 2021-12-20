import { LinkedList } from '@datastructures-js/linked-list';
import { IContextFreeGrammar } from '../../../types';

export function createProductionCombinations(
	substitution: string,
	epsilonProducingVariable: string,
	productionRuleVariable: string
) {
	const substitutionChunks = substitution.split(' ');
	const epsilonProducingVariableCount = substitutionChunks.filter(
		(letter) => letter === epsilonProducingVariable
	).length;

	const totalCombinations = 2 ** epsilonProducingVariableCount;
	const newSubstitutions: string[] = [];
	let containsEpsilon = false;

	for (let index = 0; index < totalCombinations; index += 1) {
		let nthVariable = 0;
		const newSubstitutionChunks: string[] = [];
		for (
			let substitutionChunkIndex = 0;
			substitutionChunkIndex < substitutionChunks.length;
			substitutionChunkIndex += 1
		) {
			const substitutionChunk = substitutionChunks[substitutionChunkIndex];
			if (substitutionChunk === epsilonProducingVariable) {
				// If nthVariable is 4, it will generate the following combo, 10, 11, 01, 00
				// 11 means both the epsilon variable will be included, 00 means none will be included
				if (index & (1 << nthVariable)) {
					newSubstitutionChunks.push(substitutionChunk);
				}
				nthVariable += 1;
			} else {
				newSubstitutionChunks.push(substitutionChunk);
			}
		}
		// Set the contains epsilon flag to true if we have an epsilon string
		if (!newSubstitutionChunks.length) {
			containsEpsilon = true;
		} else {
			const newSubstitutionChunk = newSubstitutionChunks.join(' ');
			// Only add the substitution if we dont have any epsilon
			if (newSubstitutionChunk !== productionRuleVariable) {
				newSubstitutions.push(newSubstitutionChunk);
			}
		}
	}
	return [newSubstitutions, containsEpsilon, epsilonProducingVariableCount] as const;
}

/**
 * Adds epsilon to production rules that references nullable variables
 * @param cfg Variables array and production rules record of cfg
 */
export function findNullableVariables(
	cfg: Pick<IContextFreeGrammar, 'variables' | 'productionRules'>
) {
	const { productionRules, variables } = cfg;
	const linkedList = new LinkedList<string>();
	// A set of nullable variables which directly leads to epsilon
	const nullableVariablesSet: Set<string> = new Set();

	variables
		.filter((variable) =>
			productionRules[variable].some((productionRule) => productionRule.length === 0)
		)
		.forEach((directNullableVariable) => {
			linkedList.insertFirst(directNullableVariable);
			nullableVariablesSet.add(directNullableVariable);
		});

	while (linkedList.count()) {
		const nullableVariable = linkedList.removeFirst().getValue();
		// Find all the variables that indirectly references nullable variables
		variables.forEach((variable) => {
			// No need to check variables that are already nullable for nullability
			if (!nullableVariablesSet.has(variable)) {
				// Loop through each production rules of the variable and check if any of the rules are nullable
				for (let index = 0; index < productionRules[variable].length; index += 1) {
					const productionRuleSubstitutions = productionRules[variable][index];
					// Check if the production rule's substitutions are all nullable, then they are indirectly nullable
					if (
						productionRuleSubstitutions
							.split(' ')
							.every((productionRuleSubstitution) =>
								nullableVariablesSet.has(productionRuleSubstitution)
							)
					) {
						nullableVariablesSet.add(nullableVariable);
						linkedList.insertFirst(variable);
						break;
					}
				}
			}
		});
	}

	return Array.from(nullableVariablesSet);
}

/**
 * Removes all the null production and returns a new transition record
 * @param cfg Variables and transition record for cfg
 * @returns New transition record with null production removed
 */
export function removeNullProduction(
	cfg: Pick<IContextFreeGrammar, 'variables' | 'productionRules' | 'startVariable'>
) {
	const { productionRules } = cfg;
	const nullableVariables = findNullableVariables(cfg);

	nullableVariables.forEach((nullableVariable) => {
		Object.entries(productionRules).forEach(
			([productionRuleVariable, productionRuleSubstitutions]) => {
				const newSubstitutionsChunks: string[] = [];
				productionRuleSubstitutions.forEach((substitution) => {
					// No need to proceed further if we are inside a null string
					if (substitution.length) {
						// If there are no variables that produces epsilon
						// No need to update the substitution
						const substitutionChunks = new Set(substitution.split(' '));
						// If our substitution doesn't contain any nullable variable no need to generate combinations
						if (!substitutionChunks.has(nullableVariable)) {
							newSubstitutionsChunks.push(substitution);
						} else {
							const [productionCombinations] = createProductionCombinations(
								substitution,
								nullableVariable,
								productionRuleVariable
							);
							// Generate all possible combination of the production rule, with and without the epsilon producing variable
							newSubstitutionsChunks.push(...productionCombinations);
						}
					}
				});

				// Making sure that there are no duplicates
				productionRules[productionRuleVariable] = Array.from(new Set(newSubstitutionsChunks));
			}
		);
	});
}
