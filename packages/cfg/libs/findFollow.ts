import { IContextFreeGrammarInput } from "./types";
import { populateCfg } from "./utils/populateCfg";

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