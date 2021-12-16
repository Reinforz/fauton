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
		if (word.length <= maxStringLength) {
			if (isAllTerminal(terminals, word) && !cfgLanguage[word]) {
				cfgLanguage[word] = path;
				totalGeneratedWords += 1;
			} else {
				for (let index = 0; index < word.length; index += 1) {
					const letter = word[index];
					if (variablesSet.has(letter)) {
						transitionRecord[letter].forEach((substitution) => {
							// Replace the variable in the word with the substitution
							const substitutedWord = word.replace(letter, substitution);
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
					}
				}
			}
		}
	}
	return cfgLanguage;
}
