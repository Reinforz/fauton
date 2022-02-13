import { IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

/**
 * Find first of all the variables of cfg
 * @param inputCfg Input context free grammar
 * @returns A record where keys are the variables of the cfg and the values first(variable)
 */
export function findFirst(inputCfg: IContextFreeGrammarInput): Record<string, string[]> {
  const cfg = populateCfg(inputCfg);
	const { productionRules, variables } = cfg;
  // A record to store first(all variables)
  const firstRecord: Record<string, string[]> = {};
  // Using a set for faster access
  const variablesSet = new Set(variables);
  // Set to keep track of which nodes have been traversed in order to avoid recalculation
  const traversedSet: Set<string> = new Set();

  function populateFirstRecord(productionVariable: string) {
    // Get the substitutions of that production variable 
    const substitutions = productionRules[productionVariable];
    // A set to keep store first(variable)
    const firstTokens: Set<string> = new Set();
    substitutions.forEach(substitution => {
      // a A => ["a", "A"], only the first token in required
      // First token could be a variable or a terminal
      const tokens = substitution.split(" ");
      const [firstToken] = tokens;
      // If its not a variable, then it must be a terminal
      if (!variablesSet.has(firstToken)) {
        firstTokens.add(firstToken)
      } else {
        // Loop through all the tokens, as some might contain epsilon
        for (let index = 0; index < tokens.length; index+=1) {
          const token = tokens[index];
          if (!variablesSet.has(token)) {
            firstTokens.add(token)
            break;
          }
          // If its a variable,
          // we need to check whether the findFirst(referenced variable) has been calculated or not
          if (!firstRecord[token]) {
            populateFirstRecord(token);
          }
          // Store findFirst(`referenced variable`) to current production variable record 
          firstRecord[token].forEach(_token => {
            firstTokens.add(_token)
          })
          // Check to see if the first record for token contains epsilon
          // If it doesn't no need to check for the next tokens
          if (!firstRecord[token].includes("")) {
            break
          }
        }
      }
    });
    // Add variable to traversed set to avoid calculating it again
    traversedSet.add(productionVariable)
    // Convert the set to an array
    firstRecord[productionVariable] = Array.from(firstTokens)
  }

  // Loop through each variable
  variables.forEach(variable => {
    // Check to see if its been traversed
    if (!traversedSet.has(variable)) {
      populateFirstRecord(variable)
    }
  })

  return firstRecord;
}