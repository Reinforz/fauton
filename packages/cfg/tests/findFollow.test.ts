import { findFollow } from "../libs/findFollow";

describe('findFollow', () => {
  it(`Grammar where next token is terminal`, () => {
    expect(findFollow({
      productionRules: {
        S: ["B b", "C d"],
        B: ["a B c", ""],
        C: ["c C a", ""]
      },
      startVariable: "S"
    }).follow).toStrictEqual({
      S: ["$"],
      B: ["b", "c"],
      C: ["d", "a"]
    })
  })

  it(`Grammar where next token is a variable (non edge and non null)`, () => {
    expect(findFollow({
      productionRules: {
        S: ["B b", "C d"],
        B: ["a B C"],
        C: ["c C a"]
      },
      startVariable: "S"
    }).follow).toStrictEqual({
      S: ["$"],
      B: ["b", "c"],
      C: ["d", "b", "c", "a"]
    })
  })

  it(`Grammar where next token is a variable (non edge and nullable)`, () => {
    expect(findFollow({
      productionRules: {
        S: ["B b", "C d"],
        B: ["a B C"],
        C: ["c C a", ""]
      },
      startVariable: "S"
    }).follow).toStrictEqual({
      S: ["$"],
      B: ["b", "c"],
      C: ["d", "b", "c", "a"]
    })
  })

  it(`Grammar where next token is a variable (edge and non null)`, () => {
    expect(findFollow({
      productionRules: {
        S: ["B b", "C d"],
        C: ["c C"],
        B: ["a C"],
      },
      startVariable: "S"
    }).follow).toStrictEqual({
      S: ["$"],
      B: ["b"],
      C: ["d", "b"]
    })
  })

  it(`Grammar where next token is a variable (edge and null)`, () => {
    expect(findFollow({
      productionRules: {
        S: ["i C t S S'", "a"],
        "S'": ["e S", ""],
        C: ["b"]
      },
    }).follow).toStrictEqual({
      "S": [
        "$",
        "e"
      ],
      "S'": [
        "$",
        "e"
      ],
      "C": [
        "t"
      ]
    })
  })

  it(`Grammar with recursion`, () => {
    expect(findFollow({
      productionRules: {
        S: ["a B", ""],
        B: ["b C", ""],
        C: ["c S", ""],
      },
    }).follow).toStrictEqual({
      "S": [
        "$"
      ],
      "B": [
        "$"
      ],
      "C": [
        "$"
      ]
    })
  })
})