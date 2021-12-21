import { IContextFreeGrammar } from '../../../types';
import { setDifference } from '../../../utils';
import { generateNewVariable } from './generateNewVariable';
import { simplifyCfg } from './simplifyCfg';

/**
 *
 * @param productionRuleEntries An array of tuples (production rule variable, production rule substitutions)
 * **Example**: `["A", ["a b A", "b a b"]]`
 * @param callBackFn A callback function that will be called for each production rule substitution
 * @returns A tuple ([production rule variable, production rule substitution chunks, production rule substitution index ]) if a rule was found else null
 */
export function findSubstitution(
	productionRuleEntries: [string, string[]][],
	// eslint-disable-next-line
	callBackFn: (productionRuleSubstitutionChunks: string[]) => boolean
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
			// Split the substitutions to get its chunks
			const productionRuleSubstitution =
				productionRuleSubstitutions[productionRuleSubstitutionsIndex];
			const productionRuleSubstitutionChunks = productionRuleSubstitution.split(' ');
			// If the callback returns a truthy boolean value then this is the rule that must be returned
			if (callBackFn(productionRuleSubstitutionChunks)) {
				// Return the tuple of production rule variable, the substitution chunks and the substitution number
				return [
					productionRuleVariable,
					productionRuleSubstitutionChunks,
					productionRuleSubstitutionsIndex,
				] as [string, string[], number];
			}
		}
	}
	return null;
}

/**
 *  Returns the first production rule whose `chunks.length > 2`
 * @param productionRuleEntries An array of tuples (production rule variable, production rule substitutions)
 * **Example**: `["A", ["a b A", "b a b"]]`
 * @returns A tuple ([production rule variable, production rule substitution chunks, production rule substitution index ]) if a long rule was found else null
 */
export function findLongSubstitution(productionRuleEntries: [string, string[]][]) {
	return findSubstitution(
		productionRuleEntries,
		(productionRuleSubstitutionChunks) => productionRuleSubstitutionChunks.length > 2
	);
}

/**
 * Removes all the rules that have more than 2 chunks and add them as new production rules
 * Which will result in all substitutions to have chunk length of at-most 2
 * @param cfg production rules record and variables array of cfg
 */
export function processLongSubstitutions(
	cfg: Pick<IContextFreeGrammar, 'productionRules' | 'variables'>
) {
	const { productionRules } = cfg;
	// Only the current entries will have substitution chunks greater than 2, so no need to recompute it every time
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

		const [
			productionRuleVariable,
			productionRuleSubstitutionChunks,
			productionRuleSubstitutionsIndex,
		] = longRule;
		// Only keep the first substitution chunk and create a separate variable to store the rest
		// Example chunks = ["a", "A", "c"] => ["a", "<new_variable>"] new_variable = ["A", "c"]
		const restOfSubstitutionChunks = productionRuleSubstitutionChunks.slice(1);
		const restOfSubstitution = restOfSubstitutionChunks.join(' ');
		// Check if we have already generated a variable for this substitution
		const generatedVariableSubstitution = generatedVariablesSubstitutionRecord[restOfSubstitution];
		// If not generate a new variable
		const newVariable = generatedVariableSubstitution ?? generateNewVariable(cfg.variables);
		// Remove the production rule substitution index as we will be adding a separate substitution with length 2
		productionRules[productionRuleVariable].splice(productionRuleSubstitutionsIndex, 1);
		// Create a new substitution with the first chunk and the new variable
		productionRules[productionRuleVariable].push(
			`${productionRuleSubstitutionChunks[0]} ${newVariable}`
		);
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
 *  Returns the first production rule whose `chunks.length === 2`
 * @param productionRuleEntries An array of tuples (production rule variable, production rule substitutions)
 * **Example**: `["A", ["a b A", "b a b"]]`
 * @returns A tuple ([production rule variable, production rule substitution chunks, production rule substitution index ]) if a substitution was found else null
 */
export function findSubstitutionOfLengthTwo(
	productionRuleEntries: Array<[string, string[]]>,
	variables: string[]
) {
	const variablesSet = new Set(variables);
	return findSubstitution(
		productionRuleEntries,
		// If there are two chunks and both of them are not variables
		(productionRuleSubstitutionChunks) =>
			productionRuleSubstitutionChunks.length === 2 &&
			setDifference(new Set(productionRuleSubstitutionChunks), variablesSet).size !== 0
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
	const productionRuleEntries = Object.entries(productionRules);
	// A record to keep track of which terminals map to which variables
	const generatedVariablesTerminalRecord: Record<string, string> = {};

	function processSubstitutionOfLengthTwo() {
		// Find the first substitution of length two
		const lengthTwoRule = findSubstitutionOfLengthTwo(productionRuleEntries, variables);
		// If it doesn't exist return false, this will break the loop beneath
		if (!lengthTwoRule) {
			return false;
		}

		const [
			productionRuleVariable,
			productionRuleSubstitutionChunks,
			productionRuleSubstitutionsIndex,
		] = lengthTwoRule;

		// Get the left and right chunk from the chunks, as its guaranteed to be of length two
		const [leftChunk, rightChunk] = productionRuleSubstitutionChunks;
		// Check if the left chunk is terminal
		const isLeftChunkTerminal = terminalsSet.has(leftChunk);
		// Check if the right chunk is terminal
		const isRightChunkTerminal = terminalsSet.has(rightChunk);
		// Steps:-
		// 1. Check which chunks (left, right) are terminals
		// 2. Check if we've already generated a variable for the chunk, if not generate new variable
		// 3. Update the record so that the key is the chunk and value is the terminal
		// 4. Update the production rules to point to the terminals
		// 5. Remove the previous substitution by its index
		// 6. Push the new substitution to the producing variable

		// If both left and right chunks are terminals
		// Example: ["a", "b"] => ["A", "B"] => A = ["a"], B = ["b"]
		if (isLeftChunkTerminal && isRightChunkTerminal) {
			const newVariable1 =
				generatedVariablesTerminalRecord[leftChunk] ?? generateNewVariable(variables);
			if (!generatedVariablesTerminalRecord[leftChunk]) {
				generatedVariablesTerminalRecord[leftChunk] = newVariable1;
			}
			const newVariable2 =
				generatedVariablesTerminalRecord[rightChunk] ?? generateNewVariable(variables);

			if (!generatedVariablesTerminalRecord[rightChunk]) {
				generatedVariablesTerminalRecord[rightChunk] = newVariable2;
			}

			productionRules[newVariable1] = [leftChunk];
			productionRules[newVariable2] = [rightChunk];
			productionRules[productionRuleVariable].splice(productionRuleSubstitutionsIndex, 1);
			productionRules[productionRuleVariable].push(`${newVariable1} ${newVariable2}`);
		}
		// If only the left chunk is terminal
		// Example: ["a", "C"] => ["A", "C"] => A = ["a"]
		else if (isLeftChunkTerminal) {
			const newVariable =
				generatedVariablesTerminalRecord[leftChunk] ?? generateNewVariable(variables);
			productionRules[newVariable] = [leftChunk];
			productionRules[productionRuleVariable].splice(productionRuleSubstitutionsIndex, 1);
			// The right chunk is not a terminal so keep it as it is
			productionRules[productionRuleVariable].push(`${newVariable} ${rightChunk}`);
			if (!generatedVariablesTerminalRecord[leftChunk]) {
				generatedVariablesTerminalRecord[leftChunk] = newVariable;
			}
		}
		// If only the right chunk is terminal
		// Example: ["A", "b"] => ["A", "B"] => B = ["b"]
		else if (isRightChunkTerminal) {
			const newVariable =
				generatedVariablesTerminalRecord[rightChunk] ?? generateNewVariable(variables);
			productionRules[newVariable] = [rightChunk];
			productionRules[productionRuleVariable].splice(productionRuleSubstitutionsIndex, 1);
			productionRules[productionRuleVariable].push(`${leftChunk} ${newVariable}`);

			if (!generatedVariablesTerminalRecord[rightChunk]) {
				generatedVariablesTerminalRecord[rightChunk] = newVariable;
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
 * Converts a cfg to cnf
 * @param cfg Input cfg to convert to cnf
 * @returns Resultant cfg converted to cnf
 */
export function convertToCnf(cfg: IContextFreeGrammar) {
	// Make a deep clone of the CFG so as not to modify the input cfg
	const duplicateCfg = JSON.parse(JSON.stringify(cfg)) as IContextFreeGrammar;
	// Simplify the cfg first
	simplifyCfg(duplicateCfg);
	// Generate a new start variable
	const newStartStateVariable = generateNewVariable(duplicateCfg.variables);
	// The new start variable should contain all the substitutions of the previous start variable
	duplicateCfg.productionRules[newStartStateVariable] =
		duplicateCfg.productionRules[duplicateCfg.startVariable];
	// Update the startVariable to point to the newly created one
	duplicateCfg.startVariable = newStartStateVariable;
	// Process substitutions of chunks.length > 2 first
	processLongSubstitutions(duplicateCfg);
	// Process substitutions of chunks.length === 2 next
	processSubstitutionsOfLengthTwo(duplicateCfg);
	return duplicateCfg;
}
