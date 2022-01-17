<div align="center"> <h1>Fauton</h1> </div>
<div align="center"><b>An ecosystem of packages to work with automaton (dfa/nfa/e-nfa/regex/cfg/pda)</b></div>

<p align="center">
  <a href="https://github.com/Devorein/fauton/actions?query=workflow%3A%22Lint%2C+Build+and+Test%22"><img src="https://github.com/devorein/fauton/workflows/Lint,%20Build%20and%20Test/badge.svg"/></a>
  <a href="https://app.codecov.io/gh/Devorein/fauton/branch/master"><img src="https://img.shields.io/codecov/c/github/devorein/fauton?color=blue"/></a>
  <img src="https://img.shields.io/github/commit-activity/m/devorein/fauton?color=yellow" />
  <img src="https://img.shields.io/github/repo-size/devorein/fauton?style=flat-square&color=ocombo"/>
  <img src="https://img.shields.io/github/contributors/devorein/fauton?label=contributors&color=red"/>
  <img src="https://img.shields.io/github/issues/devorein/fauton"/>
</p>

- [Features](#features)
- [Packages](#packages)
- [Algorithm Sources](#algorithm-sources)
- [Credits](#credits)
- [Contributors](#contributors)

## Features

1. Full typescript support
2. Easy to use api
3. High test coverage
4. Supports both node and browser environment (except a few)

## Packages

- **`@fauton/cfg`** [Github](https://github.com/Devorein/fauton/tree/main/packages/cfg) [NPM](https://www.npmjs.com/package/@fauton/cfg): A package to work with cfg
- **`@fauton/fa`** [Github](https://github.com/Devorein/fauton/tree/main/packages/fa) [NPM](https://www.npmjs.com/package/@fauton/fa): A package to work with finite automata
- **`@fauton/regex`** [Github](https://github.com/Devorein/fauton/tree/main/packages/regex) : A package to work with regex validation and parsing
- **`@fauton/testing`** [Github](https://github.com/Devorein/fauton/tree/main/packages/testing) : A package to test your automaton (regex/dfa/nfa/e-nfa/cfg)
- **`@fauton/language`** [Github](https://github.com/Devorein/fauton/tree/main/packages/language) : A package to generate language from a given set of tokens

## Algorithm Sources

Wikipedia sources for all the algorithms used in the package

1. [Thompson-McNaughton-Yamada](https://en.wikipedia.org/wiki/Thompson%27s_construction) algorithm for converting regex to e-nfa
2. [Hopcroft](https://en.wikipedia.org/wiki/DFA_minimization#Hopcroft's_algorithm) algorithm for dfa-minimization
3. [Rabin–Scott powerset construction](https://en.wikipedia.org/wiki/Powerset_construction) algorithm to convert nfa to dfa
4. [Shunting-Yard](https://en.wikipedia.org/wiki/Shunting-yard_algorithm) algorithm to convert regex string from infix to postfix
5. [Chomsky Normal Form](https://en.wikipedia.org/wiki/Chomsky_normal_form) Algorithm to make parsing a string easier
6. [Cocke–Younger–Kasami](https://en.wikipedia.org/wiki/CYK_algorithm) Parsing algorithm using a CFG
7. [Earley Parser](https://en.wikipedia.org/wiki/Earley_parser) algorithm for parsing strings that belong to a given context-free language

## Credits

Big thanks to all these wonderful repos.

1. [Orban](https://github.com/wevial/orban) Regular expression engine that uses the Thompson-McNaughton-Yamada algorithm implemented in Python.
2. [CFGChecker](https://github.com/mattany/CFGChecker) A program that cross references a context free grammar with a given language.
3. [CFG Epsilon Removal](https://eli.thegreenplace.net/2010/02/08/removing-epsilon-productions-from-context-free-grammars) A detailed article on how to remove epsilon from CFG
4. [python-formal-langs-practicum-automata-cfg](https://github.com/persiyanov/python-formal-langs-practicum-automata-cfg) Automata, Context-free-grammar classes (implementation of CYK algorithm, converting grammar to Chomsky normal form, Thompson algo for building automaton from regex, etc.)
5. [earley-parser-js](https://github.com/lagodiuk/earley-parser-js) Tiny JavaScript implementation of context-free languages parser - Earley parser (including generation of the parsing-forest).
6. [probabilistic-earley-parser-javascript](https://github.com/digitalheir/probabilistic-earley-parser-javascript) An efficient implementation of a probabilistic Context Free Grammar parser in Javascript

## Contributors

1.  Safwan Shaheer [github](https://github.com/Devorein) Author, Maintainer

Feel free to submit a pull request or open a new issue, contributions are more than welcome.
