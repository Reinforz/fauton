// Set of non literals and parenthesis symbols in a set
const nonLiteralSymbols = new Set('()*+?|.');
const parenthesisSymbols = new Set('()');
// A operator precedence and associativity map
const precedenceRecord: Map<string, [number, 'r' | 'l']> = new Map([
  ['*', [3, 'r']],
  ['+', [3, 'r']],
  ['?', [3, 'r']],
  ['.', [2, 'l']],
  ['|', [1, 'l']],
]);

/**
 * Compares the precedence between two passed operators
 * @param topOperatorSymbol Operator at the top of the stack
 * @param operatorSymbol Current operator in the regex string
 * @returns A boolean whether or not the operator should be added to postfix regex string
 */
function comparePrecedence(topOperatorSymbol: string, operatorSymbol: string) {
  if (parenthesisSymbols.has(topOperatorSymbol)) {
    return false;
  }

  // Get the precedence of the first operator
  const [topOperatorPrecedence] = precedenceRecord.get(topOperatorSymbol)!;
  // Get the precedence and associativity of the second operator
  const [operatorPrecedence, operatorAssociativity] = precedenceRecord.get(operatorSymbol)!;
  // If the associativity is left to right then return true if the 2nd operator's precedence is smaller or eq to 1st operator's precedence
  // For example 1Op: +, 2Op: |, | should be added to postfix string
  // 1Op: | 2Op: ., . shouldn't be added to postfix string
  if (operatorAssociativity === 'l') {
    return operatorPrecedence <= topOperatorPrecedence;
  }
  return operatorPrecedence < topOperatorPrecedence;
}

/**
 * Convert a regex string to postfix regex string
 * @param regexString Regex string to convert to postfix
 * @returns Postfix regex string
 */
export function convertInfixRegexToPostfix(regexString: string) {
  const operationsStack: string[] = [];
  // Final postfix regex string
  let postfixRegexString = '';

  for (let index = 0; index < regexString.length; index += 1) {
    const regexSymbol = regexString[index];
    // If its a literal
    if (!nonLiteralSymbols.has(regexSymbol)) {
      // Add it to postfix string, no need to add it to stack
      postfixRegexString += regexSymbol;
    } else if (regexSymbol === '(') {
      operationsStack.push(regexSymbol);
    } else if (regexSymbol === ')') {
      // Pop operator and add it to postfix string until we reach the last "("
      while (operationsStack.length > 0 && operationsStack[operationsStack.length - 1] !== '(') {
        postfixRegexString += operationsStack.pop();
      }
      // Pop "(" from stack
      operationsStack.pop();
    }
    // Processing symbols + | *
    // If the operator stack is empty
    else if (operationsStack.length === 0) {
      operationsStack.push(regexSymbol);
    }
    // If the operator stack is not empty
    else {
      // While there are operators in the stack
      while (operationsStack.length !== 0) {
        // Get the top operator from the stack
        const topOperatorSymbol = operationsStack[operationsStack.length - 1];
        const shouldAddToPostfixRegexString = comparePrecedence(topOperatorSymbol, regexSymbol);
        if (shouldAddToPostfixRegexString) {
          postfixRegexString += operationsStack.pop();
        } else {
          // If the precedence of top operator is greater than current operator, break the loop
          break;
        }
      }
      operationsStack.push(regexSymbol);
    }
  }

  // Loop through the remaining operators in the stack
  // Add them to the postfix regex string
  while (operationsStack.length !== 0) {
    const topOperatorSymbol = operationsStack.pop()!
    // There shouldn't be any parenthesis on the operator stack
    // If so this indicates a mismatched parenthesis error
    if (parenthesisSymbols.has(topOperatorSymbol)) {
      return postfixRegexString;
    }
    postfixRegexString += topOperatorSymbol;
  }
  return postfixRegexString;
}
