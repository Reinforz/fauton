import { IFiniteAutomaton, RegexNode } from '../../../types';
import { addConcatOperatorToRegex } from './addConcatOperatorToRegex';
import { convertInfixRegexToPostfix } from './convertInfixRegexToPostfix';
import {
	generateTransitionsForConcat,
	generateTransitionsForKleene,
	generateTransitionsForOr,
	generateTransitionsForPlus,
	generateTransitionsForSymbol,
} from './generateRegexNodeTransitions';
import { generateRegexTree } from './generateRegexTree';
import { validateRegex } from './validateRegex';

export function generateEpsilonNfaFromRegex(alphabets: string[], regexString: string) {
	const transitionsRecord: IFiniteAutomaton['automaton']['transitions'] = {};
	const epsilonTransitionsRecord: Record<string, string[]> = {};
	let stateBoundaries: [number, number][] = [];

	function recursive(regexNode: RegexNode) {
		if (regexNode.operator === 'Literal') {
			const result = generateTransitionsForSymbol(
				stateBoundaries.length === 0 ? 0 : stateBoundaries[stateBoundaries.length - 1][1] + 1,
				regexNode.operands[0].toString()
			);
			stateBoundaries.push(result.stateBoundaries);
			Object.entries(result.transitionsRecord).forEach(([stateKey, stateRecord]) => {
				transitionsRecord[stateKey] = stateRecord;
			});
		} else {
			regexNode.operands.forEach((operand) => {
				recursive(operand);
			});
			let result: ReturnType<typeof generateTransitionsForOr> | null = null;

			if (regexNode.operator === 'Or') {
				result = generateTransitionsForOr(stateBoundaries);
				stateBoundaries = [result.stateBoundaries];
			} else if (regexNode.operator === 'Kleene') {
				result = generateTransitionsForKleene(stateBoundaries[stateBoundaries.length - 1]);
				stateBoundaries[stateBoundaries.length - 1] = result.stateBoundaries;
			} else if (regexNode.operator === 'Concat') {
				result = generateTransitionsForConcat(stateBoundaries);
				stateBoundaries = [result.stateBoundaries];
			} else if (regexNode.operator === 'Plus') {
				result = generateTransitionsForPlus(stateBoundaries[stateBoundaries.length - 1]);
				stateBoundaries[stateBoundaries.length - 1] = result.stateBoundaries;
			}
			if (result) {
				Object.entries(result.epsilonTransitionsRecord).forEach(([stateKey, targetStates]) => {
					if (!epsilonTransitionsRecord[stateKey]) {
						epsilonTransitionsRecord[stateKey] = targetStates;
					} else {
						epsilonTransitionsRecord[stateKey].push(...targetStates);
					}
				});
			}
		}
	}

	const isValidRegex = validateRegex(regexString);
	if (isValidRegex) {
		const regexWithConcatenationOperator = addConcatOperatorToRegex(regexString);
		const postfixRegexString = convertInfixRegexToPostfix(regexWithConcatenationOperator);
		const [regexTree] = generateRegexTree(postfixRegexString);
		recursive(regexTree);
	} else {
		throw new Error(`Invalid regex`);
	}

	const totalStates = stateBoundaries[stateBoundaries.length - 1][1] - stateBoundaries[0][0] + 1;
	const startState = stateBoundaries[0][0];

	return {
		alphabets,
		final_states: [stateBoundaries[stateBoundaries.length - 1][1]],
		label: 'NFA',
		start_state: startState,
		states: new Array(totalStates).fill(null).map((_, i) => (i + startState).toString()),
		transitions: transitionsRecord as any,
		epsilon_transitions: epsilonTransitionsRecord,
	};
}
