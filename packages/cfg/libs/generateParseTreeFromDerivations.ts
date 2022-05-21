import { Derivation, ParseTree } from "./types";

/**
 * Generate parse tree from derivations
 * @param variables Array of variables string
 * @param derivations Array of production variable and tokens tuple
 * @returns Parse tree
 */
export function generateParseTreeFromDerivations(variables: string[], derivations: Derivation[]) {
  const rootTree: ParseTree[] = []
  const variablesSet = new Set(variables);

  // Global state to keep track of which derivation we are currently at
  let derivationNumber = 0;
  
  function recurse(derivation: Derivation, childContainer: (string | ParseTree)[]) {
    const [productionVariable, productionRuleTokens] = derivation;
    // Create the parent node
    const parentNode: ParseTree = {
      [productionVariable]: []
    };

    // Loop through all the tokens
    for (let index = 0; index < productionRuleTokens.length; index+=1) {
      const token = productionRuleTokens[index];
      // Check if the token is a variable
      if (variablesSet.has(token)) {
        // Move to the next derivation
        derivationNumber += 1;
        // Make sure we haven't exhausted the derivations
        if (derivationNumber < derivations.length) {
          recurse(derivations[derivationNumber], parentNode[productionVariable])
        } else {
          break;
        }
      } else {
        // Always push terminals as is
        parentNode[productionVariable].push(token)
      }
    }
    childContainer.push(parentNode)
  }

  recurse(derivations[0], rootTree)
  return rootTree[0]
}