import { extractTerminalsFromCfg, IContextFreeGrammar } from "@fauton/cfg";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { useState } from "react";
import { Button } from "../components";
import { RootContext } from "../contexts/RootContext";
import { UserInputGrammar } from "../types";

const Index = () => {
  const [contextFreeGrammars, setContextFreeGrammars] = useState<{ label: string, grammar: IContextFreeGrammar }[]>([]);
  const [currentSelectedGrammar, setCurrentSelectedGrammar] = useState<{
    label: string,
    grammar: IContextFreeGrammar
  } | null>(null);

  const router = useRouter();

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
    <RootContext.Provider value={{
      currentSelectedGrammar,
      setCurrentSelectedGrammar
    }}>
      <div className="p-3 text-white bg-gray-900 h-full w-full flex items-center justify-center flex-col gap-5">
        <Button label="Regular Expression" onClick={() => {
          router.push("/regex")
        }}/>
        <Button label="Context Free Grammar" onClick={() => {
          router.push("/cfg")
        }}/>
        <Button label="Finite Automata" onClick={() => {
          router.push("/fa")
        }}/>
        <Button label="Pushdown Automata" onClick={() => {
          router.push("/pda")
        }}/>
      </div>
    </RootContext.Provider>
  </>;
};

export default Index;