import { IContextFreeGrammar } from "@fauton/cfg";
import { MouseEventHandler, useState } from "react";

interface IconProps {
  onClick: MouseEventHandler<SVGSVGElement>
  size?: number
}

function AddIcon(props: IconProps) {
  const { onClick, size = ".75em" } = props;
  return <svg className="cursor-pointer hover:scale-110 transition-transform duration-150 " onClick={onClick} stroke="currentColor" fill="#4fcf67" strokeWidth="0" viewBox="0 0 512 512" height={size} width={size} xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"></path></svg>
}

function DeleteIcon(props: IconProps) {
  const { onClick, size = ".75em" } = props;
  return <svg onClick={onClick} className="cursor-pointer hover:scale-110 transition-transform duration-150 " stroke="currentColor" fill="#fa2e4a" strokeWidth="0" viewBox="0 0 24 24" height={size} width={size} xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
}

function Button(props: { className?: string, label: string, onClick?: MouseEventHandler<HTMLDivElement> }) {
  const { onClick, label, className = "" } = props;
  return <div className={`${className} hover:scale-105 transition-transform duration-150 capitalize text-lg text-center shadow-md cursor-pointer p-2 px-4 font-bold bg-gray-800 w-[fit-content] rounded-md`} onClick={onClick}>
    {label}
  </div>
}

const Index = () => {
  const [contextFreeGrammars, setContextFreeGrammars] = useState<IContextFreeGrammar[]>([]);

  const [currentSelectedGrammar, setCurrentSelectedGrammar] = useState<IContextFreeGrammar | null>(null);

  const [cfgProductionRules, setCfgProductionRules] = useState<Array<{
    variable: string,
    substitutions: string[][]
  }>>([{
    variable: "S",
    substitutions: []
  }]);

  return <div className="p-3 text-white bg-gray-900 h-full w-full">
    <div className="flex gap-10 h-full">
      <div className="flex flex-col gap-3 bg-gray-900">
        <div className="text-center text-4xl font-bold">Grammars</div>
        <div className="flex flex-col gap-3">
          {contextFreeGrammars.length === 0 ? <div className="bg-gray-800 p-3 text-center rounded-sm">No Grammars created yet</div> : contextFreeGrammars.map((contextFreeGrammar, contextFreeGrammarIndex) => <Button onClick={() => setCurrentSelectedGrammar(contextFreeGrammar)} key={contextFreeGrammarIndex} label={`Grammar  ${contextFreeGrammarIndex + 1}`} />)}
        </div>
      </div>
      {JSON.stringify(currentSelectedGrammar)}

      <div className="flex flex-col gap-3 w-full overflow-auto px-5">
        <div className="text-4xl font-bold">Create</div>
        <div className="flex gap-3 flex-col justify-center text-2xl">
          {cfgProductionRules.map((productionRule, productionRuleIndex) =>
            <div className="flex gap-3 items-center" key={`rule-${productionRuleIndex}`}>
              <input placeholder="ε" onChange={(event) => {
                cfgProductionRules[productionRuleIndex]!.variable = event.target.value;
                setCfgProductionRules([...cfgProductionRules]);
              }} size={Math.max(productionRule.variable.length, 1)} value={productionRule.variable} className="font-bold rounded-sm bg-gray-800 outline-none px-3 py-1" />
              {(productionRule.substitutions.length !== 0) && <div className="flex gap-3">
                {productionRule.substitutions.map((productionRuleSubstitutionChunks, productionRuleSubstitutionIndex) => {
                  return productionRuleSubstitutionChunks.length !== 0 && <div className="flex p-2 text-sm gap-3 font-bold bg-gray-800 items-center rounded-sm" key={`rule-${productionRuleIndex}-substitution-${productionRuleSubstitutionIndex}`}>
                    {productionRuleSubstitutionChunks.map((productionRuleSubstitutionChunk, productionRuleSubstitutionChunkIndex) => {
                      return <div className="flex gap-1 items-center" key={`rule-${productionRuleIndex}-substitution-${productionRuleSubstitutionIndex}-chunk-${productionRuleSubstitutionChunkIndex}`}>
                        <DeleteIcon size={17.5} onClick={() => {
                          productionRuleSubstitutionChunks.splice(productionRuleSubstitutionChunkIndex, 1);
                          if (productionRuleSubstitutionChunks.length === 0) {
                            productionRule.substitutions.splice(productionRuleSubstitutionIndex, 1)
                          }
                          setCfgProductionRules([...cfgProductionRules]);
                        }} />
                        <input placeholder="ε" onChange={(event) => {
                          productionRuleSubstitutionChunks[productionRuleSubstitutionChunkIndex] = event.target.value;
                          setCfgProductionRules([...cfgProductionRules]);
                        }} size={Math.max(productionRuleSubstitutionChunk.length, 1)} value={productionRuleSubstitutionChunk} className="text-xl rounded-sm outline-none bg-gray-900 px-2" />
                      </div>
                    })}
                    <div className="flex items-center gap-1 rounded-sm">
                      <AddIcon size={17.5} onClick={() => {
                        productionRuleSubstitutionChunks.push("")
                        setCfgProductionRules([...cfgProductionRules]);
                      }} />
                      <DeleteIcon size={20} onClick={() => {
                        productionRule.substitutions.splice(productionRuleSubstitutionIndex, 1)
                        setCfgProductionRules([...cfgProductionRules]);
                      }} />
                    </div>
                  </div>
                })}
              </div>}
              <div className="flex gap-2 bg-gray-800 p-2 rounded-sm items-center">
                <AddIcon onClick={() => {
                  productionRule.substitutions.push([""])
                  setCfgProductionRules([...cfgProductionRules]);
                }} />
              </div>
            </div>)}
          <AddIcon onClick={() => {
            cfgProductionRules.push({
              variable: "",
              substitutions: []
            })
            setCfgProductionRules([...cfgProductionRules]);
          }} />
        </div>
        <Button className="my-4" onClick={() => {
          const convertedContextFreeGrammar: IContextFreeGrammar["productionRules"] = {};
          cfgProductionRules.forEach(cfgProductionRule => {
            convertedContextFreeGrammar[cfgProductionRule.variable] = cfgProductionRule.substitutions.map(substitution => substitution.join(" "))
          })
          setContextFreeGrammars([...contextFreeGrammars, {
            productionRules: convertedContextFreeGrammar,
            startVariable: "S",
            terminals: [],
            variables: []
          }])
        }} label="Add Grammar" />
      </div>
      <div className="px-5 flex flex-col gap-3 items-center h-full bg-gray-900 w-1/4 min-w-[350px]">
        <div className="text-center text-4xl font-bold">Modifiers</div>
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
      </div>
    </div>
  </div>;
};

export default Index;