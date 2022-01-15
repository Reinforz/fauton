import path from 'path';
import { extractExamples, generateExamples } from 'typedoc-example-generator';

const packages = ['cfg'];

async function main() {
	for (let index = 0; index < packages.length; index++) {
		const packageName = packages[index];
		const modulesMarkdownFilePath = path.resolve(
			__dirname,
			`../../docs/fauton-${packageName}/modules.md`
		);
		const testFilesDirectory = path.resolve(__dirname, `../../packages/${packageName}`);
		const functionExamplesRecord = await extractExamples(testFilesDirectory);
		await generateExamples(
			modulesMarkdownFilePath,
			functionExamplesRecord,
			`@fauton/${packageName}`
		);
	}
}

main();
