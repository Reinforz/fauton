import { simplifyCfg } from './simplifyCfg';
import { IContextFreeGrammar, IContextFreeGrammarInput } from './types';
import { generateNewVariable } from './utils/generateNewVariable';
import { populateCfg } from './utils/populateCfg';

/**
 *
 * @param productionRuleEntries An array of tuples (production rule variable, production rule substitutions)
 * **Example**: `["A", ["a b A", "b a b"]]`
 * @param callBackFn A callback function that will be called for each production rule substitution
 * @returns A tuple ([production rule variable, production rule substitution tokens, production rule substitution index ]) if a rule was found else null
 */
export function findSubstitution(
	productionRuleEntries: [string, string[]][],
	// eslint-disable-next-line
	callBackFn: (tokens: string[]) => boolean
) {
	// Loop through all the production rule entries
	for (
		let productionRuleEntriesIndex = 0;
		productionRuleEntriesIndex < productionRuleEntries.length;
		productionRuleEntriesIndex += 1
	) {
		// Get the producing variable and its substitutions from the entries
		const [productionRuleVariable, productionRuleSubstitutions] =
			productionRuleEntries[productionRuleEntriesIndex];

		// Loop through all the substitutions
		for (
			let productionRuleSubstitutionsIndex = 0;
			productionRuleSubstitutionsIndex < productionRuleSubstitutions.length;
			productionRuleSubstitutionsIndex += 1
		) {
			// Split the substitutions to get its tokens
			const productionRuleSubstitution =
				productionRuleSubstitutions[productionRuleSubstitutionsIndex];
			const tokens = productionRuleSubstitution.split(' ');
			// If the callback returns a truthy boolean value then this is the rule that must be returned
			if (callBackFn(tokens)) {
				// Return the tuple of production rule variable, the substitution tokens and the substitution number
				return [productionRuleVariable, tokens, productionRuleSubstitutionsIndex] as [
					string,
					string[],
					number
				];
			}
		}
	}
	return null;
}

/**
 *  Returns the first production rule whose `tokens.length > 2`
 * @param productionRuleEntries An array of tuples (production rule variable, production rule substitutions)
 * **Example**: `["A", ["a b A", "b a b"]]`
 * @returns A tuple ([production rule variable, production rule substitution tokens, production rule substitution index ]) if a long rule was found else null
 */
export function findLongSubstitution(productionRuleEntries: [string, string[]][]) {
	return findSubstitution(productionRuleEntries, (tokens) => tokens.length > 2);
}

/**
 * Removes all the rules that have more than 2 tokens and add them as new production rules
 * Which will result in all substitutions to have chunk length of at-most 2
 * @param cfg production rules record and variables array of cfg
 */
export function processLongSubstitutions(
	cfg: Pick<IContextFreeGrammar, 'productionRules' | 'variables'>
) {
	const { productionRules } = cfg;
	// Only the current entries will have substitution tokens greater than 2, so no need to recompute it every time
	const productionRuleEntries = Object.entries(productionRules);
	// A record to keep track of which substitution got mapped to which variable,
	// As we dont want to generate new variables for an existing substitution
	const generatedVariablesSubstitutionRecord: Record<string, string> = {};

	function processLongSubstitution() {
		// Find a long rule first
		const longRule = findLongSubstitution(productionRuleEntries);
		// If no long rules exist then return false, this will break the loop below
		if (!longRule) {
			return false;
		}

		const [productionRuleVariable, tokens, productionRuleSubstitutionsIndex] = longRule;
		// Only keep the first substitution chunk and create a separate variable to store the rest
		// Example tokens = ["a", "A", "c"] => ["a", "<new_variable>"] new_variable = ["A", "c"]
		const restOfSubstitutionTokens = tokens.slice(0, tokens.length - 1);
		const restOfSubstitution = restOfSubstitutionTokens.join(' ');
		// Check if we have already generated a variable for this substitution
		const generatedVariableSubstitution = generatedVariablesSubstitutionRecord[restOfSubstitution];
		// If not generate a new variable
		const newVariable = generatedVariableSubstitution ?? generateNewVariable(cfg.variables);
		// Remove the production rule substitution index as we will be adding a separate substitution with length 2
		productionRules[productionRuleVariable].splice(productionRuleSubstitutionsIndex, 1);
		// Create a new substitution with the first chunk and the new variable
		productionRules[productionRuleVariable].push(`${newVariable} ${tokens[tokens.length - 1]}`);
		// If we haven't added the substitution to the record, add the substitution as the key and the generated variable as the value
		if (!generatedVariableSubstitution) {
			generatedVariablesSubstitutionRecord[restOfSubstitution] = newVariable;
		}
		// Add the new variable to the production rule, if it already exists it will be replaced
		productionRules[newVariable] = [restOfSubstitution];
		return true;
	}

	while (processLongSubstitution()) {
		//
	}
}

/**
 *  Returns the first production rule whose `tokens.length === 2`
 * @param productionRuleEntries An array of tuples (production rule variable, production rule substitutions)
 * **Example**: `["A", ["a b A", "b a b"]]`
 * @returns A tuple ([production rule variable, production rule substitution tokens, production rule substitution index ]) if a substitution was found else null
 */
export function findSubstitutionOfLengthTwo(
	productionRuleEntries: Array<[string, string[]]>,
	variables: string[]
) {
	const variablesSet = new Set(variables);
	return findSubstitution(
		productionRuleEntries,
		// If there are two tokens and both of them are not variables
		(tokens) => {
			if (tokens.length === 2) {
				const [leftToken, rightToken] = tokens;
				const isLeftTokenVariable = variablesSet.has(leftToken);
				// Check if the right chunk is terminal
				const isRightTokenVariable = variablesSet.has(rightToken);
				return !isRightTokenVariable || !isLeftTokenVariable;
			} else {
				return false;
			}
		}
	);
}

/**
 * Processes all substitutions of chunk length two
 * @param cfg Production rules record, variables and terminals array of cfg
 */
export function processSubstitutionsOfLengthTwo(
	cfg: Pick<IContextFreeGrammar, 'productionRules' | 'variables' | 'terminals'>
) {
	const { productionRules, terminals, variables } = cfg;
	const terminalsSet: Set<string> = new Set(terminals);
	// A record to keep track of which terminals map to which variables
	const generatedVariablesTerminalRecord: Record<string, string> = {};

	// Loop through all variables to see which variables produces a single terminal
	variables.forEach((variable) => {
		const terminal = productionRules[variable][0];
		if (productionRules[variable].length === 1 && terminalsSet.has(terminal)) {
			generatedVariablesTerminalRecord[terminal] = variable;
		}
	});

	function processSubstitutionOfLengthTwo() {
		// Find the first substitution of length two
		const productionRuleEntries = Object.entries(productionRules);
		const lengthTwoRule = findSubstitutionOfLengthTwo(productionRuleEntries, variables);
		// If it doesn't exist return false, this will break the loop beneath
		if (!lengthTwoRule) {
			return false;
		}

		const [productionRuleVariable, tokens, productionRuleSubstitutionsIndex] = lengthTwoRule;

		// Get the left and right chunk from the tokens, as its guaranteed to be of length two
		const [leftToken, rightToken] = tokens;
		// Check if the left chunk is terminal
		const isLeftTokenTerminal = terminalsSet.has(leftToken);
		// Check if the right chunk is terminal
		const isRightTokenTerminal = terminalsSet.has(rightToken);
		// Steps:-
		// 1. Check which tokens (left, right) are terminals
		// 2. Check if we've already generated a variable for the chunk, if not generate new variable
		// 3. Update the record so that the key is the chunk and value is the terminal
		// 4. Update the production rules to point to the terminals
		// 5. Remove the previous substitution by its index
		// 6. Push the new substitution to the producing variable

		// If both left and right tokens are terminals
		// Example: ["a", "b"] => ["A", "B"] => A = ["a"], B = ["b"]
		if (isLeftTokenTerminal && isRightTokenTerminal) {
			const newVariable1 =
				generatedVariablesTerminalRecord[leftToken] ?? generateNewVariable(variables);
			if (!generatedVariablesTerminalRecord[leftToken]) {
				generatedVariablesTerminalRecord[leftToken] = newVariable1;
			}
			const newVariable2 =
				generatedVariablesTerminalRecord[rightToken] ?? generateNewVariable(variables);

			if (!generatedVariablesTerminalRecord[rightToken]) {
				generatedVariablesTerminalRecord[rightToken] = newVariable2;
			}

			productionRules[newVariable1] = [leftToken];
			productionRules[newVariable2] = [rightToken];
			productionRules[productionRuleVariable].splice(productionRuleSubstitutionsIndex, 1);
			productionRules[productionRuleVariable].push(`${newVariable1} ${newVariable2}`);
		}
		// If only the left chunk is terminal
		// Example: ["a", "C"] => ["A", "C"] => A = ["a"]
		else if (isLeftTokenTerminal) {
			const newVariable =
				generatedVariablesTerminalRecord[leftToken] ?? generateNewVariable(variables);
			productionRules[newVariable] = [leftToken];
			productionRules[productionRuleVariable].splice(productionRuleSubstitutionsIndex, 1);
			// The right chunk is not a terminal so keep it as it is
			productionRules[productionRuleVariable].push(`${newVariable} ${rightToken}`);
			if (!generatedVariablesTerminalRecord[leftToken]) {
				generatedVariablesTerminalRecord[leftToken] = newVariable;
			}
		}
		// If only the right chunk is terminal
		// Example: ["A", "b"] => ["A", "B"] => B = ["b"]
		else if (isRightTokenTerminal) {
			const newVariable =
				generatedVariablesTerminalRecord[rightToken] ?? generateNewVariable(variables);
			productionRules[newVariable] = [rightToken];
			productionRules[productionRuleVariable].splice(productionRuleSubstitutionsIndex, 1);
			productionRules[productionRuleVariable].push(`${leftToken} ${newVariable}`);

			if (!generatedVariablesTerminalRecord[rightToken]) {
				generatedVariablesTerminalRecord[rightToken] = newVariable;
			}
		}
		return true;
	}

	// While there are substitutions of length two to be processes, process them
	while (processSubstitutionOfLengthTwo()) {
		//
	}
}

/**
 * Check if a variable references itself in its production rule
 * @param rules Production rules for the variable
 * @param variable Producing variable
 */
export function checkForSelfReference(rules: string[], variable: string) {
	return rules.some((rule) => {
		const tokens = new Set(rule.split(' '));
		return tokens.has(variable);
	});
}

/**
 * Converts a cfg to cnf
 * @param cfg Input cfg to convert to cnf
 * @returns Resultant cfg converted to cnf
 */
export function convertToCnf(inputCfg: IContextFreeGrammarInput) {
	const cfg = populateCfg(inputCfg);
	// Make a deep clone of the CFG so as not to modify the input cfg
	const duplicateCfg = JSON.parse(JSON.stringify(cfg)) as IContextFreeGrammar;
	// Simplify the cfg first
	simplifyCfg(duplicateCfg);

	// Check if the start variable references itself
	const doesStartVariableReferencesItself = checkForSelfReference(
		duplicateCfg.productionRules[duplicateCfg.startVariable],
		duplicateCfg.startVariable
	);
	// Only create a new start variable if the current start variable produces itself
	if (doesStartVariableReferencesItself) {
		// Generate a new start variable
		const newStartStateVariable = generateNewVariable(duplicateCfg.variables);
		// The new start variable should contain all the substitutions of the previous start variable
		duplicateCfg.productionRules[newStartStateVariable] =
			duplicateCfg.productionRules[duplicateCfg.startVariable];
		// Update the startVariable to point to the newly created one
		duplicateCfg.startVariable = newStartStateVariable;
	}
	// Some variables might have been removed after simplification
	duplicateCfg.variables = Object.keys(duplicateCfg.productionRules);

	// Process substitutions of tokens.length > 2 first
	processLongSubstitutions(duplicateCfg);

	// Process substitutions of tokens.length === 2 next
	processSubstitutionsOfLengthTwo(duplicateCfg);
	return duplicateCfg;
}
