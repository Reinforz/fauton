import { IContextFreeGrammar } from '../../../types';
import { simplifyCfg } from './simplifyCfg';

function randomIntFromInterval(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const CAPITAL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';

/**
 * Generates a new variable that is not part of the passed variables array
 * @param variables A set of variables which shouldn't be generated
 * @returns Generated variable string
 */
export function generateNewVariable(variables: string[]) {
	const variablesSet = new Set(variables);
	// Create a variable with first character to be any capital letter and 2nd letter to be digit
	let newVariable =
		CAPITAL_LETTERS[randomIntFromInterval(0, CAPITAL_LETTERS.length - 1)] +
		DIGITS[randomIntFromInterval(0, DIGITS.length - 1)];
	// While the new variable is present in our variables set we need to keep on creating it
	while (variablesSet.has(newVariable)) {
		// New variable will be a combination of capital letter and a digit
		newVariable =
			CAPITAL_LETTERS[randomIntFromInterval(0, CAPITAL_LETTERS.length - 1)] +
			DIGITS[randomIntFromInterval(0, DIGITS.length - 1)];
	}
	// Push the newly generated variable to the passed variables array
	variables.push(newVariable);
	return newVariable;
}

export function removeLongRules(cfg: Pick<IContextFreeGrammar, 'productionRules' | 'variables'>) {
	const { productionRules } = cfg;
	// Only the current entries will have substitution chunks greater than 2, so no need to recompute it every time
	const productionRuleEntries = Object.entries(productionRules);
	const generatedVariablesSubstitutionRecord: Record<string, string> = {};

	function removeOneLongRule() {
		let longRule: [string, string[], number] | null = null;
		let shouldBreak = false;
		for (
			let productionRuleEntriesIndex = 0;
			productionRuleEntriesIndex < productionRuleEntries.length;
			productionRuleEntriesIndex += 1
		) {
			const [productionRuleVariable, productionRuleSubstitutions] =
				productionRuleEntries[productionRuleEntriesIndex];

			for (
				let productionRuleSubstitutionsIndex = 0;
				productionRuleSubstitutionsIndex < productionRuleSubstitutions.length;
				productionRuleSubstitutionsIndex += 1
			) {
				const productionRuleSubstitution =
					productionRuleSubstitutions[productionRuleSubstitutionsIndex];
				const productionRuleSubstitutionChunks = productionRuleSubstitution.split(' ');
				if (productionRuleSubstitutionChunks.length > 2) {
					longRule = [
						productionRuleVariable,
						productionRuleSubstitutionChunks,
						productionRuleSubstitutionsIndex,
					];
					shouldBreak = true;
					break;
				}
			}
			if (shouldBreak) {
				break;
			}
		}

		if (!longRule) {
			return false;
		}

		const [
			productionRuleVariable,
			productionRuleSubstitutionChunks,
			productionRuleSubstitutionsIndex,
		] = longRule;
		// Only keep the first substitution chunk and create a separate variable to store the rest
		const restOfSubstitutionChunks = productionRuleSubstitutionChunks.slice(1);
		const restOfSubstitution = restOfSubstitutionChunks.join(' ');
		// If no variable was generated for this substitution
		const generatedVariableSubstitution = generatedVariablesSubstitutionRecord[restOfSubstitution];
		const newVariable = !generatedVariableSubstitution
			? generateNewVariable(cfg.variables)
			: generatedVariablesSubstitutionRecord[restOfSubstitution];
		productionRules[productionRuleVariable].splice(productionRuleSubstitutionsIndex, 1);
		productionRules[productionRuleVariable].push(
			`${productionRuleSubstitutionChunks[0]} ${newVariable}`
		);
		if (!generatedVariableSubstitution) {
			generatedVariablesSubstitutionRecord[restOfSubstitution] = newVariable;
		}
		// If the variable doesn't have any substitutions
		if (!productionRules[newVariable]) {
			productionRules[newVariable] = [restOfSubstitution];
		}
		return true;
	}
	while (removeOneLongRule()) {
		//
	}
}

export function processRulesOfLengthTwo(cfg: IContextFreeGrammar) {
	const { productionRules, terminals, variables } = cfg;
	const terminalsSet: Set<string> = new Set(terminals);
	const productionRuleEntries = Object.entries(productionRules);
	const generatedVariablesTerminalRecord: Record<string, string> = {};

	productionRuleEntries.forEach(([productionRuleVariable, productionRuleSubstitutions]) => {
		productionRuleSubstitutions.forEach((productionRuleSubstitution) => {
			const productionRuleSubstitutionChunks = productionRuleSubstitution.split(' ');
			if (productionRuleSubstitutionChunks.length === 2) {
				const [leftChunk, rightChunk] = productionRuleSubstitutionChunks;
				const isLeftChunkTerminal = terminalsSet.has(leftChunk);
				const isRightChunkTerminal = terminalsSet.has(rightChunk);
				if (isLeftChunkTerminal && isRightChunkTerminal) {
					const newVariable1 =
						generatedVariablesTerminalRecord[leftChunk] ?? generateNewVariable(variables);
					const newVariable2 =
						rightChunk === leftChunk
							? newVariable1
							: generatedVariablesTerminalRecord[rightChunk] ?? generateNewVariable(variables);
					productionRules[newVariable1] = [leftChunk];
					productionRules[newVariable2] = [rightChunk];
					productionRules[productionRuleVariable] = productionRules[productionRuleVariable].filter(
						(_productionRuleSubstitution) =>
							_productionRuleSubstitution !== productionRuleSubstitution
					);
					productionRules[productionRuleVariable] = Array.from(
						new Set(
							productionRules[productionRuleVariable].concat(`${newVariable1} ${newVariable2}`)
						)
					);
					if (!generatedVariablesTerminalRecord[leftChunk]) {
						generatedVariablesTerminalRecord[leftChunk] = newVariable1;
					}
					if (!generatedVariablesTerminalRecord[rightChunk]) {
						generatedVariablesTerminalRecord[rightChunk] = newVariable2;
					}
				} else if (isLeftChunkTerminal) {
					const newVariable =
						generatedVariablesTerminalRecord[leftChunk] ?? generateNewVariable(variables);
					productionRules[newVariable] = [leftChunk];
					productionRules[productionRuleVariable] = productionRules[productionRuleVariable].filter(
						(_productionRuleSubstitution) =>
							_productionRuleSubstitution !== productionRuleSubstitution
					);
					productionRules[productionRuleVariable] = Array.from(
						new Set(productionRules[productionRuleVariable].concat(`${newVariable} ${rightChunk}`))
					);
					if (!generatedVariablesTerminalRecord[leftChunk]) {
						generatedVariablesTerminalRecord[leftChunk] = newVariable;
					}
				} else if (isRightChunkTerminal) {
					const newVariable =
						generatedVariablesTerminalRecord[rightChunk] ?? generateNewVariable(variables);
					productionRules[newVariable] = [rightChunk];
					productionRules[productionRuleVariable] = productionRules[productionRuleVariable].filter(
						(_productionRuleSubstitution) =>
							_productionRuleSubstitution !== productionRuleSubstitution
					);
					productionRules[productionRuleVariable] = Array.from(
						new Set(productionRules[productionRuleVariable].concat(`${leftChunk} ${newVariable}`))
					);
					if (!generatedVariablesTerminalRecord[rightChunk]) {
						generatedVariablesTerminalRecord[rightChunk] = newVariable;
					}
				}
			}
		});
	});
}

export function convertToCnf(cfg: IContextFreeGrammar) {
	const duplicateCfg = JSON.parse(JSON.stringify(cfg)) as IContextFreeGrammar;
	simplifyCfg(duplicateCfg);
	const newStartStateVariable = generateNewVariable(duplicateCfg.variables);
	duplicateCfg.productionRules[newStartStateVariable] =
		duplicateCfg.productionRules[duplicateCfg.startVariable];
	duplicateCfg.startVariable = newStartStateVariable;
	removeLongRules(duplicateCfg);
	processRulesOfLengthTwo(duplicateCfg);
	return duplicateCfg;
}
