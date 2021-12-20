import { IContextFreeGrammar } from '../../../types';

function randomIntFromInterval(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const CAPITAL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';

export function generateNewVariable(variables: string[]) {
	const variablesSet = new Set(variables);
	// Create a variable with first character to be any capital letter and 2nd letter to be digit
	let newVariable =
		CAPITAL_LETTERS[randomIntFromInterval(0, CAPITAL_LETTERS.length - 1)] +
		DIGITS[randomIntFromInterval(0, DIGITS.length - 1)];
	// While the new variable is present in our variables set we need to keep on creating it
	while (variablesSet.has(newVariable)) {
		newVariable =
			CAPITAL_LETTERS[randomIntFromInterval(0, CAPITAL_LETTERS.length - 1)] +
			DIGITS[randomIntFromInterval(0, DIGITS.length - 1)];
	}
	variablesSet.add(newVariable);
	return newVariable;
}

export function removeLongRules(cfg: Pick<IContextFreeGrammar, 'productionRules' | 'variables'>) {
	const { productionRules } = cfg;

	function removeOneLongRule() {
		let longRule: [string, string[], number] | null = null;
		const productionRuleEntries = Object.entries(productionRules);
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
		const newVariable = generateNewVariable(cfg.variables);
		productionRules[productionRuleVariable].splice(productionRuleSubstitutionsIndex, 1);
		productionRules[productionRuleVariable].push(
			`${productionRuleSubstitutionChunks[0]} ${newVariable}`
		);
		productionRules[newVariable] = [restOfSubstitutionChunks.join(' ')];
		return true;
	}
	while (removeOneLongRule()) {
		//
	}
}

export function processRulesOfLengthTwo(cfg: IContextFreeGrammar) {
	const { productionRules, terminals, variables } = cfg;
	const terminalsSet: Set<string> = new Set(terminals);
	const substitutionsToProcess: [string, string[], number][] = [];
	const productionRuleEntries = Object.entries(productionRules);
	productionRuleEntries.forEach(([productionRuleVariable, productionRuleSubstitutions]) => {
		productionRuleSubstitutions.forEach(
			(productionRuleSubstitution, productionRuleSubstitutionsIndex) => {
				const productionRuleSubstitutionChunks = productionRuleSubstitution.split(' ');
				if (productionRuleSubstitutionChunks.length === 2) {
					substitutionsToProcess.push([
						productionRuleVariable,
						productionRuleSubstitutionChunks,
						productionRuleSubstitutionsIndex,
					]);
				}
			}
		);
	});

	substitutionsToProcess.forEach(
		([
			productionRuleVariable,
			productionRuleSubstitutionChunks,
			productionRuleSubstitutionsIndex,
		]) => {
			const [leftChunk, rightChunk] = productionRuleSubstitutionChunks;
			const isLeftChunkTerminal = terminalsSet.has(leftChunk);
			const isRightChunkTerminal = terminalsSet.has(rightChunk);
			if (isLeftChunkTerminal && isRightChunkTerminal) {
				const newVariable1 = generateNewVariable(variables);
				const newVariable2 = generateNewVariable(variables);
				productionRules[newVariable1] = [leftChunk];
				productionRules[newVariable2] = [rightChunk];
				productionRules[productionRuleVariable].splice(1, productionRuleSubstitutionsIndex);
				productionRules[productionRuleVariable].push(`${newVariable1} ${newVariable2}`);
			} else if (isLeftChunkTerminal) {
				const newVariable = generateNewVariable(variables);
				productionRules[newVariable] = [leftChunk];
				productionRules[productionRuleVariable].splice(1, productionRuleSubstitutionsIndex);
				productionRules[productionRuleVariable].push(`${newVariable} ${rightChunk}`);
			} else if (isRightChunkTerminal) {
				const newVariable = generateNewVariable(variables);
				productionRules[newVariable] = [rightChunk];
				productionRules[productionRuleVariable].splice(1, productionRuleSubstitutionsIndex);
				productionRules[productionRuleVariable].push(`${leftChunk} ${newVariable}`);
			}
		}
	);
}

export function convertToCnf(cfg: IContextFreeGrammar) {
	const duplicateCfg = JSON.parse(JSON.stringify(cfg)) as IContextFreeGrammar;
	const newStartStateVariable = generateNewVariable(duplicateCfg.variables);
	duplicateCfg.productionRules[newStartStateVariable] =
		duplicateCfg.productionRules[duplicateCfg.startVariable];
	duplicateCfg.startVariable = newStartStateVariable;
	removeLongRules(duplicateCfg);
	processRulesOfLengthTwo(duplicateCfg);
}
