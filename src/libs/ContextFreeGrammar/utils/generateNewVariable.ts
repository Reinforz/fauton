/**
 * Generates a random integer between two intervals
 * @param min Left limit of generated int
 * @param max Right limit of generated int
 * @returns A random integer
 */
function randomIntFromInterval(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const CAPITAL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';

/**
 * Generates a new variable that is not part of the passed variables array
 * @param variables A set of variables which shouldn't be generated
 * @returns Generated variable string
 */
export function generateNewVariable(variables: string[]) {
	const variablesSet = new Set(variables);
	// Create a variable with first character to be any capital letter and 2nd letter to be digit
	let newVariable =
		CAPITAL_LETTERS[randomIntFromInterval(0, CAPITAL_LETTERS.length - 1)] +
		DIGITS[randomIntFromInterval(0, DIGITS.length - 1)];

	// While the new variable is present in our variables set we need to keep on creating it
	while (variablesSet.has(newVariable)) {
		// New variable will be a combination of capital letter and a digit
		newVariable =
			CAPITAL_LETTERS[randomIntFromInterval(0, CAPITAL_LETTERS.length - 1)] +
			DIGITS[randomIntFromInterval(0, DIGITS.length - 1)];
	}
	// Push the newly generated variable to the passed variables array
	variables.push(newVariable);
	return newVariable;
}
