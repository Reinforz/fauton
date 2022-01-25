---
id: 'getting-started'
title: 'Getting Started'
slug: '/testing/getting-started'
sidebar_label: 'Getting Started'
sidebar_position: 0
custom_edit_url: null
---

- [Features](#features)
- [Generated artifact files](#generated-artifact-files)
  - [Sample artifact files](#sample-artifact-files)
  - [`<fa.label>.accepted.txt`](#falabelacceptedtxt)
  - [`<fa.label>.aggregate.txt`](#falabelaggregatetxt)
  - [`<fa.label>.case.txt`](#falabelcasetxt)
  - [`<fa.label>.correct.txt`](#falabelcorrecttxt)
  - [`<fa.label>.incorrect.txt`](#falabelincorrecttxt)
  - [`<fa.label>.input.txt`](#falabelinputtxt)
  - [`<fa.label>.rejected.txt`](#falabelrejectedtxt)
  - [Incorrect Portion](#incorrect-portion)
  - [Correct Portion](#correct-portion)

## Features

1. Test any valid dfa/nfa/ε-nfa/regex/cfg
2. Easy to use api to generate language
3. Generate artifacts files for each automaton
4. Detailed report of automaton testing

## Generated artifact files

After running the test, artifact files will be generated in the folder specified in the `FiniteAutomataTest` class constructor. These files contain additional information about the test and starts with the label of the dfa.

### Sample artifact files

Sample artifact files shown inside `logs` directory

### `<fa.label>.accepted.txt`

Contains all the strings that will be accepted by the automaton

### `<fa.label>.aggregate.txt`

Contains an aggregated result of the test. Its similar to what is shown in the terminal. See [Terminal Output](#terminal-output)

### `<fa.label>.case.txt`

Contains detailed results for each input string test case.

- Result: `CORRECT` if `fa.result == logic.result`, `WRONG` otherwise
- String: Input string
- Logic: `logic.result`
- FA: `fa.result`

### `<fa.label>.correct.txt`

Contains all the strings that generated the same boolean result from the logic test callback and the automaton.

- First column: `fa.result`
- Second column: `logic.result`
- Third column: Input string

### `<fa.label>.incorrect.txt`

Contains all the strings that generated different boolean result from the logic test callback and the automaton

Same as `<fa.label>.correct.txt`

### `<fa.label>.input.txt`

Contains all the input strings. Useful when you are generating random or combo strings and want to reuse it for later

Same as `<fa.label>.accepted.txt`

### `<fa.label>.rejected.txt`

Contains all the strings that have been rejected by the automaton

Same as `<fa.label>.accepted.txt`

### Incorrect Portion

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

### Correct Portion

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
