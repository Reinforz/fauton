import colors from 'colors';

export function validate(automatonLabel: string, automatonValidationErrors: string[]) {
	if (automatonValidationErrors.length !== 0) {
		console.log(
			`${colors.blue.bold(automatonLabel)} ${colors.red.bold(
				automatonValidationErrors.length.toString()
			)} Errors`
		);
		automatonValidationErrors.forEach((automatonValidationError) =>
			console.log(colors.red.bold(automatonValidationError))
		);
		console.log();
		throw new Error(`Error validating automaton`);
	}
}
