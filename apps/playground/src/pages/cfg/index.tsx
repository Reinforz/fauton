import { extractTerminalsFromCfg, IContextFreeGrammar } from "@fauton/cfg";
import { useState } from "react";
import { CreateGrammar } from "../../components";
import { CfgContext } from "../../contexts";
import { UserInputGrammar } from "../../types";

export default function ContextFreeGrammar() {
  const [contextFreeGrammars, setContextFreeGrammars] = useState<{ label: string, grammar: IContextFreeGrammar }[]>([]);
  const [currentSelectedGrammar, setCurrentSelectedGrammar] = useState<{
    label: string,
    grammar: IContextFreeGrammar
  } | null>(null);

  function addGrammar(userInputGrammar: UserInputGrammar) {
    // Using a set to keep track of unique variables
    const variablesSet: Set<string> = new Set();
    const convertedContextFreeGrammar: IContextFreeGrammar = {
      productionRules: {},
      startVariable: "",
      terminals: [],
      variables: []
    };

    userInputGrammar.rules.forEach(cfgProductionRule => {
      convertedContextFreeGrammar.productionRules[cfgProductionRule.variable] = cfgProductionRule.substitutions.map(substitution => substitution.join(" "))
      variablesSet.add(cfgProductionRule.variable)
    });

    convertedContextFreeGrammar.variables = Array.from(variablesSet);
    convertedContextFreeGrammar.terminals = extractTerminalsFromCfg(convertedContextFreeGrammar);
    convertedContextFreeGrammar.startVariable = convertedContextFreeGrammar.variables[0]!;
    setContextFreeGrammars([...contextFreeGrammars, {
      label: userInputGrammar.label,
      grammar: convertedContextFreeGrammar
    }])
  }
  
  return <CfgContext.Provider value={{
    grammars: contextFreeGrammars,
    addGrammar,
    currentSelectedGrammar,
    setCurrentSelectedGrammar
  }}>
    <CreateGrammar />
  </CfgContext.Provider>
}