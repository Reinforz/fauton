import { setCrossProduct } from "../../libs/utils/setOperations"

describe('setCrossProduct', () => { 
  it(`Set cross product`, () => {
    expect(Array.from(setCrossProduct(new Set(), new Set()))).toStrictEqual([])
  })
})