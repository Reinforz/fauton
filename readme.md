<div align="center"> <h1>Fauton</h1> </div>
<div align="center"><b>A library to test and transform any finite automaton with arbitrary alphabets</b></div>

</br>

<p align="center">
  <a href="www.npmjs.com/package/fauton">
    <img src="https://img.shields.io/npm/dw/fauton"/>
  </a>
  <a href="https://github.com/Devorein/fauton/actions?query=workflow%3A%22Lint%2C+Build+and+Test%22"><img src="https://github.com/devorein/fauton/workflows/Lint,%20Build%20and%20Test/badge.svg"/></a>
  <a href="https://app.codecov.io/gh/Devorein/fauton"><img src="https://img.shields.io/codecov/c/github/devorein/fauton?color=blue"/></a>
  <img src="https://img.shields.io/github/commit-activity/m/devorein/fauton?color=yellow" />
  <img src="https://img.shields.io/github/repo-size/devorein/fauton?style=flat-square&color=ocombo"/>
  <img src="https://img.shields.io/github/contributors/devorein/fauton?label=contributors&color=red"/>
  <img src="https://img.shields.io/librariesio/release/npm/fauton"/>
  <img src="https://img.shields.io/github/issues/devorein/fauton"/>
</p>

- [Features](#features)
- [Motivation](#motivation)
- [Examples](#examples)
  - [Dfa for string that starts with bc](#dfa-for-string-that-starts-with-bc)
  - [Binary string divisible by 2 or 3 but not both](#binary-string-divisible-by-2-or-3-but-not-both)
  - [Nfa for string that starts with `ab`](#nfa-for-string-that-starts-with-ab)
  - [ε-nfa to nfa](#ε-nfa-to-nfa)
  - [Generate and render full graph for a ε-nfa given a string](#generate-and-render-full-graph-for-a-ε-nfa-given-a-string)
  - [Conversion from ε-nfa to dfa](#conversion-from-ε-nfa-to-dfa)
  - [Conversion from nfa to dfa](#conversion-from-nfa-to-dfa)
  - [Dfa minimization](#dfa-minimization)
  - [Dfa equivalency by testing](#dfa-equivalency-by-testing)
  - [Testing regular expressions](#testing-regular-expressions)
- [Conditions for DFA](#conditions-for-dfa)
- [Transitions Record Transformation](#transitions-record-transformation)
  - [dfa](#dfa)
  - [nfa](#nfa)
  - [ε-nfa](#ε-nfa)
- [Input string generation](#input-string-generation)
  - [Reading from a file](#reading-from-a-file)
  - [Custom array of strings](#custom-array-of-strings)
  - [Generating random strings](#generating-random-strings)
  - [Generating all combinations of certain length](#generating-all-combinations-of-certain-length)
- [Generated artifact files](#generated-artifact-files)
  - [Sample artifact files](#sample-artifact-files)
  - [`<fa.label>.accepted.txt`](#falabelacceptedtxt)
  - [`<fa.label>.aggregate.txt`](#falabelaggregatetxt)
  - [`<fa.label>.case.txt`](#falabelcasetxt)
  - [`<fa.label>.correct.txt`](#falabelcorrecttxt)
  - [`<fa.label>.incorrect.txt`](#falabelincorrecttxt)
  - [`<fa.label>.input.txt`](#falabelinputtxt)
  - [`<fa.label>.rejected.txt`](#falabelrejectedtxt)
- [Terminal Output](#terminal-output)
  - [Sample terminal output](#sample-terminal-output)
  - [Incorrect Portion](#incorrect-portion)
  - [Correct Portion](#correct-portion)
- [Contributors](#contributors)
- [Algorithm Sources](#algorithm-sources)
- [Credits](#credits)

**Please note that I won't be following semver at the initial stages, as there could be a lot of (breaking) changes between each release which will all be patch**

# Features

1. Test any valid dfa/nfa/ε-nfa/regex
2. Supports arbitrary alphabets
3. Easy to use api to generate input strings
4. ε-nfa to nfa conversion
5. ε-nfa/nfa to dfa conversion
6. Generate artifacts files for each automaton
7. Highly customizable
8. Full typescript support
9. Simple concise error messages for invalid finite automaton
10. Generate full graph for ε-nfa given a string
11. Generate ε closure of a single state

# Motivation

Its easy to check whether a string should be accepted or rejected using our favourite programming languages, but its a lot harder to transfer the logic to a finite automaton. Even if we are quite sure we can't be 100% sure until and unless we try out all the possible combinations of alphabet of the automata. This is an extremely tedious and error-prone process. Why not automate testing an automaton?

# Examples

## Dfa for string that starts with bc

Lets start out with a simple dfa, that checks whether an input string starts with `bc`. The alphabets of the dfa are `a, b, c`

![A dfa that checks if a input string starts with bc](./public/starts_with_bc_dfa.png 'Dfa that starts with BC')

```js
// import the class from the library
const { DeterministicFiniteAutomaton, FiniteAutomataTest } = require('fauton');
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

// The constructor takes only one argument, the directory where the all the artifact files will be generated, if its not present, it will be created
const finiteAutomataTest = new FiniteAutomataTest(path.join(__dirname, 'logs'));

// Call the test method to test out the automaton
// We will learn more about the array thats being passed later
finiteAutomataTest.test([
	{
		// The automaton to test
		automaton: startsWithBC,
		// A configuration object that is used to feed input strings to the automaton
		options: {
			type: 'generate',
			combo: {
				maxLength: 10,
			},
		},
	},
]);
```

## Binary string divisible by 2 or 3 but not both

In this case it will be better if we construct two dfa's and merge them together to form the final dfa.

Let `D2` be the dfa responsible for checking divisibility by 2 and `D3` be responsible for divisibility by 3

Our condition is `(D2 OR D3) AND NOT(D2 AND D3)`, meaning either the string passes through `D2` or `D3`, but not by both. So `2` will be accepted, `3` will be accepted but `6` will be rejected as its divisible by both `2` and `3`

![A dfa that checks if a binary string is divisible by 2 or 3 but not both](./public/divisible_by_3_or_2_but_not_both.jpg 'A dfa that checks if a binary string is divisible by 2 or 3 but not both')

Lets generate a new dfa by combining the first two dfa's !!!

```js
const { FiniteAutomataTest, DeterministicFiniteAutomaton } = require('fauton');
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

const finiteAutomataTest = new FiniteAutomataTest(path.resolve(__dirname, 'logs'));
finiteAutomataTest.test([
	{
		automaton: DivisibleBy3Or2ButNotByBoth,
		options: {
			type: 'generate',
			combo: {
				maxLength: 10,
			},
		},
	},
]);

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

![nfa for string that starts with ab](./public/nfa_starts_with_ab.png 'nfa for string that starts with ab')

```js
const { NonDeterministicFiniteAutomaton, FiniteAutomataTest } = require('fauton');
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

const finiteAutomataTest = new FiniteAutomataTest(path.join(__dirname, 'logs'));
finiteAutomataTest.test([
	{
		automaton: startsWithAB,
		options: {
			type: 'generate',
			combo: {
				maxLength: 10,
			},
		},
	},
]);
```

## ε-nfa to nfa

Lets say we have the following ε-nfa, and we want to convert it to nfa

![epsilon nfa to regular nfa](./public/epsilon_to_nfa.png 'epsilon nfa to regular nfa')

```js
const { NonDeterministicFiniteAutomaton } = require('fauton');
const path = require('path');

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

## Generate and render full graph for a ε-nfa given a string

```js
const { NonDeterministicFiniteAutomaton, Render } = require('fauton');
const path = require('path');

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
console.log(JSON.stringify(graph, null, 2));
Render.graphToHtml(graph, path.join(__dirname, 'index.html'));
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

Generated d3 graph

<img src="https://raw.githubusercontent.com/Devorein/fauton/main/public/generated_graph.png" width="250"/>

## Conversion from ε-nfa to dfa

```js
const { NonDeterministicFiniteAutomaton } = require('fauton');

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
const { NonDeterministicFiniteAutomaton } = require('fauton');

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
const { DeterministicFiniteAutomaton } = require('fauton');

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
import { DeterministicFiniteAutomaton, FiniteAutomataTest, FiniteAutomatonUtils } from 'fauton';
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

## Testing regular expressions

Rather than testing only a finite automaton, you can also test your regular expressions against generated strings

```js
import { FiniteAutomataTest, RegularExpression } from 'fauton';
import path from 'path';

const regex = new RegularExpression(
	(inputString) => {
		return (
			inputString[0] === 'a' &&
			inputString[1] === 'b' &&
			inputString
				.slice(2)
				.split('')
				.every((char) => char === 'c')
		);
	},
	{
		alphabets: ['a', 'b', 'c'],
		label: 'Starts with a and b, ends with any number of c',
		regex: /^abc*$/g,
	}
);

const finiteAutomataTest = new FiniteAutomataTest(path.join(__dirname, 'logs'));

finiteAutomataTest.test([
	{
		automaton: regex,
		options: {
			type: 'generate',
			combo: {
				maxLength: 10,
			},
		},
	},
]);
```

Take a look at [examples](./examples) folder for more examples.

# Conditions for DFA

Deterministic finite automaton must follow certain conditions for it to be considered as one. These are described below

1. `transitions` record must contain all the elements of `states` array as its key
2. Only the items of the `states` can be the key of the `transitions` record
3. `transitions` record values must either be an array or the string literal `loop`
4. If its an array its length should be the same `alphabets` array, where each index represents which state to transition to when encountering a symbol (index of the `alphabets` array)
5. Also if its an array each item should be a string as for a single symbol a dfa can transition to only one state
6. `transitions` record values can only have `symbols` that are present in the `alphabets` array

# Transitions Record Transformation

## dfa

All the states of the dfa must have transitions for all the input symbols.

```json
{
	"final_states": ["A", "B", "C"],
	"alphabets": ["0", "1", "2"],
	"transitions": {
		"A": ["B", "C", "A"],
		"B": ["C", "A", "C"],
		"C": "loop"
	}
}
```

For the above automaton, the `transitions` record will be transformed like the following:-

```js
{
	"A": {
		"0": "B",
		"1": "C",
		"2": "A",
	},
	"B": {
		"0": "C",
		"1": "A",
		"2": "C",
	},
	"C": {
		"0": "C",
		"1": "C",
		"2": "C",
	},
};
```

## nfa

```json
{
	"alphabets": ["a", "b", "c"],
	"states": ["A", "B", "C"],
	"transitions": {
		"A": ["B", null, "B"],
		"B": [null, "C"],
		"C": [null, null, "C"]
	}
}
```

Since its a nfa the conditions of `transitions` record for dfa is not applicable here

```js
{
  "A": {
    "a": ["B"],
    "c": ["B"]
  },
  "B": {
    "b": ["C"]
  },
  "C": {
    "c": ["C"]
  }
}
```

## ε-nfa

```json
{
	"alphabets": ["a", "b", "c"],
	"states": ["A", "B", "C"],
	"transitions": {
		"A": ["B", null, "B"],
		"B": [null, "C"],
		"C": [null, null, "C"]
	},
	"epsilon_transitions": {
		"A": ["B"]
	}
}
```

Transformed transitions record

```js
{
  A: { a: [ 'B', 'C' ], c: [ 'B', 'C' ], b: [ 'C' ] },
  B: { b: [ 'C' ], a: [], c: [ 'C' ] },
  C: { c: [ 'C' ] }
}
```

# Input string generation

When testing the finite automaton using the `FiniteAutomataTest` class object's `test` method there are four ways to provide input strings to the automaton and the logic test callback

## Reading from a file

If you already have a file that contains a bunch of input strings made of valid symbols of the automata you can load that file and feed each strings (delimited by a newline) to the automata and logic test.

```js
finiteAutomataTest.test([
	{
		automaton,
		options: {
			type: 'file',
			// Path to the input file
			filePath: path.join(__dirname, 'input.txt'),
		},
	},
]);
```

## Custom array of strings

You can provide your own custom array of strings to feed to the automaton and logic test callback.

```js
finiteAutomataTest.test([
	{
		automaton,
		options: {
			type: 'custom',
			inputs: ['101', '110', '00101'],
		},
	},
]);
```

## Generating random strings

You can feed automaton and logic test callback a set of unique randomly generated strings from the alphabet of the automaton

```js
finiteAutomataTest.test([
	{
		automaton,
		options: {
			type: 'generate',
			random: {
				// Maximum length of the random string
				maxLength: 4,
				// Minimum length of the random string
				minLength: 2,
				// Total unique random strings
				total: 5,
			},
		},
	},
]);
```

## Generating all combinations of certain length

You can feed automata and logic test callback a set of unique randomly generated strings from the alphabet of the automata

```js
finiteAutomataTest.test([
	{
		automaton,
		options: {
			type: 'generate',
			combo: {
				maxLength: 3,
			},
		},
	},
]);
```

If you alphabet is `a,b` then it will generate the following set of strings

```sh
a, b, aa, bb, ab, ba, aaa, aab, aba, abb, bbb, bba, bab, baa
```

# Generated artifact files

After running the test, artifact files will be generated in the folder specified in the `FiniteAutomataTest` class constructor. These files contain additional information about the test and starts with the label of the dfa.

## Sample artifact files

Sample artifact files shown inside `logs` directory

![Post dfa test file structure](./public/post_dfa_test.png)

## `<fa.label>.accepted.txt`

Contains all the strings that will be accepted by the automaton

![Sample accepted artifact file](./public/sample_accepted_artifact_file.png)

## `<fa.label>.aggregate.txt`

Contains an aggregated result of the test. Its similar to what is shown in the terminal. See [Terminal Output](#terminal-output)

![Sample aggregate artifact file](./public/sample_aggregate_artifact_file.png)

## `<fa.label>.case.txt`

Contains detailed results for each input string test case.

![Sample case artifact file](./public/sample_case_artifact_file.png)

- Result: `CORRECT` if `fa.result == logic.result`, `WRONG` otherwise
- String: Input string
- Logic: `logic.result`
- FA: `fa.result`

## `<fa.label>.correct.txt`

Contains all the strings that generated the same boolean result from the logic test callback and the automaton.

![Sample correct artifact file](./public/sample_correct_artifact_file.png)

- First column: `fa.result`
- Second column: `logic.result`
- Third column: Input string

## `<fa.label>.incorrect.txt`

Contains all the strings that generated different boolean result from the logic test callback and the automaton

Same as `<fa.label>.correct.txt`

## `<fa.label>.input.txt`

Contains all the input strings. Useful when you are generating random or combo strings and want to reuse it for later

Same as `<fa.label>.accepted.txt`

## `<fa.label>.rejected.txt`

Contains all the strings that have been rejected by the automaton

Same as `<fa.label>.accepted.txt`

# Terminal Output

While the test is proceeding the progress will be shown in the terminal, and once its done an aggregated result of the test will be shown as below.

## Sample terminal output

![Post dfa test terminal](./public/post_dfa_test_terminal.png 'A sample terminal output post dfa test')

- `fa.result`: Indicates the result from the finite automata
- `logic.result`: Indicates the result from the logic test

The progress bar shows the number of input strings that's been processed. Beneath that the label, description and the total number of input strings are shown

## Incorrect Portion

- `Incorrect`: Total number of strings where the automaton and logic test gave different result. Conditions:-
  - `fa.result = false && logic.result = true`
  - `fa.result = true && logic.result = false`
- `Incorrect(%)`: Percentage of strings that are incorrect out of all strings
- `False Positives`: Total number of strings that didn't pass the logic test but passed the automata test. Condition:-
  - `fa.result = true && logic.result = false`
- `False Positives(%)`: Total number of false positives out of all strings
- `False Negatives`: Total number of strings that passed the logic test but didn't pass the automata test. Condition:-
  - `fa.result = false && logic.result = true`
- `False Negatives(%)`: Total number of false negatives out of all strings

## Correct Portion

- `Correct`: Total number of strings where the automaton and logic test gave same result. Conditions:-
  - `fa.result = true && logic.result = true`
  - `fa.result = false && logic.result = false`
- `Correct(%)`: Percentage of strings that are correct out of all strings
- `True Positives`: Total number of strings that passed both the logic and automata test. Condition:-
  - `fa.result = true && logic.result = true`
- `True Positives(%)`: Total number of true positives out of all strings
- `True Negatives`: Total number of strings that didn't pass both the logic and automata test. Condition:-
  - `fa.result = false && logic.result = false`
- `True Negatives(%)`: Total number of true negatives out of all strings

Better and more detailed api documentation coming soon very soon !!!

# Contributors

1.  Safwan Shaheer [github](https://github.com/Devorein) Author, Maintainer

# Algorithm Sources

Wikipedia sources for all the algorithms used in the package

1. [Thompson-McNaughton-Yamada](https://en.wikipedia.org/wiki/Thompson%27s_construction) algorithm for converting regex to e-nfa
2. [Hopcroft](https://en.wikipedia.org/wiki/DFA_minimization#Hopcroft's_algorithm) algorithm for dfa-minimization
3. [Rabin–Scott powerset construction](https://en.wikipedia.org/wiki/Powerset_construction) algorithm to convert nfa to dfa
4. [Shunting-Yard](https://en.wikipedia.org/wiki/Shunting-yard_algorithm) algorithm to convert regex string from infix to postfix

# Credits

Big thanks to all these wonderful repos.

1. [Orban](https://github.com/wevial/orban) Regular expression engine that uses the Thompson-McNaughton-Yamada algorithm implemented in Python.

Feel free to submit a pull request or open a new issue, contributions are more than welcome !!!
