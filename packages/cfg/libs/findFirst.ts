import { IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

type FirstRecord = Record<string, {
  first: string[],
  substitutions: Array<string[]>
}>

/**
 * Find first of all the variables of cfg
 * @param inputCfg Input context free grammar
 * @returns A record where keys are the variables of the cfg and the values first(variable)
 */
export function findFirst(inputCfg: IContextFreeGrammarInput): FirstRecord {
  const cfg = populateCfg(inputCfg);
	const { productionRules, variables } = cfg;
  // A record to store first(all variables)
  const firstRecord: FirstRecord = {};
  // Using a set for faster access
  const variablesSet = new Set(variables);

  function populateFirstRecord(productionVariable: string) {
    // Get the substitutions of that production variable 
    const substitutions = productionRules[productionVariable];
    // A set to keep store first(variable)
    const firstTokens: Set<string> = new Set();
    // An array of array that stores the first for all individual rules 
    const firstTokensSubstitutions: Array<string[]> = [];

    substitutions.forEach((substitution) => {
      // Array to contain first of this particular substitution/rule
      const firstTokensForSubstitution: Set<string> = new Set();

      // a A => ["a", "A"], only the first token in required
      // First token could be a variable or a terminal
      const tokens = substitution.split(" ");
      const [firstToken] = tokens;
      // If its not a variable, then it must be a terminal
      if (!variablesSet.has(firstToken)) {
        firstTokens.add(firstToken);
        firstTokensForSubstitution.add(firstToken);
      } else {
        // Loop through all the tokens, as some might contain epsilon
        for (let index = 0; index < tokens.length; index+=1) {
          const token = tokens[index];
          if (!variablesSet.has(token)) {
            firstTokensForSubstitution.add(token);
            firstTokens.add(token)
            break;
          }
          // If its a variable,
          // we need to check whether the findFirst(referenced variable) has been calculated or not
          if (!firstRecord[token]) {
            populateFirstRecord(token);
          }
          // Store findFirst(`referenced variable`) to current production variable record 
          firstRecord[token].first.forEach(_token => {
            firstTokens.add(_token);
            firstTokensForSubstitution.add(_token);
          })
          // Check to see if the first record for token contains epsilon
          // If it doesn't no need to check for the next tokens
          if (!firstRecord[token].first.includes("")) {
            break
          }
        }
      }
      firstTokensSubstitutions.push(Array.from(firstTokensForSubstitution))
    });
    // Convert the set to an array
    firstRecord[productionVariable] = {
      first: Array.from(firstTokens),
      substitutions: firstTokensSubstitutions
    }
  }

  // Loop through each variable
  variables.forEach(variable => {
    // Check to see if its been calculated
    if (!firstRecord[variable]) {
      populateFirstRecord(variable)
    }
  })

  return firstRecord;
}