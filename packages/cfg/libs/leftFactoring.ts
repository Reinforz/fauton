import { IContextFreeGrammar, IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

export function leftFactoring(inputCfg: IContextFreeGrammarInput) {
  const cfg = populateCfg(inputCfg);
  const cfgProductionRulesEntries = Object.entries(cfg.productionRules);
  let currentEntryNumber = 0;
  while(currentEntryNumber !== cfgProductionRulesEntries.length) {
    const [productionVariable, productionRules] = cfgProductionRulesEntries[currentEntryNumber];
    let productionRuleIndexWithFirstMatch = -1;
    const matchedTokensCountArray: number[] = [];
    const matchedProductionRulesIndexSet: Set<number> = new Set()
    for (let outerProductionRuleIndex = 0; outerProductionRuleIndex < productionRules.length - 1; outerProductionRuleIndex += 1) {
      for (let innerProductionRuleIndex = outerProductionRuleIndex + 1; innerProductionRuleIndex < productionRules.length; innerProductionRuleIndex += 1) {
        const outerProductionRuleTokens = productionRules[outerProductionRuleIndex].split(" ");
        const innerProductionRuleTokens = productionRules[innerProductionRuleIndex].split(" ");
        let totalTokenMatches = 0;
        let currentTokenIndex = 0;
        while (currentTokenIndex !== innerProductionRuleTokens.length) {
          if (outerProductionRuleTokens[currentTokenIndex] === innerProductionRuleTokens[currentTokenIndex]) {
            totalTokenMatches += 1;
            productionRuleIndexWithFirstMatch = currentEntryNumber;
          } else {
            break;
          }
          currentTokenIndex += 1
        }
        if (totalTokenMatches !== 0) {
          matchedTokensCountArray.push(totalTokenMatches)
          matchedProductionRulesIndexSet.add(innerProductionRuleIndex)
        }
      }
      if (productionRuleIndexWithFirstMatch !== -1) {
        matchedProductionRulesIndexSet.add(outerProductionRuleIndex)
        break;
      }
    }
    if (matchedTokensCountArray.length !== 0) {
      const minTokenMatches = Math.min(...matchedTokensCountArray)
      const newProductionVariable = `${productionVariable}1`;
      const productionRulesForNewVariable: string[] = [];
      const productionRulesForCurrentVariable: Set<string> = new Set()
      matchedProductionRulesIndexSet.forEach(matchedProductionRulesIndex => {
        const productionRuleTokens = productionRules[matchedProductionRulesIndex].split(" ");
        productionRulesForNewVariable.push(productionRuleTokens.slice(minTokenMatches).join(" "))
      })
      cfgProductionRulesEntries.splice(currentEntryNumber + 1, 0, [newProductionVariable, productionRulesForNewVariable])
      productionRules.forEach((productionRule, productionRuleIndex) => {
        const productionRuleTokens = productionRule.split(" ")
        if (matchedProductionRulesIndexSet.has(productionRuleIndex)) {
          const newProductionRule = productionRuleTokens.slice(0, minTokenMatches).join(" ");
          productionRulesForCurrentVariable.add(`${newProductionRule} ${newProductionVariable}`)
        } else {
          productionRulesForCurrentVariable.add(productionRule)
        }
      })
      cfgProductionRulesEntries[currentEntryNumber] = [productionVariable, Array.from(productionRulesForCurrentVariable)]
    }
    currentEntryNumber+=1;
  }

  const productionRules: IContextFreeGrammar["productionRules"] = {};
  cfgProductionRulesEntries.forEach(([productionVariable, productionRulesForVariable]) => {
    productionRules[productionVariable] = productionRulesForVariable;
  })

  return populateCfg({
    productionRules,
    startVariable: cfg.startVariable,
  })
}