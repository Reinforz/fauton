import { parseWithLL1Table } from "../libs/parseWithLL1Table";

describe('parseWithLL1Table', () => { 
  it(`Parsable string`, () => {
    const {parsed, derivations} = parseWithLL1Table({
      productionRules: {
        S: ["A A"],
        A: ["a A", "b"],
      }
    }, "abab")
    expect(derivations).toStrictEqual([
      ["S", ["A", "A"]],
      ["A", ["a", "A"]],
      ["A", ["b"]],
      ["A", ["a", "A"]],
      ["A", ["b"]]
    ])
    expect(parsed).toBe(true)
  })

  it(`Unparsable string`, () => {
    const {parsed, derivations} = parseWithLL1Table({
      productionRules: {
        S: ["A A"],
        A: ["a A", "b"],
      }
    }, "aba")
    expect(derivations).toStrictEqual([
      ["S", ["A", "A"]],
      ["A", ["a", "A"]],
      ["A", ["b"]],
      ["A", ["a", "A"]]
    ])
    expect(parsed).toBe(false)
  })
})