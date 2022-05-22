import { IContextFreeGrammar, IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

/**
 * Left factors a grammar to remove non determinism
 * @param inputCfg Input context free grammar
 * @returns Left refactored grammar
 */
export function leftFactoring(inputCfg: IContextFreeGrammarInput) {
  const cfg = populateCfg(inputCfg);
  const cfgProductionRulesEntries = Object.entries(cfg.productionRules);
  let currentEntryNumber = 0;
  while(currentEntryNumber !== cfgProductionRulesEntries.length) {
    const [productionVariable, productionRules] = cfgProductionRulesEntries[currentEntryNumber];
    // Production rule index and number of tokens that matched, index with 0 matched tokens are not added
    const ruleIndexMatchedTokensCountRecord: Record<string, number> = {};
    for (let outerProductionRuleIndex = 0; outerProductionRuleIndex < productionRules.length - 1; outerProductionRuleIndex += 1) {
      for (let innerProductionRuleIndex = outerProductionRuleIndex + 1; innerProductionRuleIndex < productionRules.length; innerProductionRuleIndex += 1) {
        const outerProductionRuleTokens = productionRules[outerProductionRuleIndex].split(" ");
        const innerProductionRuleTokens = productionRules[innerProductionRuleIndex].split(" ");
        let totalTokenMatches = 0;
        let currentTokenIndex = 0;
        while (currentTokenIndex !== innerProductionRuleTokens.length) {
          if (outerProductionRuleTokens[currentTokenIndex] === innerProductionRuleTokens[currentTokenIndex]) {
            totalTokenMatches += 1;
            ruleIndexMatchedTokensCountRecord[outerProductionRuleIndex] = totalTokenMatches;
          } else {
            // Break the loop if there is mismatch between two tokens in the same index
            break;
          }
          currentTokenIndex += 1
        }
        // Only populate record if there is at least one token match
        if (totalTokenMatches !== 0) {
          ruleIndexMatchedTokensCountRecord[innerProductionRuleIndex] = totalTokenMatches
        }
      }
    }

    // Only continue if there is common tokens
    if (Object.keys(ruleIndexMatchedTokensCountRecord).length !== 0) {
      // Get the least number of common token
      const minTokenMatches = Math.min(...Object.values(ruleIndexMatchedTokensCountRecord))
      const newProductionVariable = `${productionVariable}'`;
      const productionRulesForNewVariable: string[] = [];
      const productionRulesForCurrentVariable: Set<string> = new Set()
      Object.keys(ruleIndexMatchedTokensCountRecord).forEach(matchedProductionRulesIndex => {
        const productionRuleTokens = productionRules[parseInt(matchedProductionRulesIndex, 10)].split(" ");
        // Everything after min token count will be stored as production rule of new variable
        productionRulesForNewVariable.push(productionRuleTokens.slice(minTokenMatches).join(" "))
      })
      // Add the new production variable and its rule after the current entry index so that it can be processed further in the next iteration
      cfgProductionRulesEntries.splice(currentEntryNumber + 1, 0, [newProductionVariable, productionRulesForNewVariable])
      productionRules.forEach((productionRule, productionRuleIndex) => {
        const productionRuleTokens = productionRule.split(" ");
        // If there are matched tokens 
        if (ruleIndexMatchedTokensCountRecord[productionRuleIndex]) {
          // Everything before min token count will be stored as production rule of current variable
          const newProductionRule = productionRuleTokens.slice(0, minTokenMatches).join(" ");
          productionRulesForCurrentVariable.add(`${newProductionRule} ${newProductionVariable}`)
        } else {
          // Otherwise add the production rule without changing it
          productionRulesForCurrentVariable.add(productionRule)
        }
      })
      cfgProductionRulesEntries[currentEntryNumber] = [productionVariable, Array.from(productionRulesForCurrentVariable)]
    }
    currentEntryNumber+=1;
  }

  const productionRules: IContextFreeGrammar["productionRules"] = {};
  // Loop through new entries and populate the new production rules
  cfgProductionRulesEntries.forEach(([productionVariable, productionRulesForVariable]) => {
    productionRules[productionVariable] = productionRulesForVariable;
  })

  return populateCfg({
    productionRules,
    startVariable: cfg.startVariable,
  })
}