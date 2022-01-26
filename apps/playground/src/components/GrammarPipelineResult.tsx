import { IContextFreeGrammar, removeEmptyProduction, removeNonTerminableProduction, removeNullProduction, removeUnitProduction, removeUnreachableProduction } from "@fauton/cfg";
import { GrammarPipelineStep, TGrammarOperations } from "../types";
import { GrammarString } from "./GrammarString";

interface GrammarPipelineResultProps {
  operations: TGrammarOperations[]
  cfg?: IContextFreeGrammar | null
  start?: boolean
}

export function GrammarPipelineResult(props: GrammarPipelineResultProps) {
  const { operations, cfg, start } = props;

  function render() {
    const className = "bg-gray-900 text-lg font-bold h-full flex justify-center items-center"
    if (!cfg) {
      return <div className={className}>No cfg selected</div>
    }
    if (operations.length === 0) {
      return <div className={className}>Add a few operations</div>
    }
    if (!start) {
      return <div className={className}>Pipeline is not being processed</div>
    }
    const steps: GrammarPipelineStep[] = [];
    operations.forEach((operation, operationNumber) => {
      const inputGrammar = operationNumber === 0 ? cfg : steps[steps.length - 1]?.output!
      const duplicateGrammar = JSON.parse(JSON.stringify(cfg)) as IContextFreeGrammar;
      switch (operation) {
        case "remove_null": {
          removeNullProduction(duplicateGrammar);
          break;
        }
        case "remove_empty": {
          removeEmptyProduction(duplicateGrammar);
          break;
        }
        case "remove_non_terminable": {
          removeNonTerminableProduction(duplicateGrammar);
          break;
        }
        case "remove_unit": {
          removeUnitProduction(duplicateGrammar);
          break;
        }
        case "remove_unreachable": {
          removeUnreachableProduction(duplicateGrammar);
          break;
        }
        case "remove_useless": {
          removeUnreachableProduction(duplicateGrammar);
          break;
        }
        default: {
          // 
        }
      }
      steps.push({
        input: inputGrammar,
        output: duplicateGrammar,
        operation
      })
    });
    return steps.map((step, stepNumber) => <GrammarString key={`${step.operation}.${stepNumber}`} productionRules={step.output.productionRules} />)
  }

  return <div className="h-full">
    {render()}
  </div>
}