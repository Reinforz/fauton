export function validate(automatonLabel: string, automatonValidationErrors: string[]) {
	if (automatonValidationErrors.length !== 0) {
		console.log(`${automatonLabel} ${automatonValidationErrors.length.toString()} Errors`);
		automatonValidationErrors.forEach((automatonValidationError) =>
			console.log(`${automatonValidationError}\n`)
		);
		throw new Error(`Error validating automaton`);
	}
}
