import findFirst from "./findFirst";
import generateVariableReferenceRecord from "./generateVariableReferenceRecord";
import { IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

export default function findFollow(inputCfg: IContextFreeGrammarInput): Record<string, string[]> {
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

    if (startVariable === productionVariable) {
      followedTokens.add("$")
    }
    const references = variableReferenceRecord[productionVariable];
    references.forEach(reference => {
      const {ruleNumber, tokenNumber, variable} = reference;
      const tokens = productionRules[variable][ruleNumber].split(" ");
      const isAtEdge = tokens.length - 1 === tokenNumber;
      if (!isAtEdge) {
        const nextToken = tokens[tokenNumber + 1];
        // If the next token is not a variable
        if (!variablesSet.has(nextToken)) {
          followedTokens.add(nextToken)
        } else {
          // Get the first tokens of next token
          const firstTokens = firstRecord[nextToken];
          // If it doesn't contain epsilon
          if (!firstTokens.includes("")) {
            // Loop through all first tokens and add them to followed tokens
            firstTokens.forEach(firstToken => {
              followedTokens.add(firstToken)
            })
          } else {
            console.log(123)
          }
        }
      } 
      // If the variable is referenced at edge
      else if (isAtEdge){
        // if the variables are not the same
        // B -> a B
        if (variable !== productionVariable) {
          // Populate the follow record of the variable whose rule references this variable
          populateFollowRecord(variable)
          // C -> a B
          // follow(B) => follow(C)
          followRecord[variable].forEach(token => {
            followedTokens.add(token)
          })
        }
      }
    })

    // Check to see 
    traversedSet.add(productionVariable);
    followRecord[productionVariable] = Array.from(followedTokens)
  }

  variables.forEach(variable => {
    if (!traversedSet.has(variable)) {
      populateFollowRecord(variable)
    }
  })

  return followRecord;
}