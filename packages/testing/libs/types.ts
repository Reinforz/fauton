/* eslint-disable no-unused-vars */

export interface AutomatonTestInfo {
	falsePositives: number;
	falseNegatives: number;
	truePositives: number;
	trueNegatives: number;
}

export interface IOutputFiles {
	case: boolean;
	incorrect: boolean;
	correct: boolean;
	input: boolean;
	aggregate: boolean;
	accepted: boolean;
	rejected: boolean;
}

export type InputStringOption =
	| {
			type: 'generate';
			random?: {
				total: number;
				minTokenLength: number;
				maxTokenLength: number;
			};
			combo?: undefined | null;
			outputFiles?: Partial<IOutputFiles>;
	  }
	| {
			type: 'generate';
			combo: {
				maxTokenLength: number;
				startLength?: number;
			};
			random?: undefined | null;
			outputFiles?: Partial<IOutputFiles>;
	  }
	| {
			type: 'file';
			filePath: string;
			outputFiles?: Partial<IOutputFiles>;
	  }
	| {
			type: 'custom';
			inputs: string[][];
			outputFiles?: Partial<IOutputFiles>;
	  };

export type IAutomatonTestLogicFn = (
	inputTokens: string[],
	automatonTestResult: boolean
) => boolean;
export type IAutomatonTestFn = (inputTokens: string[]) => boolean;

export interface IAutomatonInfo {
	test: IAutomatonTestFn;
	testLogic: IAutomatonTestLogicFn;
	automaton: {
		label: string;
		alphabets: string[];
		description?: string;
	};
}
