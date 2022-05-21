import { IContextFreeGrammar, ParseTree } from "./types";

export function generateParseTreeFromDerivations(cfg: IContextFreeGrammar, derivations: [string, string[]][]) {
  const rootTree: ParseTree[] = []
  const variablesSet = new Set(cfg.variables);

  function recurse(derivation: [string, string[]], parentTreeContainer: (string | ParseTree)[], derivationNumber: number) {
    const [productionVariable, productionRuleTokens] = derivation;
    const parentNode: ParseTree = {
      [productionVariable]: []
    };

    for (let index = 0; index < productionRuleTokens.length; index+=1) {
      const token = productionRuleTokens[index];
      if (variablesSet.has(token)) {
        recurse(derivations[derivationNumber + 1], parentNode[productionVariable], derivationNumber + 1)
      } else {
        parentNode[productionVariable].push(token)
      }
    }
    parentTreeContainer.push(parentNode)
  }

  recurse(derivations[0], rootTree, 0)
  return rootTree[0]
}