import { IContextFreeGrammar } from "@fauton/cfg";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { blue, red } from "@mui/material/colors";
import { useContext, useEffect, useState } from "react";
import { RootContext } from "../contexts";
import { TGrammarOperations } from "../types";
import { Button } from "./Button";
import { GrammarPipelineResult } from "./GrammarPipelineResult";
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
  const { currentSelectedGrammar, setCurrentSelectedGrammar } = useContext(RootContext);

  const [executePipelineOperations, setExecutePipelineOperations] = useState(false);

  const [grammarOperations, setGrammarOperations] = useState<TGrammarOperations[]>([]);

  const grammarOperationsString = grammarOperations.join(",");

  useEffect(() => {
    setExecutePipelineOperations(false);
  }, [grammarOperationsString, currentSelectedGrammar])

  const grammarLabelRecord: Record<string, string> = {};
  grammars.forEach(({ label }) => {
    grammarLabelRecord[label] = label
  });

  return <div className="bg-gray-800 h-full flex gap-5 p-5 rounded-sm">
    <div className="w-1/2 flex flex-col gap-5 h-full">
      <div className="text-4xl font-bold">Pipeline</div>
      <Select className="w-full" valueLabelRecord={grammarLabelRecord} onChange={(event) => {
        const selectedGrammar = grammars.find(({ label }) => label === event.target.value);
        setCurrentSelectedGrammar(selectedGrammar ?? null);
      }} value={currentSelectedGrammar ? currentSelectedGrammar.label : "No grammar selected"} />
      <div className="overflow-auto flex flex-col gap-3 px-3">
        {
          grammarOperations.map((grammarOperation, grammarOperationIndex) => <div className="flex justify-between gap-3 items-center" key={`${grammarOperation}.${grammarOperationIndex}`} >
            <InfoOutlinedIcon className="cursor-pointer" sx={{
              fill: blue[500],
            }} />
            <Select className="w-full" value={grammarOperation} onChange={(event) => {
              grammarOperations[grammarOperationIndex] = event.target.value
              setGrammarOperations([...grammarOperations])
            }} valueLabelRecord={grammarOperationsSelectItems} />
            <DeleteIcon className="cursor-pointer" sx={{
              fill: red[500]
            }} onClick={() => {
              grammarOperations.splice(grammarOperationIndex, 1);
              setGrammarOperations([...grammarOperations])
            }} />
          </div>)
        }
      </div>
      {currentSelectedGrammar && <div className="flex justify-center">
        <AddIcon size={25} onClick={() => {
          setGrammarOperations([...grammarOperations, "remove_null"])
        }} />
      </div>}
      {grammarOperations.length !== 0 && <div className="flex justify-center">
        <Button className="bg-gray-900" label="Process" onClick={() => {
          setExecutePipelineOperations(true)
        }} />
      </div>}
    </div>
    <div className="h-full w-1/2 rounded-sm">
      <GrammarPipelineResult start={executePipelineOperations} operations={grammarOperations} cfg={currentSelectedGrammar?.grammar} />
    </div>
  </div>
}