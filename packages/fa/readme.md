# `@fauton/fa`

A package to work with finite automata

- [`@fauton/fa`](#fautonfa)
- [Features](#features)
- [Examples](#examples)
  - [Dfa for string that starts with bc](#dfa-for-string-that-starts-with-bc)
  - [Binary string divisible by 2 or 3 but not both](#binary-string-divisible-by-2-or-3-but-not-both)
  - [Nfa for string that starts with `ab`](#nfa-for-string-that-starts-with-ab)
  - [ε-nfa to nfa](#ε-nfa-to-nfa)
  - [Generate full graph for a ε-nfa given a string](#generate-full-graph-for-a-ε-nfa-given-a-string)
  - [Conversion from ε-nfa to dfa](#conversion-from-ε-nfa-to-dfa)
  - [Conversion from nfa to dfa](#conversion-from-nfa-to-dfa)
  - [Dfa minimization](#dfa-minimization)
  - [Dfa equivalency by testing](#dfa-equivalency-by-testing)

# Features

1. Supports arbitrary alphabets
2. ε-nfa to nfa conversion
3. ε-nfa/nfa to dfa conversion
4. Simple concise error messages for invalid finite automaton
5. Generate ε closure of a single state
6. Check if a string is part of finite automaton

# Examples

## Dfa for string that starts with bc

Lets start out with a simple dfa, that checks whether an input string starts with `bc`. The alphabets of the dfa are `a, b, c`

![A dfa that checks if a input string starts with bc](../../public/starts_with_bc_dfa.png 'Dfa that starts with BC')

```js
// import the class from the library
const { DeterministicFiniteAutomaton } = require('@fauton/fa');
const startsWithBC = new DeterministicFiniteAutomaton(
	// Callback that will be passed each of the input string to test whether its should be accepted by the dfa or not
	(inputString) => inputString.startsWith('bc'),
	{
		// Required: The alphabets dfa accepts
		alphabets: ['a', 'b', 'c'],
		// Optional: A description of what the dfa does
		description: 'Starts with bc',
		// Required: An array of final states of the dfa
		final_states: ['Q3'],
		// Required: Label of the dfa. Convention is to use snake_case words
		label: 'starts_with_bc',
		// Required: Start state of the dfa
		start_state: 'Q0',
		// Required: An array of states the dfa accepts
		states: ['Q0', 'Q1', 'Q2', 'Q3'],
		// Required: A object of transition
		// Each key represents the state
		// The value is an array of strings, which should be equal to the length of the alphabets
		// Here if we are in state 'Q1' and we encounter symbol 'a', we move to the state 'Q2'
		transitions: {
			Q0: ['Q2', 'Q1', 'Q2'],
			Q1: ['Q2', 'Q2', 'Q3'],
			// this 'loop' is the same as ['Q2', 'Q2', 'Q2']
			// For automaton with bigger alphabets it might be difficult to write that out so its added as a convenience
			Q2: 'loop',
			Q3: 'loop',
		},
	}
);
```

## Binary string divisible by 2 or 3 but not both

In this case it will be better if we construct two dfa's and merge them together to form the final dfa.

Let `D2` be the dfa responsible for checking divisibility by 2 and `D3` be responsible for divisibility by 3

Our condition is `(D2 OR D3) AND NOT(D2 AND D3)`, meaning either the string passes through `D2` or `D3`, but not by both. So `2` will be accepted, `3` will be accepted but `6` will be rejected as its divisible by both `2` and `3`

![A dfa that checks if a binary string is divisible by 2 or 3 but not both](../../public/divisible_by_3_or_2_but_not_both.jpg 'A dfa that checks if a binary string is divisible by 2 or 3 but not both')

Lets generate a new dfa by combining the first two dfa's

```js
const { DeterministicFiniteAutomaton } = require('@fauton/fa');
const path = require('path');

const DivisibleBy3 = new DeterministicFiniteAutomaton(
	(inputString) => parseInt(inputString, 2) % 3 === 0,
	{
		alphabets: ['0', '1'],
		final_states: ['A'],
		label: 'divisible_by_3',
		start_state: 'A',
		states: ['A', 'B', 'C'],
		transitions: {
			A: ['A', 'B'],
			B: ['C', 'A'],
			C: ['B', 'C'],
		},
		description: 'Dfa to accept strings divisible by 3',
	}
);

const DivisibleBy2 = new DeterministicFiniteAutomaton(
	(inputString) => parseInt(inputString, 2) % 2 === 0,
	{
		alphabets: ['0', '1'],
		final_states: ['X'],
		label: 'divisible_by_2',
		start_state: 'X',
		states: ['X', 'Y'],
		transitions: {
			X: ['X', 'Y'],
			Y: ['X', 'Y'],
		},
		description: 'Dfa to accept strings divisible by 2',
	}
);

const DivisibleBy2Or3 = DivisibleBy2.OR(DivisibleBy3);
const NotDivisibleBy2And3 = DivisibleBy2.AND(DivisibleBy3).NOT();

const DivisibleBy3Or2ButNotByBoth = DivisibleBy2Or3.AND(NotDivisibleBy2And3);

// Merged transitions
console.log(DivisibleBy3Or2ButNotByBoth.automaton.transitions);
// Merged start state
console.log(DivisibleBy3Or2ButNotByBoth.automaton.start_state);
// Merged final states
console.log(DivisibleBy3Or2ButNotByBoth.automaton.final_states);
```

```sh
> {
  'X.A': { '0': [ 'X.A' ], '1': [ 'Y.B' ] },
  'Y.A': { '0': [ 'X.A' ], '1': [ 'Y.B' ] },
  'X.B': { '0': [ 'X.C' ], '1': [ 'Y.A' ] },
  'Y.B': { '0': [ 'X.C' ], '1': [ 'Y.A' ] },
  'X.C': { '0': [ 'X.B' ], '1': [ 'Y.C' ] },
  'Y.C': { '0': [ 'X.B' ], '1': [ 'Y.C' ] }
}
> X.A
> [ 'Y.A', 'X.B', 'X.C' ]
```

It automatically generates the merged transitions, new start and final states

## Nfa for string that starts with `ab`

![nfa for string that starts with ab](../../public/nfa_starts_with_ab.png 'nfa for string that starts with ab')

```js
const { NonDeterministicFiniteAutomaton } = require('@fauton/fa');
const path = require('path');

const startsWithAB = new NonDeterministicFiniteAutomaton(
	(inputString) => inputString.startsWith('ab'),
	{
		alphabets: ['a', 'b', 'c'],
		description: 'Starts with ab',
		final_states: ['C'],
		label: 'starts_with_ab',
		start_state: 'A',
		states: ['A', 'B', 'C'],
		transitions: {
			A: ['B'],
			B: [null, 'C'],
			C: 'loop',
		},
	}
);
```

## ε-nfa to nfa

Lets say we have the following ε-nfa, and we want to convert it to nfa

![epsilon nfa to regular nfa](../../public/epsilon_to_nfa.png 'epsilon nfa to regular nfa')

```js
const { NonDeterministicFiniteAutomaton } = require('@fauton/fa');

const randomEpsilonNFA = new NonDeterministicFiniteAutomaton(
	(inputString) => inputString.startsWith('ab'),
	{
		alphabets: ['a', 'b', 'c'],
		description: 'Starts with ab',
		final_states: ['C'],
		label: 'random_epsilon_nfa',
		start_state: 'A',
		states: ['A', 'B', 'C'],
		transitions: {
			A: ['B', null, 'B'],
			B: [null, 'C'],
			C: [null, null, 'C'],
		},
		epsilon_transitions: {
			A: ['B'],
		},
	}
);

// Epsilon-nfa is automatically converted to regular nfa
console.log(randomEpsilonNFA.automaton.transitions);
```

```sh
{
  A: { a: [ 'B', 'C' ], c: [ 'B', 'C' ], b: [ 'C' ] },
  B: { b: [ 'C' ], a: [], c: [ 'C' ] },
  C: { c: [ 'C' ] }
}
```

## Generate full graph for a ε-nfa given a string

```js
const { NonDeterministicFiniteAutomaton } = require('@fauton/fa');

const randomEpsilonNFA = new NonDeterministicFiniteAutomaton(
	(inputString) => inputString.startsWith('ab'),
	{
		alphabets: ['a', 'b', 'c'],
		description: 'Starts with ab',
		final_states: ['C'],
		label: 'random_epsilon_nfa',
		start_state: 'A',
		states: ['A', 'B', 'C'],
		transitions: {
			A: ['B', 'C', 'B'],
			B: ['A', 'C'],
			C: ['A', null, 'C'],
		},
		epsilon_transitions: {
			A: ['B'],
			B: ['C'],
		},
	}
);

const { graph } = randomEpsilonNFA.generateGraphFromString('abbc');
```

```js
{
  "name": "A",
  "state": "A",
  "string": "",
  "depth": 0,
  "symbol": null,
  "children": [
    {
      "name": "B(a)",
      "state": "B",
      "string": "a",
      "depth": 1,
      "symbol": "a",
      "children": [
        {
          "name": "C(b)",
          "state": "C",
          "string": "ab",
          "depth": 2,
          "symbol": "b",
          "children": []
        }
      ]
    },
    {
      "name": "C(a)",
      "state": "C",
      "string": "a",
      "depth": 1,
      "symbol": "a",
      "children": []
    },
    {
      "name": "A(a)",
      "state": "A",
      "string": "a",
      "depth": 1,
      "symbol": "a",
      "children": [
        {
          "name": "C(b)",
          "state": "C",
          "string": "ab",
          "depth": 2,
          "symbol": "b",
          "children": []
        }
      ]
    }
  ]
}
```

## Conversion from ε-nfa to dfa

```js
const { NonDeterministicFiniteAutomaton } = require('@fauton/fa');

const epsilonNfa = new NonDeterministicFiniteAutomaton((_, automatonTest) => automatonTest, {
	start_state: 0,
	alphabets: ['a', 'b'],
	final_states: [10],
	label: 'sample ε nfa',
	states: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	transitions: {
		2: [3],
		4: [null, 5],
		7: [8],
		8: [null, 9],
		9: [null, 10],
	},
	epsilon_transitions: {
		0: [1, 7],
		1: [2, 4],
		3: [6],
		5: [6],
		6: [1, 7],
	},
});

console.log(JSON.stringify(epsilonNfa.convertToDeterministicFiniteAutomaton(), null, 2));
```

```json
{
	"automaton": {
		"alphabets": ["a", "b"],
		"final_states": ["0,1,10,2,4,5,6,7"],
		"label": "sample ε nfa",
		"start_state": "0,1,2,4,7",
		"states": ["0,1,2,4,7", "1,2,3,4,6,7,8", "1,2,4,5,6,7", "1,2,4,5,6,7,9", "0,1,10,2,4,5,6,7"],
		"transitions": {
			"0,1,2,4,7": {
				"a": ["1,2,3,4,6,7,8"],
				"b": ["1,2,4,5,6,7"]
			},
			"1,2,3,4,6,7,8": {
				"a": ["1,2,3,4,6,7,8"],
				"b": ["1,2,4,5,6,7,9"]
			},
			"1,2,4,5,6,7": {
				"a": ["1,2,3,4,6,7,8"],
				"b": ["1,2,4,5,6,7"]
			},
			"1,2,4,5,6,7,9": {
				"a": ["1,2,3,4,6,7,8"],
				"b": ["0,1,10,2,4,5,6,7"]
			},
			"0,1,10,2,4,5,6,7": {
				"a": ["1,2,3,4,6,7,8"],
				"b": ["1,2,4,5,6,7"]
			}
		},
		"epsilon_transitions": null
	}
}
```

## Conversion from nfa to dfa

```js
const { NonDeterministicFiniteAutomaton } = require('@fauton/fa');

const nfa = new NonDeterministicFiniteAutomaton((_, automatonTest) => automatonTest, {
	start_state: 'q0',
	alphabets: ['a', 'b'],
	final_states: ['q1'],
	label: 'sample nfa',
	states: ['q0', 'q1', 'q2'],
	transitions: {
		q0: [['q2', 'q1']],
		q2: [['q2', 'q1'], 'q2'],
	},
});

console.log(JSON.stringify(nfa.convertToDeterministicFiniteAutomaton(), null, 2));
```

```json
{
	"automaton": {
		"alphabets": ["a", "b"],
		"final_states": ["q1,q2"],
		"label": "sample nfa",
		"start_state": "q0",
		"states": ["q0", "q1,q2", "Ø", "q2"],
		"transitions": {
			"q0": {
				"a": ["q1,q2"],
				"b": ["Ø"]
			},
			"q1,q2": {
				"a": ["q1,q2"],
				"b": ["q2"]
			},
			"q2": {
				"a": ["q1,q2"],
				"b": ["q2"]
			},
			"Ø": {
				"a": ["Ø"],
				"b": ["Ø"]
			}
		},
		"epsilon_transitions": null
	}
}
```

## Dfa minimization

```js
const { DeterministicFiniteAutomaton } = require('@fauton/fa');

const dfa = new DeterministicFiniteAutomaton(() => true, {
	states: [0, 1, 2, 3, 4, 5, 6, 7],
	alphabets: ['0', '1'],
	final_states: [2],
	start_state: 0,
	label: 'dfa',
	transitions: {
		0: [1, 5],
		1: [6, 2],
		2: [0, 2],
		3: [2, 6],
		4: [7, 5],
		5: [2, 6],
		6: [6, 4],
		7: [6, 2],
	},
});

console.log(dfa.minimize().automaton);
```

```json
{
	"label": "dfa",
	"alphabets": ["0", "1"],
	"final_states": ["2"],
	"start_state": "04",
	"states": ["04", "35", "17", "6", "2"],
	"transitions": {
		"2": {
			"0": ["04"],
			"1": ["2"]
		},
		"6": {
			"0": ["6"],
			"1": ["04"]
		},
		"17": {
			"0": ["6"],
			"1": ["2"]
		},
		"35": {
			"0": ["2"],
			"1": ["6"]
		},
		"04": {
			"0": ["17"],
			"1": ["35"]
		}
	},
	"epsilon_transitions": null
}
```

## Dfa equivalency by testing

Testing if two dfa are equal through testing. One of the dfa is the minimized version of the other dfa, all the input string should return similar test result for both of them.

```js
import { DeterministicFiniteAutomaton, FiniteAutomatonUtils } from '@fauton/fa';
import { FiniteAutomataTest } from '@fauton/testing';
import path from 'path';

const dfa = new DeterministicFiniteAutomaton(() => true, {
	states: [0, 1, 2, 3, 4, 5, 6, 7],
	alphabets: ['0', '1'],
	final_states: [2],
	start_state: 0,
	label: 'dfa',
	transitions: {
		0: [1, 5],
		1: [6, 2],
		2: [0, 2],
		3: [2, 6],
		4: [7, 5],
		5: [2, 6],
		6: [6, 4],
		7: [6, 2],
	},
});

const minimized_dfa = dfa.minimize();

minimized_dfa.testLogic = (inputString) => {
	return FiniteAutomatonUtils.generateGraphFromString(dfa.automaton, inputString)
		.automatonTestResult;
};

const finiteAutomataTest = new FiniteAutomataTest(path.join(__dirname, 'logs'));

finiteAutomataTest.test([
	{
		automaton: minimized_dfa,
		options: {
			type: 'generate',
			combo: {
				maxLength: 10,
			},
		},
	},
]);
```
