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
- [IContextFreeGrammarInput](interfaces/IContextFreeGrammarInput)

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

[types.ts:16](https://github.com/Devorein/fauton/blob/33b8a4e/packages/cfg/libs/types.ts#L16)

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

[convertGrammarToString.ts:8](https://github.com/Devorein/fauton/blob/33b8a4e/packages/cfg/libs/convertGrammarToString.ts#L8)

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

[convertStringToGrammar.ts:9](https://github.com/Devorein/fauton/blob/33b8a4e/packages/cfg/libs/convertStringToGrammar.ts#L9)

___

### convertToCnf

▸ **convertToCnf**(`inputCfg`): [`IContextFreeGrammar`](interfaces/IContextFreeGrammar)

Converts a cfg to cnf

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputCfg` | [`IContextFreeGrammarInput`](interfaces/IContextFreeGrammarInput) |

#### Returns

[`IContextFreeGrammar`](interfaces/IContextFreeGrammar)

Resultant cfg converted to cnf

#### Defined in

[convertToCnf.ts:257](https://github.com/Devorein/fauton/blob/33b8a4e/packages/cfg/libs/convertToCnf.ts#L257)

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
| `cykTable` | `string`[][] |
| `cykTableDetailed` | `CykTableDetailed`<`string`[]\> |
| `nodeVariablesRecord` | `Record`<`string`, `string`[]\> |
| `sentenceTokens` | `string`[] |
| `verdict` | `boolean` |

#### Defined in

[cykParse.ts:22](https://github.com/Devorein/fauton/blob/33b8a4e/packages/cfg/libs/cykParse.ts#L22)

___

### extractTerminalsFromCfg

▸ **extractTerminalsFromCfg**(`inputCfg`): `string`[]

Extract terminals from cfg rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputCfg` | `Omit`<[`IContextFreeGrammarInput`](interfaces/IContextFreeGrammarInput), ``"startVariable"`` \| ``"terminals"``\> |

#### Returns

`string`[]

An array of terminals

#### Defined in

[extractTerminalsFromCfg.ts:8](https://github.com/Devorein/fauton/blob/33b8a4e/packages/cfg/libs/extractTerminalsFromCfg.ts#L8)

___

### generateCfgLanguage

▸ **generateCfgLanguage**(`inputCfg`, `options`): `Object`

Generates all the strings of a given cfg within certain length along with the path taken to generate them

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputCfg` | [`IContextFreeGrammarInput`](interfaces/IContextFreeGrammarInput) |
| `options` | [`ICfgLanguageGenerationOption`](interfaces/ICfgLanguageGenerationOption) |

#### Returns

`Object`

A record of generated string and the path taken to generate them

| Name | Type |
| :------ | :------ |
| `language` | `string`[] |
| `productionRules` | `Record`<`string`, `string`[]\> |
| `tree` | `Record`<`string`, `IQueueItem`\> |

#### Defined in

[generateCfgLanguage.ts:22](https://github.com/Devorein/fauton/blob/33b8a4e/packages/cfg/libs/generateCfgLanguage.ts#L22)

___

### removeEmptyProduction

▸ **removeEmptyProduction**(`inputCfg`): `string`[]

Removes productions that has no rules and updates rules to remove those rules that references empty production variables

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputCfg` | `Pick`<[`IContextFreeGrammarInput`](interfaces/IContextFreeGrammarInput), ``"productionRules"`` \| ``"variables"``\> |

#### Returns

`string`[]

New production rules and variables without empty rule variables

#### Defined in

[removeEmptyProduction.ts:10](https://github.com/Devorein/fauton/blob/33b8a4e/packages/cfg/libs/removeEmptyProduction.ts#L10)

___

### removeNonTerminableProduction

▸ **removeNonTerminableProduction**(`inputCfg`): `string`[]

Removes production rules which doesn't derive any terminals or terminable variables

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputCfg` | [`IContextFreeGrammarInput`](interfaces/IContextFreeGrammarInput) |

#### Returns

`string`[]

An array of variables that are all terminable

#### Defined in

[removeNonTerminableProduction.ts:14](https://github.com/Devorein/fauton/blob/33b8a4e/packages/cfg/libs/removeNonTerminableProduction.ts#L14)

___

### removeNullProduction

▸ **removeNullProduction**(`inputCfg`): `void`

Removes all the null production and returns a new transition record

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputCfg` | `Pick`<[`IContextFreeGrammarInput`](interfaces/IContextFreeGrammarInput), ``"productionRules"`` \| ``"startVariable"`` \| ``"variables"``\> |

#### Returns

`void`

New transition record with null production removed

#### Defined in

[removeNullProduction.ts:108](https://github.com/Devorein/fauton/blob/33b8a4e/packages/cfg/libs/removeNullProduction.ts#L108)

___

### removeUnitProduction

▸ **removeUnitProduction**(`inputCfg`): `void`

Modifies the production rules of a cfg to remove unit production rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputCfg` | `Pick`<[`IContextFreeGrammarInput`](interfaces/IContextFreeGrammarInput), ``"productionRules"`` \| ``"variables"``\> |

#### Returns

`void`

#### Defined in

[removeUnitProduction.ts:42](https://github.com/Devorein/fauton/blob/33b8a4e/packages/cfg/libs/removeUnitProduction.ts#L42)

___

### removeUnreachableProduction

▸ **removeUnreachableProduction**(`inputCfg`): `string`[]

Removes unreachable variables and production of a cfg

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputCfg` | `Pick`<[`IContextFreeGrammarInput`](interfaces/IContextFreeGrammarInput), ``"productionRules"`` \| ``"startVariable"`` \| ``"variables"``\> |

#### Returns

`string`[]

A new production rule record and variables with unreachable variable and rules removed

#### Defined in

[removeUnreachableProduction.ts:11](https://github.com/Devorein/fauton/blob/33b8a4e/packages/cfg/libs/removeUnreachableProduction.ts#L11)

___

### removeUselessProduction

▸ **removeUselessProduction**(`inputCfg`): `string`[]

Reduces an input cfg by removing non terminable and non reachable variables

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputCfg` | [`IContextFreeGrammarInput`](interfaces/IContextFreeGrammarInput) |

#### Returns

`string`[]

An array of terminable and reachable variables

#### Defined in

[removeUselessProduction.ts:11](https://github.com/Devorein/fauton/blob/33b8a4e/packages/cfg/libs/removeUselessProduction.ts#L11)

___

### simplifyCfg

▸ **simplifyCfg**(`inputCfg`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputCfg` | [`IContextFreeGrammarInput`](interfaces/IContextFreeGrammarInput) |

#### Returns

`string`[]

#### Defined in

[simplifyCfg.ts:8](https://github.com/Devorein/fauton/blob/33b8a4e/packages/cfg/libs/simplifyCfg.ts#L8)

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

[validateCfg.ts:3](https://github.com/Devorein/fauton/blob/33b8a4e/packages/cfg/libs/validateCfg.ts#L3)
