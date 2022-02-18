import { IContextFreeGrammar, IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

const dotSymbol = "$.$"

export function addDotToProductionRule (productionRules: IContextFreeGrammar["productionRules"], productionVariable: string) {
  const rulesForVariable = productionRules[productionVariable];
  // Loop through all the rules for the variable
  rulesForVariable.forEach((rule, ruleIndex) => {
    // Add the dot symbol to the left
    rulesForVariable[ruleIndex] = `${dotSymbol} ${rule}`
  });
}

export function generateClosureOfLR0Item(cfg: Omit<IContextFreeGrammar, "startVariable" | "terminals">, productionVariable: string) {
  const {productionRules, variables} = cfg;
  // Creating a set of variables for faster membership lookup
  const variablesSet = new Set(variables);

  const rules = productionRules[productionVariable];
  rules.forEach(rule => {
    const tokens = rule.split(" ");
    for (let tokenNumber = 0; tokenNumber < tokens.length - 1; tokenNumber+=1) {
      const token = tokens[tokenNumber];
      // We wont overflow the tokens array so its safe
      const nextToken = tokens[tokenNumber + 1];
      // Using $.$ as its a lot less common than regular .
      // Check if the next token is a variable
      if (token === dotSymbol && variablesSet.has(nextToken)) {
        // Add dotSymbol to the left of all the substitution for the variable
        addDotToProductionRule(productionRules, nextToken);
        // Generate closure of the next variable
        generateClosureOfLR0Item(cfg, nextToken)
      }
    }
  })
}

export function augmentCfg(inputCfg: IContextFreeGrammarInput) {
  const cfg  = populateCfg(inputCfg);
  const { productionRules, startVariable, variables } = cfg;
  // Create the augmented grammar
  const newStartVariable = `${startVariable}'`;
  variables.unshift(newStartVariable);
  productionRules[newStartVariable] = [startVariable]
  cfg.startVariable = newStartVariable
  return cfg;
}

export function generateLR0ParsingTable(inputCfg: IContextFreeGrammarInput) {
  augmentCfg(inputCfg);
}