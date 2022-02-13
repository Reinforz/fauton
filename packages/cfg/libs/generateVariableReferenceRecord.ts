import { IContextFreeGrammar } from "./types";

export interface VariableReferenceLocation {
  variable: string,
  ruleNumber: number,
  tokenNumber: number
}

export default function generateVariableReferenceRecord(cfg: Pick<IContextFreeGrammar, "productionRules" | "variables">) {
  const {variables, productionRules} = cfg;
  const variableReferenceLocationRecord: Record<string, VariableReferenceLocation[]> = {};

  // Loop through all variables
  variables.forEach(targetVariable => {
    // Array to keep track of all the locations outer variable is being referenced
    const variableReferences: VariableReferenceLocation[] = []
    // Loop though all variables again
    variables.forEach(productionVariable => {
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
    })
    variableReferenceLocationRecord[targetVariable] = variableReferences;
  })

  return variableReferenceLocationRecord;
}