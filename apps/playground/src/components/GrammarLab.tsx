import { IContextFreeGrammar } from "@fauton/cfg";
import { useState } from "react";
import { GrammarPipelineStep } from "../types";
import { Select } from "./Select";

interface GrammarLabProps {
  grammars: IContextFreeGrammar[]
}

export function GrammarLab(props: GrammarLabProps) {
  const { grammars } = props;
  const [currentSelectedGrammar, setCurrentSelectedGrammar] = useState<IContextFreeGrammar | null>(null);
  const [grammarPipelines, setGrammarPipelines] = useState<GrammarPipelineStep[]>([])
  return <div className="bg-gray-800 h-full w-1/2 p-5 rounded-sm">
    <div className="text-4xl font-bold">Pipelines</div>
    <Select items={grammars.map((_, index) => `Grammar ${index + 1}`)} selectedItem={""} />
    {/* <div className="flex flex-col gap-3 bg-gray-900">
      <div className="text-center text-4xl font-bold">Grammars</div>
      <div className="flex flex-col gap-3">
        {grammars.length === 0 ? <div className="bg-gray-800 p-3 text-center rounded-sm">No Grammars created yet</div> : grammars.map((grammar, grammarIndex) => <Button onClick={() => setCurrentSelectedGrammar(grammar)} key={grammarIndex} label={`Grammar  ${grammarIndex + 1}`} />)}
      </div>
    </div> */}
    {/* <div className="px-5 flex flex-col gap-3 items-center h-full bg-gray-900 w-1/4 min-w-[350px]">
      <div className="text-center text-4xl font-bold">Operations</div>
      <div className="flex flex-col gap-3 overflow-auto px-5 items-center" style={{ height: "calc(100% - 100px)" }}>
        <Button label='Convert to CNF' />
        <Button label='CYK Table' />
        <Button label='Remove Null' />
        <Button label='Remove Unit' />
        <Button label='Remove Empty' />
        <Button label='Remove Useless' />
        <Button label='Remove Unreachable' />
        <Button label='Remove Non terminable' />
      </div>
    </div> */}
  </div>
}