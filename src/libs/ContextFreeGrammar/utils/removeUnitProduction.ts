import { CFGAutomaton, CFGOption } from '../../../types';

/**
 * Returns the first occurrence of unit production inside production rules
 * @param variables Array of variables
 * @param productionRules Production rules of CFG
 * @returns A tuple where the first item is the variable which produces unit production, and second item indicates the rule position
 */
export function findFirstUnitProductionRule(
	variables: string[],
	productionRules: CFGAutomaton['productionRules']
) {
	const variablesSet = new Set(variables);
	// Loop through all the variables
	for (let variableIndex = 0; variableIndex < variables.length; variableIndex += 1) {
		const variable = variables[variableIndex];
		// For each variable, loop through its production rules
		for (
			let productionRuleSubstitutionIndex = 0;
			productionRuleSubstitutionIndex < productionRules[variable].length;
			productionRuleSubstitutionIndex += 1
		) {
			const productionRuleSubstitution = productionRules[variable][productionRuleSubstitutionIndex];
			const productionRuleSubstitutionChunks = productionRuleSubstitution.split(' ');
			// If the production rule substitution is of length one and its a variable
			if (
				productionRuleSubstitutionChunks.length === 1 &&
				variablesSet.has(productionRuleSubstitution)
			) {
				return [variable, productionRuleSubstitutionIndex] as const;
			}
		}
	}
	return null;
}

/**
 * Modifies the production rules of a cfg to remove unit production rules
 * @param cfgOption Variable and production rules of a cfg
 */
export function removeUnitProduction(cfgOption: Pick<CFGOption, 'variables' | 'productionRules'>) {
	let unitProductionRule = findFirstUnitProductionRule(
		cfgOption.variables,
		cfgOption.productionRules
	);
	// Only continue if there is any unit production rule
	while (unitProductionRule) {
		const [unitProductionVariable, productionRuleSubstitutionIndex] = unitProductionRule;
		// Get all the production rules of the unit production variable
		const unitProductionRules = cfgOption.productionRules[unitProductionVariable];
		const unitProducingVariableRules =
			cfgOption.productionRules[unitProductionRules[productionRuleSubstitutionIndex]];
		// Remove the rule that generates unit production
		unitProductionRules.splice(productionRuleSubstitutionIndex, 1);
		// Add all the rules of the unit production rule
		unitProductionRules.push(...unitProducingVariableRules);
		unitProductionRule = findFirstUnitProductionRule(
			cfgOption.variables,
			cfgOption.productionRules
		);
	}
}
