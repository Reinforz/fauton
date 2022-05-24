import { addConcatOperatorToRegex } from "../libs/utils/addConcatOperatorToRegex";

describe('addConcatOperatorToRegex', () => { 
  it(`Single length regex string`, () => {
    const concatOperatorAddedRegexString = addConcatOperatorToRegex("a");
    expect(concatOperatorAddedRegexString).toBe("a")
  })

  it(`Multi length regex string (between two literals)`, () => {
    const concatOperatorAddedRegexString = addConcatOperatorToRegex("ab");
    expect(concatOperatorAddedRegexString).toStrictEqual("a.b")
  })

  it(`Multi length regex string (between two opposite brackets)`, () => {
    const concatOperatorAddedRegexString = addConcatOperatorToRegex(")(");
    expect(concatOperatorAddedRegexString).toStrictEqual(").(")
  })

  it(`Multi length regex string (between literal and left bracket)`, () => {
    const concatOperatorAddedRegexString = addConcatOperatorToRegex("a(");
    expect(concatOperatorAddedRegexString).toStrictEqual("a.(")
  })

  it(`Multi length regex string (between operator and left bracket)`, () => {
    const concatOperatorAddedRegexString = addConcatOperatorToRegex("+(");
    expect(concatOperatorAddedRegexString).toStrictEqual("+.(")
  })

  it(`Multi length regex string (between operator and literal)`, () => {
    const concatOperatorAddedRegexString = addConcatOperatorToRegex("+a");
    expect(concatOperatorAddedRegexString).toStrictEqual("+.a")
  })
})