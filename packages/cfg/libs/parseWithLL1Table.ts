import { generateLL1ParsingTable } from "./generateLL1ParsingTable";
import { generateParseTreeFromDerivations } from "./generateParseTreeFromDerivations";
import { IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

export function parseWithLL1Table(inputCfg: IContextFreeGrammarInput, textContent: string) {
  const derivations: [string, string[]][] = []
  const cfg = populateCfg(inputCfg)
  const {parseTable} = generateLL1ParsingTable(cfg);
  const ruleStack = ["$", cfg.startVariable];
  let lookAheadPointer = 0;
  while (ruleStack.length !== 1 && lookAheadPointer !== textContent.length) {
    const variableAtStackTop = ruleStack.pop()!;
    if (variableAtStackTop === textContent[lookAheadPointer]) {
      lookAheadPointer += 1
    } else {
      const char = textContent[lookAheadPointer];
      if (char in parseTable[variableAtStackTop]) {
        const ruleNumber = parseTable[variableAtStackTop][char]!;
        const productionRule = cfg.productionRules[variableAtStackTop][ruleNumber];
        const productionRuleTokens = productionRule.split(" ");
        ruleStack.push(...[...productionRuleTokens].reverse())
        derivations.push([variableAtStackTop, productionRuleTokens])
      }
    }
  }

  return {
    parsed: ruleStack.length === 1 && ruleStack[0] === "$",
    derivations,
    tree: generateParseTreeFromDerivations(cfg, derivations)
  }
}