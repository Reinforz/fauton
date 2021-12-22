import { removeEmptyProduction } from './removeEmptyProduction';
import { removeNullProduction } from './removeNullProduction';
import { removeUnitProduction } from './removeUnitProduction';
import { removeUselessProduction } from './removeUselessProduction';
import { IContextFreeGrammar } from './types';

export function simplifyCfg(cfg: IContextFreeGrammar) {
	removeNullProduction(cfg);
	removeUnitProduction(cfg);
	const reducedVariables = removeUselessProduction(cfg);
	const updatedCfg = {
		...cfg,
		variables: reducedVariables,
	};
	return removeEmptyProduction(updatedCfg);
}
