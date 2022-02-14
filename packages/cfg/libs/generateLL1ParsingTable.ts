import { findFollow } from "./findFollow";
import { IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

/**
 * Generate LL1 Parsing table
 * @param inputCfg Input context free grammar
 * @returns LL1 Parsed table
 */
export function generateLL1ParsingTable(inputCfg: IContextFreeGrammarInput) {
  const cfg = populateCfg(inputCfg);
  // Find the first and follow record of cfg
  const followRecord = findFollow(cfg);

  const {terminals, variables} = cfg;
  // $ is included in LL1 table but inside terminals array
  const allTerminals = terminals.concat("$");

  // First key for variable, 2nd key for terminal and value is rule number
  const llRecord: Record<string, Record<string, number[]>> = {};

  // Populating the table
  // All variables as the row
  // All terminals as the column
  variables.forEach(variable => {
    llRecord[variable] = {};
    allTerminals.forEach((terminal) => {
      // An array of rule number of the variable
      llRecord[variable][terminal] = [];
    })
  })

  // Loop through all the first record entries
  Object.entries(followRecord.first).forEach(([productionVariable, firstRecord]) => {
    // Substitutions is an array which contains first(substitution)
    firstRecord.substitutions.forEach((firstTokensForSubstitution, ruleNumber) => {
      // Loop through all the first token for the substitution
      firstTokensForSubstitution.forEach(firstTokenForSubstitution => {
        // If its epsilon we need to get the followed tokens of this variable
        if (firstTokenForSubstitution === "") {
          // Loop through each followed token and assign the rule number
          followRecord.follow[productionVariable].forEach((followedToken) => {
            llRecord[productionVariable][followedToken].push(ruleNumber)
          })
        } else {
          llRecord[productionVariable][firstTokenForSubstitution].push(ruleNumber)
        }
      })
    })
  })

  return llRecord;
}