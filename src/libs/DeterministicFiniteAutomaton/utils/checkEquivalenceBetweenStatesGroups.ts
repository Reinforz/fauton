export function checkEquivalenceBetweenStatesGroups(statesGroups: [string[][], string[][]]) {
	const [statesGroupsOne, statesGroupsTwo] = statesGroups;
	if (statesGroupsOne.length !== statesGroupsTwo.length) return false;

	let isEquivalent = true;
	const stateGroupsSet: Set<string> = new Set();
	statesGroupsOne.forEach((statesGroup) => {
		stateGroupsSet.add(statesGroup.join(''));
	});
	for (let index = 0; index < statesGroupsTwo.length; index += 1) {
		const statesGroup = statesGroupsTwo[index];
		if (!stateGroupsSet.has(statesGroup.join(''))) {
			isEquivalent = false;
			break;
		}
	}

	return isEquivalent;
}
