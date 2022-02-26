import { addConcatOperatorToRegex } from "../libs/utils/addConcatOperatorToRegex"
import { convertInfixRegexToPostfix } from "../libs/utils/convertInfixRegexToPostfix"
import { generateRegexTree } from "../libs/utils/generateRegexTree"

describe('generateRegexTree', () => {
  it(`Simple regex`, () => {
    const generatedRegexTree = generateRegexTree(addConcatOperatorToRegex(convertInfixRegexToPostfix("a|b?c*")))
    expect(generatedRegexTree).toStrictEqual({
      
    })
  })
})