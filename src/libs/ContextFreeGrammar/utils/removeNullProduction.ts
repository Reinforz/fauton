import { LinkedList } from '@datastructures-js/linked-list';
import { CFGOption } from '../../../types';

export function createProductionCombinations(
	substitution: string,
	epsilonProducingVariable: string
) {
	const epsilonProducingVariableCount = substitution
		.split('')
		.filter((letter) => letter === epsilonProducingVariable).length;

	const totalCombinations = 2 ** epsilonProducingVariableCount;
	const newSubstitutions: string[] = [];
	let containsEpsilon = false;

	for (let index = 0; index < totalCombinations; index += 1) {
		let nthVariable = 0;
		let newSubstitution = '';
		for (
			let substitutionIndex = 0;
			substitutionIndex < substitution.length;
			substitutionIndex += 1
		) {
			const substitutionLetter = substitution[substitutionIndex];
			if (substitutionLetter === epsilonProducingVariable) {
				// If nthVariable is 4, it will generate the following combo, 10, 11, 01, 00
				// 11 means both the epsilon variable will be included, 00 means none will be included
				if (index & (1 << nthVariable)) {
					newSubstitution += substitutionLetter;
				}
				nthVariable += 1;
			} else {
				newSubstitution += substitutionLetter;
			}
		}
		// Set the contains epsilon flag to true if we have an epsilon string
		if (!newSubstitution.length) {
			containsEpsilon = true;
		} else {
			// Only add the substitution if we dont have any epsilon
			newSubstitutions.push(newSubstitution);
		}
	}
	return [newSubstitutions, containsEpsilon, epsilonProducingVariableCount] as const;
}

/**
 * Adds epsilon to production rules that references nullable variables
 * @param cfgOption Variables array and production rules record of cfg
 */
export function findNullableVariables(cfgOption: Pick<CFGOption, 'variables' | 'productionRules'>) {
	const { productionRules, variables } = cfgOption;
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
					const productionRule = productionRules[variable][index];
					// Check if the production rule's letter are all nullable
					if (
						productionRule
							.split('')
							.every((productionRuleLetter) => nullableVariablesSet.has(productionRuleLetter))
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
 * @param cfgOption Variables and transition record for cfg
 * @returns New transition record with null production removed
 */
export function removeNullProduction(
	cfgOption: Pick<CFGOption, 'variables' | 'productionRules' | 'startVariable'>
) {
	const { productionRules } = cfgOption;
	const nullableVariables = findNullableVariables(cfgOption);

	nullableVariables.forEach((nullableVariable) => {
		Object.entries(productionRules).forEach(
			([productionRuleVariable, productionRuleSubstitutions]) => {
				const newSubstitutions: string[] = [];
				productionRuleSubstitutions.forEach((substitution) => {
					// No need to proceed further if we are inside a null string
					if (substitution.length) {
						// If there are no variables that produces epsilon
						// No need to update the substitution
						const substitutionLetterSet = new Set(substitution.split(''));
						// If our substitution doesn't contain any nullable variable no need to generate combinations
						if (!substitutionLetterSet.has(nullableVariable)) {
							newSubstitutions.push(substitution);
						} else {
							const [productionCombinations] = createProductionCombinations(
								substitution,
								nullableVariable
							);
							// Generate all possible combination of the production rule, with and without the epsilon producing variable
							newSubstitutions.push(...productionCombinations);
						}
					}
				});

				// Making sure that there are no duplicates
				productionRules[productionRuleVariable] = Array.from(new Set(newSubstitutions));
			}
		);
	});
}
