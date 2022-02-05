import { convertGrammarToString, IContextFreeGrammar } from "@fauton/cfg";

interface GrammarStringProps {
  productionRules: IContextFreeGrammar["productionRules"]
}

export function GrammarString(props: GrammarStringProps) {
  const { productionRules } = props;
  const grammarStringLines = convertGrammarToString(productionRules);
  return <div className="flex flex-col text-xl bg-gray-800 p-5 rounded-md">
    {grammarStringLines.map((grammarStringLine, grammarStringLineIndex) => <span key={`line-${grammarStringLineIndex}`}>{grammarStringLine}</span>)}
  </div>
}