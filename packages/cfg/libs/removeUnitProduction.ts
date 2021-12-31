import { IContextFreeGrammar, IContextFreeGrammarInput } from './types';
import { populateCfg } from './utils/populateCfg';

/**
 * Returns the first occurrence of unit production inside production rules
 * @param variables Array of variables
 * @param productionRules Production rules of CFG
 * @returns A tuple where the first item is the variable which produces unit production, and second item indicates the rule position
 */
export function findFirstUnitProductionRule(
	variables: string[],
	productionRules: IContextFreeGrammar['productionRules']
) {
	const variablesSet = new Set(variables);
	// Loop through all the variables
	for (let variableIndex = 0; variableIndex < variables.length; variableIndex += 1) {
		const variable = variables[variableIndex];
		if (productionRules[variable]) {
			// For each variable, loop through its production rules
			for (
				let productionRuleSubstitutionIndex = 0;
				productionRuleSubstitutionIndex < productionRules[variable].length;
				productionRuleSubstitutionIndex += 1
			) {
				const productionRuleSubstitution =
					productionRules[variable][productionRuleSubstitutionIndex];
				const tokens = productionRuleSubstitution.split(' ');
				// If the production rule substitution is of length one and its a variable
				if (tokens.length === 1 && variablesSet.has(productionRuleSubstitution)) {
					return [variable, productionRuleSubstitutionIndex] as const;
				}
			}
		}
	}
	return null;
}

/**
 * Modifies the production rules of a cfg to remove unit production rules
 * @param cfg Variable and production rules of a cfg
 */
export function removeUnitProduction(
	inputCfg: Pick<IContextFreeGrammarInput, 'variables' | 'productionRules'>
) {
	const cfg = populateCfg(inputCfg);
	let unitProductionRule = findFirstUnitProductionRule(cfg.variables, cfg.productionRules);
	// Only continue if there is any unit production rule
	while (unitProductionRule) {
		const [unitProductionVariable, productionRuleSubstitutionIndex] = unitProductionRule;
		// Get all the production rules of the unit production variable
		const unitProductionRules = cfg.productionRules[unitProductionVariable];
		const unitProducingVariableRules =
			cfg.productionRules[unitProductionRules[productionRuleSubstitutionIndex]];
		// Remove the rule that generates unit production
		unitProductionRules.splice(productionRuleSubstitutionIndex, 1);
		// Some variables might not be present in the production rules
		if (unitProducingVariableRules) {
			// Making sure there are no duplicate rules
			cfg.productionRules[unitProductionVariable] = Array.from(
				// Add all the rules of the unit production rule
				new Set(unitProductionRules.concat(unitProducingVariableRules))
			);
		}
		unitProductionRule = findFirstUnitProductionRule(cfg.variables, cfg.productionRules);
	}
}
