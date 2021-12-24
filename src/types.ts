/* eslint-disable no-use-before-define */

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
				minLength: number;
				maxLength: number;
			};
			combo?: undefined | null;
			outputFiles?: Partial<IOutputFiles>;
	  }
	| {
			type: 'generate';
			combo: {
				maxLength: number;
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
			inputs: string[];
			outputFiles?: Partial<IOutputFiles>;
	  };
