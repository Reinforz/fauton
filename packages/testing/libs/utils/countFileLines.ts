import fs from 'fs';

/**
 * Count the number of lines of a given file
 * @param filePath Path of the file
 * @returns Total lines of a file
 */
export function countFileLines(filePath: string): Promise<number> {
	return new Promise((resolve, reject) => {
		let lineCount = 0;
		fs.createReadStream(filePath)
			// On receiving data
			.on('data', (buffer) => {
				// Loop through the buffer
				for (let i = 0; i < buffer.length; i += 1) {
					// And check if the buffer item is 10, which indicates a new line
					if (buffer[i] === 10) lineCount += 1;
				}
			})
			.on('end', () => {
				resolve(lineCount);
			})
			.on('error', reject);
	});
}
