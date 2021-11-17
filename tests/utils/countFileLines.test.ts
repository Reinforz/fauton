import fs from 'fs';
import path from 'path';
import { countFileLines } from '../../src/utils/countFileLines';

it(`Should count file lines`, () => {
	const filePath = path.join(__dirname, 'sample.txt');
	fs.writeFile(filePath, `Line 1\nLine 2\nLine 3\n`, async (err) => {
		expect(err).toBeFalsy();
		expect(await countFileLines(filePath)).toBe(3);
		fs.unlink(filePath, (err) => {
			expect(err).toBeFalsy();
		});
	});
});
