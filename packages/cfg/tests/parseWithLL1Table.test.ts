import { parseWithLL1Table } from "../libs/parseWithLL1Table";

describe('parseWithLL1Table', () => { 
  it(`Parsable string`, () => {
    expect(parseWithLL1Table({
      productionRules: {
        S: ["A A"],
        A: ["a A", "b"],
      }
    }, "abab")).toBe(true)
  })

  it(`Unparsable string`, () => {
    expect(parseWithLL1Table({
      productionRules: {
        S: ["A A"],
        A: ["a A", "b"],
      }
    }, "aba")).toBe(false)
  })
})