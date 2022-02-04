import { extractTerminalsFromCfg, IContextFreeGrammar } from "@fauton/cfg";
import { ListItem, ListItemText } from "@mui/material";
import { useState } from "react";
import { CreateGrammar } from "../../components";
import Drawer from "../../components/Drawer";
import { CfgContext } from "../../contexts";
import { DrawerContext } from "../../contexts/Drawer";
import { ContextFreeGrammarWithLabel, UserInputGrammar } from "../../types";

export default function ContextFreeGrammar() {
  const [contextFreeGrammars, setContextFreeGrammars] = useState<ContextFreeGrammarWithLabel[]>([]);
  const [currentSelectedGrammar, setCurrentSelectedGrammar] = useState<ContextFreeGrammarWithLabel | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      ...convertedContextFreeGrammar
    }])
  }

  return <CfgContext.Provider value={{
    grammars: contextFreeGrammars,
    addGrammar,
    currentSelectedGrammar,
    setCurrentSelectedGrammar
  }}>
    <DrawerContext.Provider value={{isDrawerOpen, setIsDrawerOpen}}>
      <Drawer drawerItems={[contextFreeGrammars.map(contextFreeGrammar => <ListItem button key={contextFreeGrammar.label}>
        <ListItemText primary={contextFreeGrammar.label} />
      </ListItem>)]} />
      <CreateGrammar />
    </DrawerContext.Provider>
  </CfgContext.Provider>
}