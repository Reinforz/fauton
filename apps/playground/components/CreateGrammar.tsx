import { useState } from "react";
import { UserInputGrammar } from "../types";
import { Button } from "./Button";
import { AddIcon, DeleteIcon } from "./Icons";

interface CreateGrammarProps {
  addGrammar: (userInputGrammar: Array<{
    variable: string,
    substitutions: string[][]
  }>) => void
}
export function CreateGrammar(props: CreateGrammarProps) {
  const { addGrammar } = props;

  const [cfgProductionRules, setCfgProductionRules] = useState<UserInputGrammar>([{
    variable: "S",
    substitutions: []
  }]);

  return <div className="flex flex-col gap-3 w-full overflow-auto px-5">
    <div className="text-4xl font-bold">Create</div>
    <div className="flex gap-3 flex-col justify-center text-2xl">
      {cfgProductionRules.map((productionRule, productionRuleIndex) =>
        <div className="flex gap-3 items-center" key={`rule-${productionRuleIndex}`}>
          <input placeholder="ε" onChange={(event) => {
            cfgProductionRules[productionRuleIndex]!.variable = event.target.value;
            setCfgProductionRules([...cfgProductionRules]);
          }} size={Math.max(productionRule.variable.length, 1)} value={productionRule.variable} className="font-bold text-2xl rounded-sm bg-gray-800 outline-none px-3 py-1" />
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
                    }} size={Math.max(productionRuleSubstitutionChunk.length, 1)} value={productionRuleSubstitutionChunk} className="text-base rounded-sm outline-none bg-gray-900 px-2 py-1" />
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
      addGrammar(cfgProductionRules);
      setCfgProductionRules([{
        variable: "S",
        substitutions: []
      }])
    }} label="Add Grammar" />
  </div>
}