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
	const finalNodes: GraphNode[] = [];
	let automatonTestResult = false;
	const finalStates = new Set(automaton.final_states);

	const graph = currentParents;
	for (let index = 0; index < inputString.length; index += 1) {
		const newChildren: GraphNode[] = [];
		const symbol = inputString[index];
		currentParents.forEach((currentParent) => {
			const transitionStateRecord = automaton.transitions[currentParent.state];
			if (transitionStateRecord) {
				const transitionTargetStates = transitionStateRecord[symbol];
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
						newChildren.push(parentGraphNode);
					});
				}
			}
		});
		// Last symbol
		if (index === inputString.length - 1) {
			for (let newChildIndex = 0; newChildIndex < newChildren.length; newChildIndex += 1) {
				const newChild = newChildren[newChildIndex];
				if (finalStates.has(newChild.state)) {
					automatonTestResult = true;
					break;
				}
			}
			finalNodes.push(...newChildren);
		}
		currentParents = newChildren;
	}
	return {
		automatonTestResult,
		finalNodes,
		graph: graph[0],
	};
}
