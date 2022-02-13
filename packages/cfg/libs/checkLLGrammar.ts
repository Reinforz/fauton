import { findFollow } from "./findFollow";
import { VariableReferenceLocation } from "./generateVariableReferenceRecord";
import { IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

export function checkLLGrammar(inputCfg: IContextFreeGrammarInput) {
  const cfg = populateCfg(inputCfg);
  const followRecord = findFollow(cfg);

  const {terminals, productionRules, variables} = cfg;
  const allTerminals = terminals.concat("$");

  // First key for variable, 2nd key for terminal
  const llRecord: Record<string, Record<string, VariableReferenceLocation[]>> = {};

  variables.forEach(variable => {
    const rules = productionRules[variable];
    rules.forEach(rule => {
      
    });

    llRecord[variable] = {};
    allTerminals.forEach((terminal) => {
      llRecord[variable][terminal] = [];
    })
  })

  return llRecord;
}