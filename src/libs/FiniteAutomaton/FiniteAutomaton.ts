/* eslint-disable no-param-reassign, no-console */
import shortid from 'shortid';
import {
	IAutomatonTestLogicFn,
	InputFiniteAutomaton,
	TFiniteAutomatonType,
	TransformedFiniteAutomaton,
} from '../../types';
import * as Utils from './utils';

export class FiniteAutomaton {
	testLogic: IAutomatonTestLogicFn;

	automaton: TransformedFiniteAutomaton;

	#automatonId: string;

	#automatonType: TFiniteAutomatonType;

	static Utils: typeof Utils = Utils;

	constructor(
		testLogic: IAutomatonTestLogicFn,
		finiteAutomaton: InputFiniteAutomaton | TransformedFiniteAutomaton,
		automatonType: TFiniteAutomatonType,
		automatonId?: string
	) {
		this.#automatonType = automatonType;
		this.#automatonId = automatonId ?? shortid();
		this.testLogic = testLogic;
		this.automaton = this.normalize(testLogic, finiteAutomaton);
	}

	normalize(
		testLogic: IAutomatonTestLogicFn,
		finiteAutomaton: InputFiniteAutomaton | TransformedFiniteAutomaton
	) {
		return Utils.normalize(testLogic, this.#automatonType, finiteAutomaton);
	}

	getAutomatonId() {
		return this.#automatonId;
	}

	generateGraphFromString(inputString: string) {
		return Utils.generateGraphFromString(this.automaton, inputString);
	}
}
