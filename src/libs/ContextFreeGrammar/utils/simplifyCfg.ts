import { CFGOption } from '../../../types';
import { removeEmptyProduction } from './removeEmptyProduction';
import { removeNullProduction } from './removeNullProduction';
import { removeUnitProduction } from './removeUnitProduction';
import { removeUselessProduction } from './removeUselessProduction';

export function simplifyCfg(cfgOption: CFGOption) {
	const reducedVariables = removeUselessProduction(cfgOption);
	const updatedCfg = {
		...cfgOption,
		variables: reducedVariables,
	};
	removeNullProduction(updatedCfg);
	removeUnitProduction(updatedCfg);
	return removeEmptyProduction(updatedCfg);
}
