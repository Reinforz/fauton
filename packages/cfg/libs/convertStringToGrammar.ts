import { IContextFreeGrammar } from './types';
import { extractTerminalsFromCfg } from './utils/extractTerminalsFromCfg';

/**
 * Convert a string representation of cfg object to a cfg object
 * @param grammarString Grammar string to convert to cfg object
 * @returns Converted cfg object
 */
export function convertStringToGrammar(grammarString: string): IContextFreeGrammar {
	const productionRules = grammarString.split('\n');

	const cfg: IContextFreeGrammar = {
		productionRules: {},
		startVariable: '',
		terminals: [],
		variables: [],
	};

	productionRules.forEach((productionRule, productionRuleIndex) => {
		// Guarding against empty string
		// Remove the unnecessary tabs from the start of the rule
		// eslint-disable-next-line
		productionRule = productionRule.replace(/\t/, '');
		const [variable, rules] = productionRule.split(' -> ');

		if (!variable || !rules) {
			throw new Error(`Invalid formatting for rule ${productionRuleIndex + 1}`);
		}
		// Only create the production rule if it doesn't exist, otherwise we might replace the existing one
		if (!cfg.productionRules[variable]) {
			cfg.productionRules[variable] = [];
		}

		// Each production rule is separated by |
		rules.split(' | ').forEach((rule) => {
			cfg.productionRules[variable].push(rule);
		});
		cfg.variables.push(variable);
	});

	cfg.variables = Array.from(new Set(cfg.variables));
	// Set the first variable as the start variable
	// eslint-disable-next-line
	cfg.startVariable = cfg.variables[0];

	cfg.terminals = extractTerminalsFromCfg(cfg);
	return cfg;
}
