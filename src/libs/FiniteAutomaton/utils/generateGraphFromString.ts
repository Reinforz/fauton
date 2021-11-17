import { GraphNode, TransformedFiniteAutomaton } from '../../../types';

export function generateGraphFromString(
	automaton: Pick<TransformedFiniteAutomaton, 'start_state' | 'final_states' | 'transitions'>,
	inputString: string
) {
	let currentParents: GraphNode[] = [
		{
			name: `${automaton.start_state}`,
			state: automaton.start_state,
			string: '',
			depth: 0,
			symbol: null,
			children: [],
		},
	];
	let automatonTestResult = false;
	const finalStates = new Set(automaton.final_states);

	const graph = currentParents;
	for (let index = 0; index < inputString.length; index += 1) {
		const newParents: GraphNode[] = [];
		const symbol = inputString[index];
		currentParents.forEach((currentParent) => {
			const transitionStateRecord = automaton.transitions[currentParent.state];
			if (transitionStateRecord) {
				const transitionTargetStates = transitionStateRecord[symbol];
				// Guarding against null values
				if (Array.isArray(transitionTargetStates)) {
					transitionTargetStates.forEach((transitionTargetState) => {
						const parentGraphNode = {
							name: `${transitionTargetState}(${symbol})`,
							state: transitionTargetState,
							string: inputString.slice(0, index + 1),
							depth: index + 1,
							symbol,
							children: [],
						};
						currentParent.children.push(parentGraphNode);
						newParents.push(parentGraphNode);
					});
				}
			}
		});
		// for the Last symbol
		if (index === inputString.length - 1) {
			// Looping through each of the new parent nodes
			// to see if any of their state matches the final state
			for (let newParentsIndex = 0; newParentsIndex < newParents.length; newParentsIndex += 1) {
				const newChild = newParents[newParentsIndex];
				if (finalStates.has(newChild.state)) {
					automatonTestResult = true;
					break;
				}
			}
		}
		currentParents = newParents;
	}
	return {
		automatonTestResult,
		finalNodes: currentParents,
		graph: graph[0],
	};
}
