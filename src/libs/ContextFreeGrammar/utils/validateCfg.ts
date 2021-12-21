import { IContextFreeGrammar } from '../../../types';

export function validateCfg(cfg: IContextFreeGrammar) {
	const { startVariable, terminals, productionRules, variables } = cfg;
	// Check if all the variables is present in transition record
	const productionRulesEntries = Object.entries(productionRules);
	if (productionRulesEntries.length !== variables.length) {
		throw new Error('All variables must be present in the transition record');
	}
	const terminalsSet = new Set(terminals);
	const variablesSet = new Set(variables);
	// Validate that all the keys of transition record are variables
	productionRulesEntries.forEach(([productionRuleVariable, productionRuleSubstitutions]) => {
		if (!variablesSet.has(productionRuleVariable)) {
			throw new Error(
				`Transition record contains a variable ${productionRuleVariable}, that is not present in variables array`
			);
		}
		// Check if all the substitutions contain either variable or terminal
		productionRuleSubstitutions.forEach((productionRuleSubstitution) => {
			const productionRuleSubstitutionChunks = productionRuleSubstitution.split(' ');
			for (let index = 0; index < productionRuleSubstitutionChunks.length; index += 1) {
				const productionRuleSubstitutionChunk = productionRuleSubstitutionChunks[index];
				// Check if the letter is a terminal
				const isTerminal = terminalsSet.has(productionRuleSubstitutionChunk);
				// Check if the letter is a variable
				const isVariable = variablesSet.has(productionRuleSubstitutionChunk);

				if (!isTerminal && !isVariable) {
					throw new Error(
						`Transition record substitution letter ${productionRuleSubstitutionChunk} is neither a variable nor a terminal`
					);
				}
			}
		});
	});
	// Check if the starting variable is part of variables
	if (!variablesSet.has(startVariable)) {
		throw new Error(`Starting variable must be part of variables array`);
	}
}
