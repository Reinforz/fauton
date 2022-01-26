import { removeEmptyProduction } from './removeEmptyProduction';
import { removeNullProduction } from './removeNullProduction';
import { removeUnitProduction } from './removeUnitProduction';
import { removeUselessProduction } from './removeUselessProduction';
import { IContextFreeGrammarInput } from './types';
import { populateCfg } from './utils/populateCfg';

/**
 *
 * @param inputCfg Input cfg to simplify
 * @returns
 */
export function simplifyCfg(inputCfg: IContextFreeGrammarInput) {
	const cfg = populateCfg(inputCfg);
	removeNullProduction(cfg);
	removeUnitProduction(cfg);
	const reducedVariables = removeUselessProduction(cfg);
	cfg.variables = reducedVariables;
	const nonEmptyVariables = removeEmptyProduction(cfg);
	cfg.variables = nonEmptyVariables;
}
