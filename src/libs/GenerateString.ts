import { MinPriorityQueue, PriorityQueueItem } from '@datastructures-js/priority-queue';
import { CFGOption, LanguageChecker } from '../types';
import { generateRandomNumber } from '../utils/generateRandomNumber';
import { removeNullProduction } from './ContextFreeGrammar/utils/removeNullProduction';

interface IQueueItem {
	path: string[];
	label: string;
	rules: Array<[string, number]>;
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

	/**
	 * Generates all the strings of a given cfg within certain length along with the path taken to generate them
	 * @param cfgOptions Variables, terminals and transition Record for the cfg
	 * @param totalStrings Total number of strings that should be generated
	 * @param maxStringLength Maximum length of the generated string
	 * @returns A record of generated string and the path taken to generate them
	 */
	static generateCfgLanguage(
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
}
