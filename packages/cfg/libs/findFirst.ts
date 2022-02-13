import { IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

type FirstRecord = Record<string, {
  first: string[],
  substitutions: Record<string, string[]>
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
    const firstTokensSubstitutionsRecord: Record<string, string[]> = {};

    substitutions.forEach((substitution, substitutionNumber) => {
      if (!firstTokensSubstitutionsRecord[substitutionNumber]) {
        firstTokensSubstitutionsRecord[substitutionNumber] = []
      }

      // a A => ["a", "A"], only the first token in required
      // First token could be a variable or a terminal
      const tokens = substitution.split(" ");
      const [firstToken] = tokens;
      // If its not a variable, then it must be a terminal
      if (!variablesSet.has(firstToken)) {
        firstTokens.add(firstToken);
        firstTokensSubstitutionsRecord[substitutionNumber].push(firstToken);
      } else {
        // Loop through all the tokens, as some might contain epsilon
        for (let index = 0; index < tokens.length; index+=1) {
          const token = tokens[index];
          if (!variablesSet.has(token)) {
            firstTokensSubstitutionsRecord[substitutionNumber].push(token);
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
            firstTokensSubstitutionsRecord[substitutionNumber].push(_token);
          })
          // Check to see if the first record for token contains epsilon
          // If it doesn't no need to check for the next tokens
          if (!firstRecord[token].first.includes("")) {
            break
          }
        }
      }
    });
    // Convert the set to an array
    firstRecord[productionVariable] = {
      first: Array.from(firstTokens),
      substitutions: firstTokensSubstitutionsRecord
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