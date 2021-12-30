---
id: "modules"
title: "@fauton/cfg"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Interfaces

- [ICfgLanguageGenerationOption](interfaces/ICfgLanguageGenerationOption)
- [IContextFreeGrammar](interfaces/IContextFreeGrammar)

## Type aliases

### LanguageChecker

Ƭ **LanguageChecker**: (`inputString`: `string`) => `boolean`

#### Type declaration

▸ (`inputString`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `inputString` | `string` |

##### Returns

`boolean`

#### Defined in

[types.ts:9](https://github.com/Devorein/fauton/blob/44de3b6/packages/cfg/libs/types.ts#L9)

## Functions

### convertGrammarToString

▸ **convertGrammarToString**(`productionRules`): `string`[]

Convert a cfg to its string representation

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `productionRules` | `Record`<`string`, `string`[]\> | Production rules record |

#### Returns

`string`[]

A string corresponding to the cfg rules

#### Defined in

[convertGrammarToString.ts:8](https://github.com/Devorein/fauton/blob/44de3b6/packages/cfg/libs/convertGrammarToString.ts#L8)

___

### convertStringToGrammar

▸ **convertStringToGrammar**(`grammarString`): [`IContextFreeGrammar`](interfaces/IContextFreeGrammar)

Convert a string representation of cfg object to a cfg object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `grammarString` | `string` | Grammar string to convert to cfg object |

#### Returns

[`IContextFreeGrammar`](interfaces/IContextFreeGrammar)

Converted cfg object

#### Defined in

[convertStringToGrammar.ts:9](https://github.com/Devorein/fauton/blob/44de3b6/packages/cfg/libs/convertStringToGrammar.ts#L9)

___

### convertToCnf

▸ **convertToCnf**(`cfg`): [`IContextFreeGrammar`](interfaces/IContextFreeGrammar)

Converts a cfg to cnf

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cfg` | [`IContextFreeGrammar`](interfaces/IContextFreeGrammar) | Input cfg to convert to cnf |

#### Returns

[`IContextFreeGrammar`](interfaces/IContextFreeGrammar)

Resultant cfg converted to cnf

#### Defined in

[convertToCnf.ts:227](https://github.com/Devorein/fauton/blob/44de3b6/packages/cfg/libs/convertToCnf.ts#L227)

___

### cykParse

▸ **cykParse**(`cfg`, `sentenceTokens`): `Object`

Parses a sentence given a cfg

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cfg` | `Pick`<[`IContextFreeGrammar`](interfaces/IContextFreeGrammar), ``"productionRules"`` \| ``"startVariable"``\> | Input cfg production rules and start variable |
| `sentenceTokens` | `string`[] | An array of sentence tokens |

#### Returns

`Object`

Boolean value on whether the sentence is part of the grammar and steps that the CYK algo took to resolve it

| Name | Type |
| :------ | :------ |
| `cykTable` | `CykTable`<`string`[]\> |
| `nodeVariablesRecord` | `Record`<`string`, `string`[]\> |
| `sentenceTokens` | `string`[] |
| `verdict` | `boolean` |

#### Defined in

[cykParse.ts:22](https://github.com/Devorein/fauton/blob/44de3b6/packages/cfg/libs/cykParse.ts#L22)

___

### extractTerminalsFromCfg

▸ **extractTerminalsFromCfg**(`cfg`): `string`[]

Extract terminals from cfg rules

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cfg` | [`IContextFreeGrammar`](interfaces/IContextFreeGrammar) | Cfg object |

#### Returns

`string`[]

An array of terminals

#### Defined in

[extractTerminalsFromCfg.ts:8](https://github.com/Devorein/fauton/blob/44de3b6/packages/cfg/libs/extractTerminalsFromCfg.ts#L8)

___

### generateCfgLanguage

▸ **generateCfgLanguage**(`cfgOptions`, `options`): `Object`

Generates all the strings of a given cfg within certain length along with the path taken to generate them

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cfgOptions` | [`IContextFreeGrammar`](interfaces/IContextFreeGrammar) | Variables and transition Record for the cfg |
| `options` | [`ICfgLanguageGenerationOption`](interfaces/ICfgLanguageGenerationOption) | - |

#### Returns

`Object`

A record of generated string and the path taken to generate them

| Name | Type |
| :------ | :------ |
| `language` | `string`[] |
| `productionRules` | `Record`<`string`, `string`[]\> |
| `tree` | `Record`<`string`, `IQueueItem`\> |

#### Defined in

[generateCfgLanguage.ts:21](https://github.com/Devorein/fauton/blob/44de3b6/packages/cfg/libs/generateCfgLanguage.ts#L21)

___

### removeEmptyProduction

▸ **removeEmptyProduction**(`cfg`): `string`[]

Removes productions that has no rules and updates rules to remove those rules that references empty production variables

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cfg` | `Pick`<[`IContextFreeGrammar`](interfaces/IContextFreeGrammar), ``"productionRules"`` \| ``"variables"``\> | Variables array and production rules record of cfg |

#### Returns

`string`[]

New production rules and variables without empty rule variables

#### Defined in

[removeEmptyProduction.ts:9](https://github.com/Devorein/fauton/blob/44de3b6/packages/cfg/libs/removeEmptyProduction.ts#L9)

___

### removeNonTerminableProduction

▸ **removeNonTerminableProduction**(`cfg`): `string`[]

Removes production rules which doesn't derive any terminals or terminable variables

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cfg` | `Omit`<[`IContextFreeGrammar`](interfaces/IContextFreeGrammar), ``"startVariable"``\> | terminals, variables and production rules of cfg |

#### Returns

`string`[]

An array of variables that are all terminable

#### Defined in

[removeNonTerminableProduction.ts:13](https://github.com/Devorein/fauton/blob/44de3b6/packages/cfg/libs/removeNonTerminableProduction.ts#L13)

___

### removeNullProduction

▸ **removeNullProduction**(`cfg`): `void`

Removes all the null production and returns a new transition record

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cfg` | `Pick`<[`IContextFreeGrammar`](interfaces/IContextFreeGrammar), ``"productionRules"`` \| ``"startVariable"`` \| ``"variables"``\> | Variables and transition record for cfg |

#### Returns

`void`

New transition record with null production removed

#### Defined in

[removeNullProduction.ts:107](https://github.com/Devorein/fauton/blob/44de3b6/packages/cfg/libs/removeNullProduction.ts#L107)

___

### removeUnitProduction

▸ **removeUnitProduction**(`cfg`): `void`

Modifies the production rules of a cfg to remove unit production rules

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cfg` | `Pick`<[`IContextFreeGrammar`](interfaces/IContextFreeGrammar), ``"productionRules"`` \| ``"variables"``\> | Variable and production rules of a cfg |

#### Returns

`void`

#### Defined in

[removeUnitProduction.ts:38](https://github.com/Devorein/fauton/blob/44de3b6/packages/cfg/libs/removeUnitProduction.ts#L38)

___

### removeUnreachableProduction

▸ **removeUnreachableProduction**(`cfg`): `string`[]

Removes unreachable variables and production of a cfg

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cfg` | `Pick`<[`IContextFreeGrammar`](interfaces/IContextFreeGrammar), ``"productionRules"`` \| ``"startVariable"`` \| ``"variables"``\> | Production rules, start variable and variables array of cfg |

#### Returns

`string`[]

A new production rule record and variables with unreachable variable and rules removed

#### Defined in

[removeUnreachableProduction.ts:10](https://github.com/Devorein/fauton/blob/44de3b6/packages/cfg/libs/removeUnreachableProduction.ts#L10)

___

### removeUselessProduction

▸ **removeUselessProduction**(`cfg`): `string`[]

Reduces an input cfg by removing non terminable and non reachable variables

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cfg` | [`IContextFreeGrammar`](interfaces/IContextFreeGrammar) | Variables, start symbol and production rules of a cfg |

#### Returns

`string`[]

An array of terminable and reachable variables

#### Defined in

[removeUselessProduction.ts:10](https://github.com/Devorein/fauton/blob/44de3b6/packages/cfg/libs/removeUselessProduction.ts#L10)

___

### simplifyCfg

▸ **simplifyCfg**(`cfg`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `cfg` | [`IContextFreeGrammar`](interfaces/IContextFreeGrammar) |

#### Returns

`string`[]

#### Defined in

[simplifyCfg.ts:7](https://github.com/Devorein/fauton/blob/44de3b6/packages/cfg/libs/simplifyCfg.ts#L7)

___

### validateCfg

▸ **validateCfg**(`cfg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cfg` | [`IContextFreeGrammar`](interfaces/IContextFreeGrammar) |

#### Returns

`void`

#### Defined in

[validateCfg.ts:3](https://github.com/Devorein/fauton/blob/44de3b6/packages/cfg/libs/validateCfg.ts#L3)
