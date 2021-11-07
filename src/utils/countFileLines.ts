import fs from 'fs';

export default function countFileLines(filePath: string): Promise<number> {
	return new Promise((resolve, reject) => {
		let lineCount = 0;
		fs.createReadStream(filePath)
			.on('data', (buffer) => {
				let idx = -1;
				lineCount--;
				do {
					idx = buffer.indexOf(10 as any, idx + 1);
					lineCount++;
				} while (idx !== -1);
			})
			.on('end', () => {
				resolve(lineCount);
			})
			.on('error', reject);
	});
}
