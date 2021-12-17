import { MinPriorityQueue, PriorityQueueItem } from '@datastructures-js/priority-queue';
import { CFGOption } from '../../../types';
import { removeNullProduction } from './removeNullProduction';

interface IQueueItem {
	path: string[];
	label: string;
	rules: Array<[string, number]>;
	word: string;
}

/**
 * Generates all the strings of a given cfg within certain length along with the path taken to generate them
 * @param cfgOptions Variables, terminals and transition Record for the cfg
 * @param totalStrings Total number of strings that should be generated
 * @param maxStringLength Maximum length of the generated string
 * @returns A record of generated string and the path taken to generate them
 */
export function generateCfgLanguage(
	cfgOptions: CFGOption,
	maxStringLength: number,
	removedNullProduction?: boolean
) {
	const { transitionRecord, variables, startVariable } = cfgOptions;
	let transformedTransitionRecord = transitionRecord;
	if (!removedNullProduction) {
		transformedTransitionRecord = removeNullProduction({
			transitionRecord,
			variables,
			startVariable,
		});
	}
	const toTraverse = new MinPriorityQueue<IQueueItem>();
	// A set to keep track of all the words that have been traversed
	const traversedSet = new Set(startVariable);
	const variablesSet = new Set(variables);

	toTraverse.enqueue(
		{
			path: [],
			word: startVariable,
			label: startVariable,
			rules: [],
		},
		0
	);

	const cfgLanguage: Record<string, IQueueItem> = {};
	while (toTraverse.size() > 0) {
		const queueItem = toTraverse.dequeue() as PriorityQueueItem<IQueueItem>;
		const {
			element: { path, word, rules },
		} = queueItem;
		// Extracting all the variables of the word

		if (word.length <= maxStringLength) {
			const variablesInWord = word.split('').filter((letter) => variablesSet.has(letter));
			if (variablesInWord.length === 0 && !cfgLanguage[word]) {
				const newPath = [...path, word];
				cfgLanguage[word] = {
					path: newPath,
					rules,
					word,
					label: newPath.join(' -> '),
				};
			} else {
				variablesInWord.forEach((variable) => {
					transformedTransitionRecord[variable].forEach((substitution, substitutionIndex) => {
						// Replace the variable in the word with the substitution
						const substitutedWord = word.replace(variable, substitution);
						if (!traversedSet.has(substitutedWord)) {
							const newPath = [...path, word];
							traversedSet.add(substitutedWord);
							toTraverse.enqueue(
								{
									rules: [...rules, [variable, substitutionIndex]],
									path: newPath,
									word: substitutedWord,
									label: newPath.join(' -> '),
								},
								substitutedWord.length
							);
						}
					});
				});
			}
		}
	}
	return cfgLanguage;
}
