import { generateLL1ParsingTable } from "../libs/generateLL1ParsingTable";

describe('first', () => { 
  it(`Complex grammar`, () => {
    expect(generateLL1ParsingTable({
      productionRules: {
        E: ["T E'"],
        "E'": ["+ T E'", ""],
        T: ["F T'"],
        "T'": ["* F T'", ""],
        F: ["id", "( E )"]
      },
    })).toStrictEqual({
      E: {
        id: [0],
        "+": [],
        "*": [],
        "(": [0],
        ")": [],
        "$": []
      },
      "E'": {
        id: [],
        "+": [0],
        "*": [],
        "(": [],
        ")": [1],
        "$": [1]
      },
      "T": {
        id: [0],
        "+": [],
        "*": [],
        "(": [0],
        ")": [],
        "$": []
      },
      "T'": {
        id: [],
        "+": [1],
        "*": [0],
        "(": [],
        ")": [1],
        "$": [1]
      },
      "F": {
        id: [0],
        "+": [],
        "*": [],
        "(": [1],
        ")": [],
        "$": []
      }
    })
  })
})