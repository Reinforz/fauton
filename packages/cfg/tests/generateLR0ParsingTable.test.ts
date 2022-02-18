import { addDotToProductionRule, generateClosureOfLR0Item } from "../libs/generateLR0ParsingTable";

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
      startVariable: "S'",
      terminals: ["a", "b"],
      variables: ["S'", "S", "A"]
    }, "S'")

    expect(productionRules).toStrictEqual({
      "S'": ["$.$ S"],
      S: ["$.$ A A"],
      A: ["$.$ a A", "$.$ b"]
    })
  })
})