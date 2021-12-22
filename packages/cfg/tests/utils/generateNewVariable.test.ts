import { generateNewVariable } from '../../libs/utils/generateNewVariable';

it(`Should generate new variable`, () => {
	const newVariable = generateNewVariable(['1']);
	expect(newVariable.match(/[A-Z][0-9]/)).toBeTruthy();
});

it(`Should generate different variable if it exists in variables array`, () => {
	// Simulating a variable that is already present
	jest
		.spyOn(Math, 'random')
		.mockReturnValueOnce(0)
		.mockReturnValueOnce(0)
		.mockReturnValueOnce(0.05)
		.mockReturnValueOnce(0.1);
	const newVariable = generateNewVariable(['A0']);
	expect(newVariable).toBe('B1');
	jest.restoreAllMocks();
});
