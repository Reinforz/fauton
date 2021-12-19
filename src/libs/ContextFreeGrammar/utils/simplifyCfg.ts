import { CFGOption } from '../../../types';
import { removeEmptyProduction } from './removeEmptyProduction';
import { removeNullProduction } from './removeNullProduction';
import { removeUnitProduction } from './removeUnitProduction';
import { removeUselessProduction } from './removeUselessProduction';

export function simplifyCfg(cfgOption: CFGOption) {
	removeNullProduction(cfgOption);
	removeUnitProduction(cfgOption);
	const reducedVariables = removeUselessProduction(cfgOption);
	const updatedCfg = {
		...cfgOption,
		variables: reducedVariables,
	};
	return removeEmptyProduction(updatedCfg);
}
