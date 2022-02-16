import { generateLL1ParsingTable } from "./generateLL1ParsingTable";
import { IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

export function parseWithLL1Table(inputCfg: IContextFreeGrammarInput, textContent: string) {
  const cfg = populateCfg(inputCfg)
  const {parseTable} = generateLL1ParsingTable(cfg);
  const ruleStack = ["$", cfg.startVariable];
  let lookAheadPointer = 0;
  while (ruleStack.length !== 1 && lookAheadPointer !== textContent.length) {
    const variableAtStackTop = ruleStack.pop()!;
    if (variableAtStackTop === textContent[lookAheadPointer]) {
      lookAheadPointer += 1
    } else {
      const ruleNumber = parseTable[variableAtStackTop][textContent[lookAheadPointer]];
      if (ruleNumber) {
        const productionRule = cfg.productionRules[variableAtStackTop][ruleNumber];
        const productionRuleTokens = productionRule.split("").reverse();
        productionRuleTokens.forEach(productionRuleToken => {
          ruleStack.push(productionRuleToken);
        })
      }
    }
  }

  return ruleStack.length === 1 && ruleStack[0] === "$"
}