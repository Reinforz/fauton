/* eslint-disable no-param-reassign, no-console */
import shortid from 'shortid';
import {
	IAutomatonTestLogicFn,
	InputFiniteAutomaton,
	SkipOptions,
	TFiniteAutomatonType,
	TransformedFiniteAutomaton,
} from '../types';
import { generateGraphFromString } from './generateGraphFromString';
import { generatePostNormalizationErrors } from './generatePostNormalizationErrors';
import { generatePreNormalizationErrors } from './generatePreNormalizationErrors';
import { normalize } from './normalize';
import { validate } from './validate';

export {
	generateGraphFromString,
	generatePostNormalizationErrors,
	generatePreNormalizationErrors,
	normalize,
	validate,
};
export class FiniteAutomaton {
	testLogic: IAutomatonTestLogicFn;

	automaton: TransformedFiniteAutomaton;

	#automatonId: string;

	#automatonType: TFiniteAutomatonType;

	constructor(
		testLogic: IAutomatonTestLogicFn,
		finiteAutomaton: InputFiniteAutomaton | TransformedFiniteAutomaton,
		automatonType: TFiniteAutomatonType,
		automatonId?: string,
		skipOptions?: Partial<SkipOptions>
	) {
		this.#automatonType = automatonType;
		this.#automatonId = automatonId ?? shortid();
		this.testLogic = testLogic;
		// Validate the automaton passed before normalizing it
		if (!skipOptions?.skipValidation) {
			validate(
				finiteAutomaton.label,
				generatePreNormalizationErrors(testLogic, this.#automatonType, finiteAutomaton)
			);
		}
		if (!skipOptions?.skipNormalization) {
			this.automaton = normalize(
				finiteAutomaton,
				skipOptions?.skipCharacterRangesExpansion ?? false
			);
		} else {
			this.automaton = finiteAutomaton as any;
		}

		if (!skipOptions?.skipValidation) {
			// Validate the automaton passed after normalizing it
			validate(
				finiteAutomaton.label,
				generatePostNormalizationErrors(this.automaton as TransformedFiniteAutomaton)
			);
		}
	}

	getAutomatonId() {
		return this.#automatonId;
	}

	generateGraphFromString(inputString: string) {
		return generateGraphFromString(this.automaton, inputString);
	}

	test(inputString: string) {
		return this.generateGraphFromString(inputString).automatonTestResult;
	}
}
