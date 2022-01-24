/**
 * Generate a random number within a min and max limit
 * @param min Minimum limit
 * @param max Maximum limit
 * @returns generated random number
 */
export function generateRandomNumber(min: number, max: number) {
	return Math.floor(min + Math.random() * (max + 1 - min));
}
