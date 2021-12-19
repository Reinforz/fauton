import { CFGOption } from '../../../types';
import { reduceCfg } from './reduceCfg';
import { removeEmptyProduction } from './removeEmptyProduction';
import { removeNullProduction } from './removeNullProduction';
import { removeUnitProduction } from './removeUnitProduction';

export function simplifyCfg(cfgOption: CFGOption) {
	const reducedVariables = reduceCfg(cfgOption);
	const updatedCfg = {
		...cfgOption,
		variables: reducedVariables,
	};
	removeNullProduction(updatedCfg);
	removeUnitProduction(updatedCfg);
	return removeEmptyProduction(updatedCfg);
}
