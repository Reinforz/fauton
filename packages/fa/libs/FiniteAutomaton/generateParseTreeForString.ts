import { GraphNode, TransformedFiniteAutomaton } from '../types';

/**
 * Generate parse tree for a given automaton and input string
 * @param automaton Automaton to generate parse tree from
 * @param inputString Input string to parse
 * @returns A parse tree, verdict on whether the string is accepted and the leaf nodes
 */
export function generateParseTreeForString(
	automaton: Pick<TransformedFiniteAutomaton, 'start_state' | 'final_states' | 'transitions'>,
	// TODO: This should be an array of tokens
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
	let verdict = false;
	const finalStates = new Set(automaton.final_states);

	const tree = currentParents;
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
					verdict = true;
					break;
				}
			}
		}
		currentParents = newParents;
	}
	return {
		verdict,
		leafNodes: currentParents,
		tree: tree[0],
	};
}
