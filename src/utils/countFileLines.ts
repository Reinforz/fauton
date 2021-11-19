import fs from 'fs';

export function countFileLines(filePath: string): Promise<number> {
	return new Promise((resolve, reject) => {
		let lineCount = 0;
		fs.createReadStream(filePath)
			.on('data', (buffer) => {
				for (let i = 0; i < buffer.length; i += 1) if (buffer[i] === 10) lineCount += 1;
			})
			.on('end', () => {
				resolve(lineCount);
			})
			.on('error', reject);
	});
}
