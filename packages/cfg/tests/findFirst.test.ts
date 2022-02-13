import { findFirst } from "../libs/findFirst";

describe('findFirst', () => { 
  it(`Terminal producing rules`, () => {
    expect(findFirst({
      productionRules: {
        C: ["a D", "b C", ""],
        D: ["a"],
        E: ["a b c"]
      }
    })).toStrictEqual({
      C: ["a", "b", ""],
      D: ["a"],
      E: ["a"]
    })
  })

  it(`Variable producing rules`, () => {
    expect(findFirst({
      productionRules: {
        S: ["A B C", "g h i", "j k l"],
        A: ["a", "b", "c"],
      }
    })).toStrictEqual({
      S: ["a", "b", "c", "g", "j"],
      A: ["a", "b", "c"],
    })
  })

  it(`Terminal + Variable + Epsilon producing rules`, () => {
    expect(findFirst({
      productionRules: {
        S: ["A B C g"],
        A: ["a", "b", ""],
        B: ["c", "d", ""],
        C: ["e", "f", ""],
      }
    })).toStrictEqual({
      S: ["a", "b", "", "c", "d", "e", "f", "g"],
      A: ["a", "b", ""],
      B: ["c", "d", ""],
      C: ["e", "f", ""],
    })
  })

  it(`Multiple Terminal + Multiple Variable + Epsilon producing rules`, () => {
    expect(findFirst({
      productionRules: {
        E: ["T E'"],
        "E'": ["* T E'", ""],
        T: ["F T'"],
        "T'": ["", "+ F T'"],
        "F": ["", "id", "( E"],
      }
    })).toStrictEqual({
      E: ["", "id", "(", "+", "*"],
      "E'": ["*", ""],
      T: ["", "id", "(", "+"],
      "T'": ["", "+"],
      F: ["", "id", "("]
    })
  })
})