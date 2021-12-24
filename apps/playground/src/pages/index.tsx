import { extractTerminalsFromCfg, IContextFreeGrammar } from "@fauton/cfg";
import Head from "next/head";
import { useState } from "react";
import { CreateGrammar } from "../components/CreateGrammar";
import { GrammarPipeline } from "../components/GrammarPipeline";
import { UserInputGrammar } from "../types";

const Index = () => {
  const [contextFreeGrammars, setContextFreeGrammars] = useState<{ label: string, grammar: IContextFreeGrammar }[]>([]);
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

  return <>
    <Head>
      <title>Fauton Playground</title>
    </Head>
    <div className="p-3 text-white bg-gray-900 h-full w-full">
      <div className="flex gap-10 h-full">
        <CreateGrammar addGrammar={addGrammar} />
        <GrammarPipeline grammars={contextFreeGrammars} />
      </div>
    </div>
  </>;
};

export default Index;