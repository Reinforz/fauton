import { findFollow } from "../libs/findFollow";

describe('findFollow', () => {
  it(`Simple grammar where next token is terminal`, () => {
    expect(findFollow({
      productionRules: {
        S: ["B b", "C d"],
        B: ["a B c", ""],
        C: ["c C a", ""]
      },
      startVariable: "S"
    })).toStrictEqual({
      S: ["$"],
      B: ["b", "c"],
      C: ["d", "a"]
    })
  })

  it(`Simple grammar where next token is a variable (non edge and non null)`, () => {
    expect(findFollow({
      productionRules: {
        S: ["B b", "C d"],
        B: ["a B C"],
        C: ["c C a"]
      },
      startVariable: "S"
    })).toStrictEqual({
      S: ["$"],
      B: ["b", "c"],
      C: ["d","b", "c", "a"]
    })
  })

  it(`Simple grammar where next token is a variable (non edge and nullable)`, () => {
    expect(findFollow({
      productionRules: {
        S: ["B b", "C d"],
        B: ["a B C"],
        C: ["c C a", ""]
      },
      startVariable: "S"
    })).toStrictEqual({
      S: ["$"],
      B: ["b", "c"],
      C: ["d","b", "c", "a"]
    })
  })

  it(`Simple grammar where next token is a variable (edge and non null)`, () => {
    expect(findFollow({
      productionRules: {
        S: ["B b", "C d"],
        C: ["c C"],
        B: ["a C"],
      },
      startVariable: "S"
    })).toStrictEqual({
      S: ["$"],
      B: ["b"],
      C: ["d", "b"]
    })
  })
})