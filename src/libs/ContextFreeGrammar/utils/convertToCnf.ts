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

export function removeOneLongRule(cfg: IContextFreeGrammar) {
	const { productionRules } = cfg;
	let longRule: [string, string[], number] | null = null;
	const productionRuleEntries = Object.entries(productionRules);
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
			}
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

export function convertToCnf(cfg: IContextFreeGrammar) {
	while (removeOneLongRule(cfg)) {
		//
	}
}
