import { addDotToProductionRule, augmentCfg, generateClosureOfLR0Item } from "../libs/generateLR0ParsingTable";

describe('addDotToProductionRule', () => { 
  it(`Simple grammar`, () => {
    const productionRules = {
      S: ["A A"],
      A: ["a A", "b"]
    };
    
    addDotToProductionRule(productionRules, "S")

    expect(productionRules).toStrictEqual({
      S: ["$.$ A A"],
      A: ["a A", "b"]
    })
  })
})

describe('generateClosureOfLR0Item', () => { 
  it(`Simple grammar`, () => {
    const productionRules = {
      "S'": ["$.$ S"],
      S: ["A A"],
      A: ["a A", "b"]
    };
    
    generateClosureOfLR0Item({
      productionRules,
      variables: ["S'", "S", "A"]
    }, "S'")

    expect(productionRules).toStrictEqual({
      "S'": ["$.$ S"],
      S: ["$.$ A A"],
      A: ["$.$ a A", "$.$ b"]
    })
  })
})

describe('augmentCfg', () => { 
  it(`Simple grammar`, () => {
    const augmentedGrammar = augmentCfg({
      productionRules: {
        S: ["A a", "B"],
        A: ["a b"],
        B: ["S a"]
      },
    })

    expect(augmentedGrammar).toStrictEqual({
      productionRules: {
        "S'": ["S"],
        S: ["A a", "B"],
        A: ["a b"],
        B: ["S a"]
      },
      variables: [ "S'", "S", "A", "B"],
      startVariable: "S'",
      terminals: ["a", "b"]
    })
  })
})