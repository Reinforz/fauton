import { convertInfixRegexToPostfix } from "../libs/utils/convertInfixRegexToPostfix";

describe('convertInfixRegexToPostfix', () => { 
  it(`Work for simple single operator regex without parenthesis`, () => {
    const postfixRegexString = convertInfixRegexToPostfix("a|b");
    expect(postfixRegexString).toBe("ab|")
  })

  // it(`Work for simple multi operator regex without parenthesis`, () => {
  //   const postfixRegexString1 = convertInfixRegexToPostfix("a|b?");
  //   const postfixRegexString2 = convertInfixRegexToPostfix("a?b|c");
  //   expect(postfixRegexString1).toBe("ab?|")
  //   expect(postfixRegexString2).toBe("ab?|")
  // })
})