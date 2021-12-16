import { CFGOption } from '../../../types';

function createProductionCombinations(
	substitution: string,
	epsilonProducingVariable: string,
	epsilonProducingVariableCount: number
) {
	const totalCombinations = 2 ** epsilonProducingVariableCount;
	const newSubstitutions: string[] = [];

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
		newSubstitutions.push(newSubstitution);
	}
	return newSubstitutions;
}

/**
 * Removes all the null production and returns a new transition record
 * @param cfgOption Variables and transition record for cfg
 * @returns New transition record with null production removed
 */
export function removeNullProduction(cfgOption: Pick<CFGOption, 'variables' | 'transitionRecord'>) {
	const { transitionRecord, variables } = cfgOption;

	// eslint-disable-next-line
	while (true) {
		const epsilonProductionVariableIndex = variables.findIndex((variable) =>
			transitionRecord[variable].some((substitution) => substitution.length === 0)
		);
		if (epsilonProductionVariableIndex === -1) {
			break;
		} else {
			const epsilonProductionVariable = variables[epsilonProductionVariableIndex];
			transitionRecord[epsilonProductionVariable].splice(epsilonProductionVariableIndex, 1);
			Object.entries(transitionRecord).forEach(
				([transitionRecordVariable, transitionRecordSubstitutions]) => {
					const newSubstitutions: string[] = [];
					transitionRecordSubstitutions.forEach((substitution) => {
						// Count the number of e production variable in the substitution
						const epsilonProductionVariableCount = substitution
							.split('')
							.filter((letter) => letter === epsilonProductionVariable).length;
						// If there are no variables that produces epsilon
						// No need to update the substitution
						if (epsilonProductionVariableCount === 0) {
							newSubstitutions.push(substitution);
						} else {
							// Generate all possible combination of the production rule, with and without the epsilon producing variable
							newSubstitutions.push(
								...createProductionCombinations(
									substitution,
									epsilonProductionVariable,
									epsilonProductionVariableCount
								)
							);
						}
					});

					// Making sure that there are no duplicates
					transitionRecord[transitionRecordVariable] = Array.from(new Set(newSubstitutions));
				}
			);
		}
	}
	return transitionRecord;
}
