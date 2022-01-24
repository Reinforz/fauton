import fs from 'fs';
import path from 'path';
import { IOutputFiles } from '../types';

type IWriteStreams = Record<`${keyof IOutputFiles}WriteStream`, null | fs.WriteStream>;

/**
 * Create file write streams for logging various info regarding the automaton test
 * @param logsPath Path to the log directory
 * @param automatonLabel Label of the automaton
 * @param outputFiles A record that represents which files to generate
 * @returns A record of write streams and a function to end all streams
 */
export function createFileWriteStreams(
	logsPath: string,
	automatonLabel: string,
	outputFiles?: Partial<IOutputFiles>
) {
	// Create the write stream record
	// Each key would represent which sort of file it is and the value would be the write stream itself
	// Not all write stream need to be created, so only create those that are necessary
	const writeStreamsRecord: IWriteStreams = {
		caseWriteStream: outputFiles?.case
			? fs.createWriteStream(path.resolve(logsPath, `${automatonLabel}.case.txt`))
			: null,
		aggregateWriteStream: outputFiles?.aggregate
			? fs.createWriteStream(path.resolve(logsPath, `${automatonLabel}.aggregate.txt`))
			: null,
		incorrectWriteStream: outputFiles?.incorrect
			? fs.createWriteStream(path.resolve(logsPath, `${automatonLabel}.incorrect.txt`))
			: null,
		correctWriteStream: outputFiles?.correct
			? fs.createWriteStream(path.resolve(logsPath, `${automatonLabel}.correct.txt`))
			: null,
		inputWriteStream: outputFiles?.input
			? fs.createWriteStream(path.resolve(logsPath, `${automatonLabel}.input.txt`))
			: null,
		acceptedWriteStream: outputFiles?.accepted
			? fs.createWriteStream(path.resolve(logsPath, `${automatonLabel}.accepted.txt`))
			: null,
		rejectedWriteStream: outputFiles?.rejected
			? fs.createWriteStream(path.resolve(logsPath, `${automatonLabel}.rejected.txt`))
			: null,
	};
	return {
		record: writeStreamsRecord,
		// Loop through all the streams and end them
		endStreams() {
			Object.values(writeStreamsRecord).forEach((writeStream) => {
				// A write stream might not be defined
				if (writeStream) {
					writeStream.end();
				}
			});
		},
	};
}
