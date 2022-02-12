import { IContextFreeGrammar, IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

interface VariableReferenceLocation {
  variable: string,
  ruleNumber: number,
  tokenNumber: number
}

export function generateVariableReferenceRecord(cfg: Pick<IContextFreeGrammar, "productionRules" | "variables">) {
  const {variables, productionRules} = cfg;
  const variableReferenceLocationRecord: Record<string, VariableReferenceLocation[]> = {};

  // Loop through all variables
  variables.forEach(targetVariable => {
    // Array to keep track of all the locations outer variable is being referenced
    const variableReferences: VariableReferenceLocation[] = []
    // Loop though all variables again
    variables.forEach(productionVariable => {
      // If the outer and inner variables aren't same
      if (productionVariable !== targetVariable) {
        // Get the rules of the inner variable
        const rules = productionRules[productionVariable];
        // Loop through each rule
        rules.forEach((rule, ruleNumber) => {
          // Get the tokens of the rule
          const tokens = rule.split(" ");
          // Loop through all token 
          tokens.forEach((token, tokenNumber) => {
            // Check if the token is the same as outer variable
            if (token === targetVariable) {
              variableReferences.push({
                variable: productionVariable,
                ruleNumber,
                tokenNumber
              })
            }
          })
        })
      }
    })
    variableReferenceLocationRecord[targetVariable] = variableReferences;
  })

  return variableReferenceLocationRecord;
}

export default function findFollow(inputCfg: IContextFreeGrammarInput): Record<string, string[]> {
  const cfg = populateCfg(inputCfg);
	const { productionRules, variables, startVariable } = cfg;
  const followRecord: Record<string, string[]> = {};
  const traversedSet: Set<string> = new Set();

  function populateFollowRecord(productionVariable: string) {
    // Check to see if the production variable is the starting variable
    const followTokens: Set<string> = new Set();

    if (startVariable === productionVariable) {
      followTokens.add("$")
    }

    // Check to see 
    traversedSet.add(productionVariable);
    followRecord[productionVariable] = Array.from(followTokens)
  }

  variables.forEach(variable => {
    if (!traversedSet.has(variable)) {
      populateFollowRecord(variable)
    }
  })

  return followRecord;
}