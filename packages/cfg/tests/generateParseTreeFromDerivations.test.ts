import { generateParseTreeFromDerivations } from "../libs/generateParseTreeFromDerivations";

describe('generateParseTreeFromDerivations', () => {
  it(`Parse tree from derivations`, () => {
    const parseTree = generateParseTreeFromDerivations(["S", "A"], [
      ["S", ["A", "A"]],
      ["A", ["a", "A"]],
      ["A", ["b"]],
      ["A", ["a", "A"]],
      ["A", ["b"]]
    ])
    expect(parseTree).toStrictEqual({
      S: [
        {
          "A": [
            "a",
            {
              "A": ["b"]
            }
          ]
        },
        {
          "A": [
            "a",
            {
              "A": ["b"]
            }
          ]
        }
      ]
    })
  })
})