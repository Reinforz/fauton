import { IContextFreeGrammar, IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

export function removeLeftRecursion(inputCfg: IContextFreeGrammarInput) {
  const cfg = populateCfg(inputCfg);

  const productionRuleEntries = Object.entries(cfg.productionRules);
  let currentEntryNumber = 0;

  while (currentEntryNumber !== productionRuleEntries.length) {
    const [productionVariable, productionRules] = productionRuleEntries[currentEntryNumber];
    const betas: string[] = [], alphas: string[] = [];
    // Check if atleast one of the production rule is left recursive
    const isLeftRecursive = productionRules.some((productionRule) => productionRule.startsWith(productionVariable));
    if (isLeftRecursive) {
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
      // Increase it by one more since we dont want to process the new entry
      currentEntryNumber += 1;
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