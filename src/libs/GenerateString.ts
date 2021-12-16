import { MinPriorityQueue, PriorityQueueItem } from '@datastructures-js/priority-queue';
import { CFGOption, LanguageChecker } from '../types';
import { generateRandomNumber } from '../utils/generateRandomNumber';
import { isAllTerminal } from './ContextFreeGrammar/utils/isAllTerminal';

interface IQueueItem {
	path: string[];
	word: string;
}

export class GenerateString {
	/**
	 * Generates all combination of strings that can be made by the alphabet from length 1 to `maxLength`
	 * @param alphabet Alphabet of the strings
	 * @param maxLength Max length of the generated strings
	 * @param startLength Starting length of the string
	 * @param cb A cb passed each generated string
	 * @returns An array of strings
	 */
	static generateAllCombosWithinLength(
		alphabet: string[],
		maxLength: number,
		startLength?: number,
		// eslint-disable-next-line
		cb?: LanguageChecker
	) {
		const generatedStrings: Set<string> = new Set();

		function generateAllKLength(generatedString: string, stringLength: number) {
			if (stringLength === 0) {
				if (cb) {
					const shouldAdd = cb(generatedString);
					if (shouldAdd) {
						generatedStrings.add(generatedString);
					}
				} else {
					generatedStrings.add(generatedString);
				}
				return;
			}
			for (let i = 0; i < alphabet.length; i += 1) {
				generateAllKLength(generatedString + alphabet[i], stringLength - 1);
			}
		}

		for (let length = startLength ?? 0; length <= maxLength; length += 1) {
			generateAllKLength('', length);
		}

		return Array.from(generatedStrings);
	}

	/**
	 * Generates an array of unique random strings over a given alphabet
	 * @param total Total unique random strings
	 * @param alphabet Alphabet of the random strings
	 * @param minLength Minimum length of each string
	 * @param maxLength Maximum length of each string
	 * @param initialInputStrings Initial array of strings
	 * @returns An array of unique random strings
	 */
	static generateRandomUnique(
		total: number,
		alphabet: string[],
		minLength: number,
		maxLength: number,
		initialInputStrings?: string[]
	) {
		// Using a set to store only unique input strings
		const uniqueRandomInputStrings: Set<string> = new Set(initialInputStrings ?? []);

		while (uniqueRandomInputStrings.size < total) {
			const inputStringLength = generateRandomNumber(minLength, maxLength);
			let randomInputString = '';
			for (let index = 0; index < inputStringLength; index += 1) {
				randomInputString += alphabet[generateRandomNumber(0, alphabet.length - 1)];
			}

			if (!uniqueRandomInputStrings.has(randomInputString)) {
				uniqueRandomInputStrings.add(randomInputString);
			}
		}
		return Array.from(uniqueRandomInputStrings);
	}

	static generateCfgLanguage(cfgOptions: CFGOption, totalStrings: number, maxStringLength: number) {
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
}
