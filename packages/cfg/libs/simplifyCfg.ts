import { removeEmptyProduction } from './removeEmptyProduction';
import { removeNullProduction } from './removeNullProduction';
import { removeUnitProduction } from './removeUnitProduction';
import { removeUselessProduction } from './removeUselessProduction';
import { IContextFreeGrammarInput } from './types';
import { populateCfg } from './utils/populateCfg';

export function simplifyCfg(inputCfg: IContextFreeGrammarInput) {
	const cfg = populateCfg(inputCfg);
	removeNullProduction(cfg);
	removeUnitProduction(cfg);
	const reducedVariables = removeUselessProduction(cfg);
	const updatedCfg = {
		...cfg,
		variables: reducedVariables,
	};
	return removeEmptyProduction(updatedCfg);
}
