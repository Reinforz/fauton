import { convertInfixRegexToPostfix } from "../libs/utils/convertInfixRegexToPostfix";

describe('convertInfixRegexToPostfix', () => { 
  it(`Work for simple regex`, () => {
    expect(convertInfixRegexToPostfix("a|b")).toBe("ab|")
  })
})