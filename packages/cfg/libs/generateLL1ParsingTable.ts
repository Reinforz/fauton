import { findFollow } from "./findFollow";
import { IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

/**
 * Generate LL1 Parsing table
 * @param inputCfg Input context free grammar
 * @returns A record for LL1 Parsed table and whether the grammar is LL1 parsable
 */
export function generateLL1ParsingTable(inputCfg: IContextFreeGrammarInput) {
  const cfg = populateCfg(inputCfg);
  // Find the first and follow record of cfg
  const followRecord = findFollow(cfg);
  let isParsable = true;
  const {variables} = cfg;

  // First key for variable, 2nd key for terminal and value is rule number or null
  const llRecord: Record<string, Record<string, number | null>> = {};

  // Populating the table
  // All variables as the row
  // All terminals as the column
  variables.forEach(variable => {
    llRecord[variable] = {};
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
            if (followedToken in llRecord[productionVariable]) {
              isParsable = false;
            }
            llRecord[productionVariable][followedToken] = ruleNumber
          })
        } else {
          // TODO: No tests reaches this path, maybe its not required?
          // if (firstTokenForSubstitution in llRecord[productionVariable]) {
          //   isParsable = false;
          // }
          llRecord[productionVariable][firstTokenForSubstitution] = ruleNumber
        }
      })
    })
  })

  return {
    parseTable: llRecord,
    isParsable
  };
}