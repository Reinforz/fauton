import { LinkedList } from '@datastructures-js/linked-list';
import { CFGOption } from '../../../types';
import { simplifyCfg } from './simplifyCfg';

interface IQueueItem {
	path: string[];
	label: string;
	rules: Array<[string, number]>;
	word: string;
}

/**
 * Generates all the strings of a given cfg within certain length along with the path taken to generate them
 * @param cfgOptions Variables, terminals and transition Record for the cfg
 * @param maxStringLength Maximum length of the generated string
 * @param skipSimplification Should the cfg simplification process be skipped, useful if you already have a simplified cfg, and dont want to spend additional computational power behind it, also sometimes you dont want to simplify cfg as it updates the production rules
 * @returns A record of generated string and the path taken to generate them
 */
export function generateCfgLanguage(
	cfgOptions: CFGOption,
	maxStringLength: number,
	skipSimplification?: boolean
) {
	const { productionRules, startVariable, variables } = cfgOptions;
	const updatedVariables = skipSimplification ? variables : simplifyCfg(cfgOptions);
	const linkedList = new LinkedList<IQueueItem>();
	// A set to keep track of all the words that have been traversed
	const traversedSet = new Set(startVariable);
	const variablesSet = new Set(updatedVariables);

	linkedList.insertFirst({
		path: [],
		word: startVariable,
		label: startVariable,
		rules: [],
	});

	const cfgLanguageRecord: Record<string, IQueueItem> = {};
	const cfgLanguage: Set<string> = new Set();

	while (linkedList.count()) {
		const queueItem = linkedList.removeFirst()!;
		const { path, word, rules } = queueItem.getValue();
		// Extracting all the variables of the word

		if (word.length <= maxStringLength) {
			const variablesInWord = word.split('').filter((letter) => variablesSet.has(letter));
			// If there are no variables, we've generated a concrete word of the language
			if (variablesInWord.length === 0 && !cfgLanguageRecord[word]) {
				const newPath = [...path, word];
				cfgLanguageRecord[word] = {
					path: newPath,
					rules,
					word,
					label: newPath.join(' -> '),
				};
				cfgLanguage.add(word);
			} else {
				// Loop through each of the variables in the word
				variablesInWord.forEach((variable) => {
					productionRules[variable].forEach((substitution, substitutionIndex) => {
						// Replace the variable in the word with the substitution
						const substitutedWord = word.replace(variable, substitution);
						if (!traversedSet.has(substitutedWord) && substitutedWord.length <= maxStringLength) {
							const newPath = [...path, word];
							traversedSet.add(substitutedWord);
							linkedList.insertLast({
								rules: [...rules, [variable, substitutionIndex]],
								path: newPath,
								word: substitutedWord,
								label: newPath.join(' -> '),
							});
						}
					});
				});
			}
		}
	}

	// Returning the production rule as it might be different if we have removed null production rules
	return {
		tree: cfgLanguageRecord,
		language: Array.from(cfgLanguage),
		productionRules,
	};
}
