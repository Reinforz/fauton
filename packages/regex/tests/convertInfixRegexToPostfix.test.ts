import { convertInfixRegexToPostfix } from "../libs/utils/convertInfixRegexToPostfix";

describe('convertInfixRegexToPostfix', () => { 
  it(`Work for single operator regex without parenthesis`, () => {
    const postfixRegexString = convertInfixRegexToPostfix("a|b");
    expect(postfixRegexString).toBe("ab|")
  })

  it(`Work for multi operator regex without parenthesis`, () => {
    const postfixRegexString1 = convertInfixRegexToPostfix("a?.b");
    const postfixRegexString2 = convertInfixRegexToPostfix("a?+b");
    expect(postfixRegexString1).toBe("a?b.")
    expect(postfixRegexString2).toBe("ab+?")
  })

  it(`Work for multi operator regex with parenthesis`, () => {
    const postfixRegexString1 = convertInfixRegexToPostfix("(a?.b)");
    expect(postfixRegexString1).toBe("a?b.")
  })

  it(`Work for multi operator regex with mismatched parenthesis`, () => {
    const postfixRegexString1 = convertInfixRegexToPostfix("(a?.b");
    expect(postfixRegexString1).toBe("a?b.")
  })
})