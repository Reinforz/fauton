# `@fauton/cfg`

A package to work with cfg.

- [`@fauton/cfg`](#fautoncfg)
- [Features](#features)
- [Examples](#examples)
  - [Generate language of a CFG](#generate-language-of-a-cfg)
  - [Remove null production from CFG](#remove-null-production-from-cfg)
  - [Removing all unreachable production rules from CFG](#removing-all-unreachable-production-rules-from-cfg)

# Features

1. Validate a CFG
2. Removing null production rules for a CFG
3. Removing unit production rules for a CFG
4. Removing unreachable production rules for a CFG
5. Removing non terminable production rules for a CFG
6. Removing empty production rules for a CFG
7. Converting a cfg to cnf
8. Checking if a string is present in cfg (CYK)
9. Generate language of CFG (up-to specific length)

# Examples

## Generate language of a CFG

Lets try to generate all the possible strings of the language of a CFG up to a certain length

```js
import { GenerateString } from 'fauton';

const cfgLanguage = GenerateString.generateCfgLanguage(
	{
		startVariable: 'S',
		terminals: ['0', '1', '+', '-', '/', '*', '(', ')'],
		productionRules: {
			S: ['S', 'S E N', '( S )', 'N'],
			N: ['0', '1'],
			E: ['+', '-', '/', '*'],
		},
		variables: ['S', 'N', 'E'],
	},
	3
);
console.log(Object.keys(cfgLanguage));
```

```sh
[
  '0',   '1',   '(1)', '(0)',
  '1*1', '1+0', '0+0', '1/0',
  '0/0', '1/1', '0/1', '1-1',
  '0-1', '1*0', '0*0', '1-0',
  '0-0', '1+1', '0+1', '0*1'
]
```

## Remove null production from CFG

```js
import { ContextFreeGrammarUtils } from 'fauton';
const nullProductionRemovedTransition = ContextFreeGrammarUtils.removeNullProduction({
	productionRules: {
		S: ['A B AC'],
		A: ['a A', ''],
		B: ['b B', ''],
		C: ['c'],
	},
	variables: ['S', 'A', 'B', 'C'],
	startVariable: 'S',
});
console.log(nullProductionRemovedTransition);
```

```sh
# Notice that there are no production rules that produces epsilon values
{
  S: ['A A C', 'A B A C', 'A B C', 'A C', 'B A C', 'B C', 'C'],
  A: ['a A', 'a'],
  B: ['b B', 'b'],
  C: ['c']
}
```

## Removing all unreachable production rules from CFG

```js
import { ContextFreeGrammarUtils } from 'fauton';

console.log(
	ContextFreeGrammarUtils.removeUnreachableProduction({
		productionRules: {
			S: ['A B'],
			A: ['a A', 'a'],
			B: ['b B', 'b'],
			C: ['c C', 'c'],
		},
		startVariable: 'S',
		variables: ['S', 'A', 'B', 'C'],
	})
);
```

```sh
{
  productionRules: {
    S: ['A B'],
    A: ['a A', 'a'],
    B: ['b B', 'b'],
  },
  variables: ['S', 'A', 'B'],
}
```
