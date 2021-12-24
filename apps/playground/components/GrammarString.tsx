import { convertGrammarToString, IContextFreeGrammar } from "@fauton/cfg";

interface GrammarStringProps {
  productionRules: IContextFreeGrammar["productionRules"]
}

export function GrammarString(props: GrammarStringProps) {
  const { productionRules } = props;
  return <div className="">
    {convertGrammarToString(productionRules)}
  </div>
}