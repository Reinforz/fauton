import { IContextFreeGrammar } from '../../../types';
import { removeEmptyProduction } from './removeEmptyProduction';
import { removeNullProduction } from './removeNullProduction';
import { removeUnitProduction } from './removeUnitProduction';
import { removeUselessProduction } from './removeUselessProduction';

export function simplifyCfg(cfgGrammar: IContextFreeGrammar) {
	removeNullProduction(cfgGrammar);
	removeUnitProduction(cfgGrammar);
	const reducedVariables = removeUselessProduction(cfgGrammar);
	const updatedCfg = {
		...cfgGrammar,
		variables: reducedVariables,
	};
	return removeEmptyProduction(updatedCfg);
}
