import { MinPriorityQueue, PriorityQueueItem } from '@datastructures-js/priority-queue';
import { CFGOption } from '../../../types';
import { isAllTerminal } from './isAllTerminal';

interface IQueueItem {
	path: string[];
	word: string;
}

export function generateCfgLanguage(
	cfgOptions: CFGOption,
	totalStrings: number,
	maxStringLength: number
) {
	const { transitionRecord, variables, terminals, startVariable } = cfgOptions;
	const toTraverse = new MinPriorityQueue<IQueueItem>();
	const traversedSet = new Set(startVariable);
	const variablesSet = new Set(variables);

	toTraverse.enqueue(
		{
			path: [],
			word: startVariable,
		},
		0
	);

	const cfgLanguage: Record<string, string[]> = {};
	let totalGeneratedWords = 0;
	while (toTraverse.size() > 0 && totalGeneratedWords < totalStrings) {
		const queueItem = toTraverse.dequeue() as PriorityQueueItem<IQueueItem>;
		const {
			element: { path, word },
		} = queueItem;
		// Extracting all the variables of the word
		const variablesInWord = word.split('').filter((letter) => variablesSet.has(letter));

		// Some words might have variables which might be expanded to epsilon
		// For example maxLength is 3, word is aAbc, this would be rejected
		// But if A can be expanded to epsilon then it should at-least be checked
		if (word.length <= maxStringLength + variablesInWord.length) {
			if (isAllTerminal(terminals, word) && !cfgLanguage[word]) {
				cfgLanguage[word] = path;
				totalGeneratedWords += 1;
			} else {
				variablesInWord.forEach((variable) => {
					transitionRecord[variable].forEach((substitution) => {
						// Replace the variable in the word with the substitution
						const substitutedWord = word.replace(variable, substitution);
						if (!traversedSet.has(substitutedWord)) {
							traversedSet.add(substitutedWord);
							toTraverse.enqueue(
								{
									path: [...path, word],
									word: substitutedWord,
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
