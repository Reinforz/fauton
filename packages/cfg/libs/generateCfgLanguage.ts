import { LinkedList } from '@datastructures-js/linked-list';
import { simplifyCfg } from './simplifyCfg';
import { ICfgLanguageGenerationOption, IContextFreeGrammarInput } from './types';
import { populateCfg } from './utils/populateCfg';
import { validateCfg } from './validateCfg';

interface IQueueItem {
	path: string[];
	label: string;
	rules: Array<[string, number]>;
	tokens: string[];
	sentence: string;
}

/**
 * Generates all the strings of a given cfg within certain length along with the path taken to generate them
 * @param cfg Variables and transition Record for the cfg
 * @param maxTokenLength Maximum length of the generated string
 * @param skipSimplification Should the cfg simplification process be skipped, useful if you already have a simplified cfg, and dont want to spend additional computational power behind it, also sometimes you dont want to simplify cfg as it updates the production rules
 * @returns A record of generated string and the path taken to generate them
 */
export function generateCfgLanguage(
	inputCfg: IContextFreeGrammarInput,
	options: ICfgLanguageGenerationOption
) {
	const cfg = populateCfg(inputCfg);

	const { productionRules, startVariable } = cfg;
	const {
		/* generateTerminals = false,  */ minTokenLength,
		maxTokenLength,
		skipSimplification = false,
		skipValidation = false,
		autoCapitalizeFirstToken = true,
		useSpaceWhenJoiningTokens = true,
		parseDirection = 'left',
	} = options;

	if (!skipValidation) {
		validateCfg(cfg);
	}

	if (!skipSimplification) {
		simplifyCfg(cfg);
	}

	const linkedList = new LinkedList<IQueueItem>();
	// A set to keep track of all the words that have been traversed
	const traversedSet = new Set(startVariable);
	const variablesSet = new Set(cfg.variables);

	linkedList.insertFirst({
		path: [startVariable],
		tokens: [startVariable],
		sentence: startVariable,
		label: startVariable,
		rules: [],
	});

	const cfgLanguageRecord: Record<string, IQueueItem> = {};
	// A set to keep track of all the strings of the language
	const cfgLanguage: Set<string> = new Set();
	const chunkJoinSeparator = useSpaceWhenJoiningTokens ? ' ' : '';

	while (linkedList.count()) {
		const queueItem = linkedList.removeFirst()!;
		const { path, tokens, sentence, rules } = queueItem.getValue();
		// Extracting all the variables of the sentence

		if (tokens.length <= maxTokenLength) {
			const variablesInWord = tokens.filter((chunk) => variablesSet.has(chunk));
			// If there are no variables, we've generated a concrete sentence of the language
			if (
				variablesInWord.length === 0 &&
				!cfgLanguageRecord[sentence] &&
				tokens.length >= minTokenLength
			) {
				cfgLanguageRecord[sentence] = {
					path,
					rules,
					sentence,
					label: path.join(' -> '),
					tokens,
				};
				cfgLanguage.add(sentence);
			} else {
				const updatedVariables =
					parseDirection === 'left' ? variablesInWord : variablesInWord.reverse();
				// Loop through each of the variables in the sentence
				updatedVariables.forEach((variable) => {
					productionRules[variable].forEach((substitution, substitutionIndex) => {
						// Keeping a temporary chunk as we dont want to update the previous tokens
						let tempTokens: string[] = [];
						const substitutionTokens = substitution.split(' ');
						// Variables to store left and right tokens after substituting
						const leftTokens: string[] = [],
							rightTokens: string[] = [];
						// Replace the variable in the sentence with the substitution
						// Find the variable index inside the sentence tokens
						const tokensVariableIndex =
							parseDirection === 'left' ? tokens.indexOf(variable) : tokens.lastIndexOf(variable);
						// If the Tokens contain the variable
						if (tokensVariableIndex !== -1) {
							tokens.forEach((chunk, chunkIndex) => {
								if (chunkIndex < tokensVariableIndex) {
									leftTokens.push(chunk);
								} else if (chunkIndex > tokensVariableIndex) {
									rightTokens.push(chunk);
								}
								tempTokens = [...leftTokens, ...substitutionTokens, ...rightTokens];
							});
						}
						let newSentence = tempTokens.join(chunkJoinSeparator);
						// If auto capitalize is enabled, capitalize the first chunk
						newSentence = autoCapitalizeFirstToken
							? newSentence[0].toUpperCase() + newSentence.slice(1)
							: newSentence;
						// If we haven't traversed this sentence, and total tokens is less than maximum chunk length
						if (!traversedSet.has(newSentence) && tempTokens.length <= maxTokenLength) {
							// Construct the new path, and add (bracket) around the new substitute to show which one was substituted
							const newPath = [
								...path,
								[...leftTokens, `(${substitution})`, ...rightTokens].join(' '),
							];
							traversedSet.add(newSentence);
							linkedList.insertLast({
								rules: [...rules, [variable, substitutionIndex]],
								path: newPath,
								sentence: newSentence,
								label: newPath.join(' -> '),
								tokens: tempTokens,
							});
						}
					});
				});
			}
		}
	}

	return {
		tree: cfgLanguageRecord,
		language: Array.from(cfgLanguage),
		// Returning the production rule as it might be different if we have removed null production rules
		productionRules,
	};
}
