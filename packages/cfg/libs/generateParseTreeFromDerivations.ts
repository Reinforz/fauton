import { IContextFreeGrammar, ParseTree } from "./types";

export function generateParseTreeFromDerivations(cfg: IContextFreeGrammar, derivations: [string, string[]][]) {
  const rootTree: ParseTree[] = []
  const variablesSet = new Set(cfg.variables);

  let derivationNumber = 0;

  function recurse(derivation: [string, string[]], parentTreeContainer: (string | ParseTree)[]) {
    if (derivationNumber < derivations.length) {
      const [productionVariable, productionRuleTokens] = derivation;
      const parentNode: ParseTree = {
        [productionVariable]: []
      };
  
      for (let index = 0; index < productionRuleTokens.length; index+=1) {
        const token = productionRuleTokens[index];
        if (variablesSet.has(token)) {
          derivationNumber += 1;
          recurse(derivations[derivationNumber], parentNode[productionVariable])
        } else {
          parentNode[productionVariable].push(token)
        }
      }
      parentTreeContainer.push(parentNode)
    }
  }

  recurse(derivations[0], rootTree)
  return rootTree[0]
}