# `@fauton/testing`

A package to test your automaton (regex/dfa/nfa/e-nfa/cfg)

- [`@fauton/testing`](#fautontesting)
- [Features](#features)

# Features

1. Test any valid dfa/nfa/ε-nfa/regex/cfg
2. Easy to use api to generate language
3. Generate artifacts files for each automaton
4. Detailed report of automaton testing

# Input string generation

## Reading from a file

If you already have a file that contains a bunch of input strings made of valid symbols of the automata you can load that file and feed each strings (delimited by a newline) to the automata and logic test.

```js
const path = require('path');
const { FiniteAutomataTest } = require('@fauton/testing');
const finiteAutomataTest = new FiniteAutomataTest(path.join(__dirname, 'logs'));

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
const path = require('path');
const { FiniteAutomataTest } = require('@fauton/testing');
const finiteAutomataTest = new FiniteAutomataTest(path.join(__dirname, 'logs'));

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
const path = require('path');
const { FiniteAutomataTest } = require('@fauton/testing');
const finiteAutomataTest = new FiniteAutomataTest(path.join(__dirname, 'logs'));

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

You can also feed your automaton and logic test callback all the combinations of the alphabet of certain length

```js
const path = require('path');
const { FiniteAutomataTest } = require('@fauton/testing');
const finiteAutomataTest = new FiniteAutomataTest(path.join(__dirname, 'logs'));

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

If your alphabet is `a,b` then it will generate the following set of strings

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
