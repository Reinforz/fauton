import { LinkedList } from '@datastructures-js/linked-list';
import { CFGOption } from '../../../types';
import { simplifyCfg } from './simplifyCfg';

interface IQueueItem {
	path: string[];
	label: string;
	rules: Array<[string, number]>;
	chunks: string[];
	word: string;
}

/**
 * Generates all the strings of a given cfg within certain length along with the path taken to generate them
 * @param cfgOptions Variables, terminals and transition Record for the cfg
 * @param maxChunkLength Maximum length of the generated string
 * @param skipSimplification Should the cfg simplification process be skipped, useful if you already have a simplified cfg, and dont want to spend additional computational power behind it, also sometimes you dont want to simplify cfg as it updates the production rules
 * @returns A record of generated string and the path taken to generate them
 */
export function generateCfgLanguage(
	cfgOptions: CFGOption,
	maxChunkLength: number,
	skipSimplification?: boolean
) {
	const { productionRules, startVariable, variables } = cfgOptions;
	const simplifiedVariables = skipSimplification ? variables : simplifyCfg(cfgOptions);
	const linkedList = new LinkedList<IQueueItem>();
	// A set to keep track of all the words that have been traversed
	const traversedSet = new Set(startVariable);
	const variablesSet = new Set(simplifiedVariables);

	linkedList.insertFirst({
		path: [startVariable],
		chunks: [startVariable],
		word: startVariable,
		label: startVariable,
		rules: [],
	});

	const cfgLanguageRecord: Record<string, IQueueItem> = {};
	// A set to keep track of all the strings of the language
	const cfgLanguage: Set<string> = new Set();

	while (linkedList.count()) {
		const queueItem = linkedList.removeFirst()!;
		const { path, chunks, word, rules } = queueItem.getValue();
		// Extracting all the variables of the word

		if (chunks.length <= maxChunkLength) {
			const variablesInWord = chunks.filter((chunk) => variablesSet.has(chunk));
			// If there are no variables, we've generated a concrete word of the language
			if (variablesInWord.length === 0 && !cfgLanguageRecord[word]) {
				cfgLanguageRecord[word] = {
					path,
					rules,
					word,
					label: path.join(' -> '),
					chunks,
				};
				cfgLanguage.add(word);
			} else {
				// Loop through each of the variables in the word
				variablesInWord.forEach((variable) => {
					productionRules[variable].forEach((substitution, substitutionIndex) => {
						// Keeping a temporary chunk as we dont want to update the previous chunks
						let tempChunks: string[] = [];
						const substitutionChunks = substitution.split(' ');
						// Variables to store left and right chunks after substituting
						const leftChunks: string[] = [],
							rightChunks: string[] = [];
						// Replace the variable in the word with the substitution
						// Find the variable index inside the word chunks
						const chunksVariableIndex = chunks.findIndex((chunk) => chunk === variable);
						// If the Chunks contain the variable
						if (chunksVariableIndex !== -1) {
							chunks.forEach((chunk, chunkIndex) => {
								if (chunkIndex < chunksVariableIndex) {
									leftChunks.push(chunk);
								} else if (chunkIndex > chunksVariableIndex) {
									rightChunks.push(chunk);
								}
								tempChunks = [...leftChunks, ...substitutionChunks, ...rightChunks];
							});
						}
						const substitutedWord = tempChunks.join(' ');
						if (!traversedSet.has(substitutedWord) && tempChunks.length <= maxChunkLength) {
							const newPath = [
								...path,
								[...leftChunks, `(${substitution})`, ...rightChunks].join(' '),
							];
							traversedSet.add(substitutedWord);
							linkedList.insertLast({
								rules: [...rules, [variable, substitutionIndex]],
								path: newPath,
								word: substitutedWord,
								label: newPath.join(' -> '),
								chunks: tempChunks,
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
