import fs from 'fs';
import path from 'path';
import { IOutputFiles } from '../../../types';

type IWriteStreams = Record<`${keyof IOutputFiles}WriteStream`, null | fs.WriteStream>;

export function createFileWriteStreams(
	logsPath: string,
	automatonLabel: string,
	outputFiles?: Partial<IOutputFiles>
) {
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
		endStreams() {
			Object.values(writeStreamsRecord).forEach((writeStream) => {
				if (writeStream) {
					writeStream.end();
				}
			});
		},
	};
}
