import { convertGrammarToString } from './convertGrammarToString';
import { convertStringToGrammar } from './convertStringToGrammar';
import { convertToCnf } from './convertToCnf';
import { cykParse } from './cykParse';
import { extractTerminalsFromCfg } from './extractTerminalsFromCfg';
import { findFirst } from './findFirst';
import { findFollow } from './findFollow';
import { generateCfgLanguage } from './generateCfgLanguage';
import { generateLL1ParsingTable } from './generateLL1ParsingTable';
import { addDotToProductionRule, generateClosureOfLR0Item, generateLR0ParsingTable } from './generateLR0ParsingTable';
import { parseWithLL1Table } from "./parseWithLL1Table";
import { removeEmptyProduction } from './removeEmptyProduction';
import { removeLeftRecursion } from './removeLeftRecursion';
import { removeNonDeterminism } from './removeNonDeterminism';
import { removeNonTerminableProduction } from './removeNonTerminableProduction';
import { removeNullProduction } from './removeNullProduction';
import { removeUnitProduction } from './removeUnitProduction';
import { removeUnreachableProduction } from './removeUnreachableProduction';
import { removeUselessProduction } from './removeUselessProduction';
import { simplifyCfg } from './simplifyCfg';
import { validateCfg } from './validateCfg';

// TODO: Create separate classes for grouping modules
// Name-spacing lr0 parser related modules
export const LRO = {
  addDotToProductionRule,
  generateClosureOfLR0Item,
  generateLR0ParsingTable,
}

export * from './types';
export {
  removeLeftRecursion,
  removeNonDeterminism,
  parseWithLL1Table,
  generateLL1ParsingTable,
  findFollow,
  convertGrammarToString,
  convertStringToGrammar,
  convertToCnf,
  cykParse,
  generateCfgLanguage,
  removeEmptyProduction,
  removeNonTerminableProduction,
  removeNullProduction,
  removeUnitProduction,
  removeUnreachableProduction,
  removeUselessProduction,
  extractTerminalsFromCfg,
  simplifyCfg,
  validateCfg,
  findFirst
};

