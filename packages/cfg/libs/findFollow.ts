import { findFirst } from "./findFirst";
import generateVariableReferenceRecord, { VariableReferenceLocation } from "./generateVariableReferenceRecord";
import { IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

/**
 * Find follow of all the variables of cfg
 * @param inputCfg Input context free grammar
 * @returns A record where keys are variables and values is follow(variable)
 */
export function findFollow(inputCfg: IContextFreeGrammarInput): Record<string, string[]> {
  const cfg = populateCfg(inputCfg);
	const { productionRules, variables, startVariable } = cfg;
  const followRecord: Record<string, string[]> = {};
  const traversedSet: Set<string> = new Set();
  const variablesSet = new Set(variables);
  // Get the reference record for cfg
  const variableReferenceRecord = generateVariableReferenceRecord(cfg);
  // Get the first record of cfg
  const firstRecord = findFirst(cfg);
  
  function populateFollowRecord(productionVariable: string) {
    // Check to see if the production variable is the starting variable
    const followedTokens: Set<string> = new Set();

    // If this is the start variable add $
    if (startVariable === productionVariable) {
      followedTokens.add("$")
    }

    function moveNext(reference: VariableReferenceLocation) {
      const {ruleNumber, tokenNumber, variable} = reference;
      // Generate the tokens of the rule
      const tokens = productionRules[variable][ruleNumber].split(" ");
      // Check if we are add edge token or not
      const isAtEdge = tokens.length - 1 === tokenNumber;
      if (!isAtEdge) {
        const nextToken = tokens[tokenNumber + 1];
        // If the next token is not a variable
        if (!variablesSet.has(nextToken)) {
          followedTokens.add(nextToken)
        } else {
          // Get the first tokens of next token
          const firstTokens = firstRecord[nextToken];
          // If first of it contains nullable
          if (firstTokens.includes("")) {
            // Move to the next token in the rule
            moveNext({
              ruleNumber,
              tokenNumber: tokenNumber + 1,
              variable
            })
          } 

          // Loop through all first tokens and add them to followed tokens
          firstTokens.forEach((firstToken) => {
            // Follow can never contain nullable
            if (firstToken !== "") {
              followedTokens.add(firstToken)
            }
          })
        }
      } 
      // If the variable is referenced at edge
      else if (isAtEdge){
        // if the variables are not the same
        // B -> a B (Same), B -> a C (Different)
        if (variable !== productionVariable) {
          // Populate the follow record of the variable whose rule references this variable
          if (!followRecord[variable])
            populateFollowRecord(variable)
          // C -> a B
          // follow(B) => follow(C)
          followRecord[variable].forEach(token => {
            // Follow can never contain nullable
            if (token !== "") {
              followedTokens.add(token)
            }
          })
        }
      }
    }

    // All the locations where this variable is being referenced
    const references = variableReferenceRecord[productionVariable];
    references.forEach(reference => {
      moveNext(reference)
    })

    // Add it to traversed set as its been calculated
    traversedSet.add(productionVariable);
    followRecord[productionVariable] = Array.from(followedTokens)
  }

  // Go through each variables
  variables.forEach(variable => {
    // Make sure its not been traversed before
    if (!traversedSet.has(variable)) {
      populateFollowRecord(variable)
    }
  })

  return followRecord;
}