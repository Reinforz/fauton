import { IContextFreeGrammar, IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

function replaceProduction(pastProductionVariables: string[], productionRules: IContextFreeGrammar["productionRules"], currentVariable: string) {
  const currentVariableProductionRules = productionRules[currentVariable];
  const pastProductionVariablesSet = new Set(pastProductionVariables);
  let currentVariableProductionRuleIndex = 0;
  while (currentVariableProductionRuleIndex !== currentVariableProductionRules.length) {
    const [firstToken, ...restTokens] = currentVariableProductionRules[currentVariableProductionRuleIndex].split(" ");
    if (pastProductionVariablesSet.has(firstToken)) {
      const matchedVariableProductionRules = productionRules[firstToken];
      const newProductionRules = matchedVariableProductionRules.map(matchedVariableProductionRule => [matchedVariableProductionRule, ...restTokens].join(" "));
      currentVariableProductionRules.splice(currentVariableProductionRuleIndex, 1, ...newProductionRules)
    } else {
      currentVariableProductionRuleIndex += 1;
    }
  }
  return currentVariableProductionRules; 
}

export function removeLeftRecursion(inputCfg: IContextFreeGrammarInput) {
  const cfg = populateCfg(inputCfg);

  const productionRuleEntries = Object.entries(cfg.productionRules);
  let currentEntryNumber = 0;
  const newEntryIndexes: Set<number> = new Set();
  while (currentEntryNumber !== productionRuleEntries.length) {
    const entry = productionRuleEntries[currentEntryNumber];
    const [productionVariable] = entry;
    let productionRules = entry[1];
    const betas: string[] = [], alphas: string[] = [];

    let index = 0
    const postIndexes: number[] = [];
    // Checking indirect left recursion
    while (index !== currentEntryNumber) {
      if (!newEntryIndexes.has(index)) {
        postIndexes.push(index)
      }
      index+=1;
    }

    productionRules = postIndexes.length !== 0 ? replaceProduction(postIndexes.map(postIndex => productionRuleEntries[postIndex][0]), cfg.productionRules, productionVariable) : productionRules;

    // Check if atleast one of the production rule is left recursive
    const hasDirectLeftRecursion = productionRules.some((productionRule) => productionRule.startsWith(productionVariable));
    if (hasDirectLeftRecursion) {
      productionRules.forEach(productionRule => {
        const startsWithVariable = productionRule.startsWith(productionVariable);
        // Aα
        if (startsWithVariable) {
          const productionRuleTokens = productionRule.split(" ");
          alphas.push(productionRuleTokens.slice(1).join(" "))
        } 
        // β
        else {
          betas.push(productionRule)
        }
      })
      const newProductionVariable = `${productionVariable}'`;
      const productionRulesForNewVariable: string[] = [];
      alphas.forEach(alpha => {
        productionRulesForNewVariable.push(`${alpha} ${newProductionVariable}`)
      })
      // Pushing epsilon
      productionRulesForNewVariable.push("");
  
      // Updating current production rule
      const productionRulesForCurrentVariable: string[] = [];
      betas.forEach(beta => {
        productionRulesForCurrentVariable.push(`${beta} ${newProductionVariable}`)
      })
      productionRuleEntries[currentEntryNumber] = [productionVariable, productionRulesForCurrentVariable]
      productionRuleEntries.splice(currentEntryNumber + 1, 0, [newProductionVariable, productionRulesForNewVariable])
      cfg.productionRules[productionVariable] = productionRulesForCurrentVariable
      // Increase it by one more since we dont want to process the new entry
      currentEntryNumber += 1;
      newEntryIndexes.add(currentEntryNumber)
    }

    currentEntryNumber += 1;
  }

  const productionRules: IContextFreeGrammar["productionRules"] = {};
  // Loop through new entries and populate the new production rules
  productionRuleEntries.forEach(([productionVariable, productionRulesForVariable]) => {
    productionRules[productionVariable] = productionRulesForVariable;
  })

  return populateCfg({
    productionRules,
    startVariable: cfg.startVariable,
  })
}