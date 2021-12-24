import { IContextFreeGrammar } from "@fauton/cfg";
import { useState } from "react";
import { TGrammarOperations } from "../types";
import { AddIcon } from "./Icons";
import { Select } from "./Select";

interface GrammarLabProps {
  grammars: {
    label: string,
    grammar: IContextFreeGrammar
  }[]
}

const grammarOperationsSelectItems = {
  remove_null: "Remove Null",
  remove_unit: "Remove Unit",
  remove_empty: "Remove Empty",
  remove_useless: "Remove Useless",
  remove_unreachable: "Remove Unreachable",
  remove_non_terminable: "Remove Non terminable"
};

export function GrammarPipeline(props: GrammarLabProps) {
  const { grammars } = props;
  const [currentSelectedGrammar, setCurrentSelectedGrammar] = useState<{
    label: string,
    grammar: IContextFreeGrammar
  } | null>(null);

  const [grammarOperations, setGrammarOperations] = useState<TGrammarOperations[]>([]);

  const grammarLabelRecord: Record<string, string> = {};
  grammars.forEach(({ label }) => {
    grammarLabelRecord[label] = label
  });

  return <div className="bg-gray-800 h-full flex flex-col gap-5 w-1/2 p-5 rounded-sm">
    <div className="text-4xl font-bold">Pipelines</div>
    <Select valueLabelRecord={grammarLabelRecord} onChange={(event) => {
      const selectedGrammar = grammars.find(({ label }) => label === event.target.value);
      setCurrentSelectedGrammar(selectedGrammar ?? null);
    }} value={currentSelectedGrammar ? currentSelectedGrammar.label : undefined} />
    {
      grammarOperations.map((grammarOperation, grammarOperationIndex) => <Select key={`${grammarOperation}.${grammarOperationIndex}`} value={grammarOperation} onChange={(event) => {
        setGrammarOperations([...grammarOperations, event.target.value])
      }} valueLabelRecord={grammarOperationsSelectItems} />)
    }
    <div className="flex justify-center">
      <AddIcon size={25} onClick={() => {
        setGrammarOperations([...grammarOperations, "remove_null"])
      }} />
    </div>
  </div>
}