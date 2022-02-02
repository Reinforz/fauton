import { extractTerminalsFromCfg } from '../extractTerminalsFromCfg';
import { IContextFreeGrammar, IContextFreeGrammarInput } from '../types';

/**
 * Populates the variables and terminals of cfg via extraction
 * @param cfg Cfg to populate
 * @returns Populated cfg
 */
export function populateCfg(cfg: IContextFreeGrammarInput) {
  // TODO: Loop through all the production rules and extract variables from them
	if (!cfg.variables) {
		cfg.variables = Object.keys(cfg.productionRules);
	}
	if (!cfg.startVariable) {
		// eslint-disable-next-line
		cfg.startVariable = cfg.variables[0];
	}

	if (!cfg.terminals) {
		cfg.terminals = extractTerminalsFromCfg({
			productionRules: cfg.productionRules,
			variables: cfg.variables,
		});
	}

	return cfg as IContextFreeGrammar;
}
