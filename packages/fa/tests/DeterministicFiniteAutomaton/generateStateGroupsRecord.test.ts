import { generateStateGroupsRecord } from '../../libs/DeterministicFiniteAutomaton/generateStateGroupsRecord';

describe('generateStateGroupsRecord', () => {
	it(`Generate state groups record`, () => {
		const stateGroupRecords = generateStateGroupsRecord(
			['A', 'B,C', 'E', 'D'],
			[['A'], ['B,C', 'E'], ['D']]
		);
		expect(stateGroupRecords).toStrictEqual({
			A: 0,
			'B,C': 1,
			D: 2,
			E: 1,
		});
	});
});
