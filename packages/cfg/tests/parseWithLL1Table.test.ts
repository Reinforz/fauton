import { parseWithLL1Table } from "../libs/parseWithLL1Table";

describe('parseWithLL1Table', () => { 
  it(`Parsable string`, () => {
    const isParsable = parseWithLL1Table({
      productionRules: {
        S: ["A A"],
        A: ["a A", "b"],
      }
    }, "abab")
    expect(isParsable).toBe(true)
  })

  it(`Unparsable string`, () => {
    const isParsable = parseWithLL1Table({
      productionRules: {
        S: ["A A"],
        A: ["a A", "b"],
      }
    }, "aba")
    expect(isParsable).toBe(false)
  })
})