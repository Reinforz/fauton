import fs from 'fs/promises';
import path from 'path';
import ts, {
	ArrowFunction,
	Block,
	CallExpression,
	ExpressionStatement,
	Identifier,
	PropertyAccessExpression,
	StringLiteral,
	VariableDeclaration,
	VariableDeclarationList,
	VariableStatement,
} from 'typescript';

const testFilesDirectory = path.resolve(__dirname, '../tests');

function functionChecker(
	expressionStatement: ExpressionStatement,
	functionName: string,
	cb: (describeFunctionCallExpression: CallExpression) => void
) {
	function checker(describeFunctionCallExpression: CallExpression) {
		if (describeFunctionCallExpression.kind === 207) {
			const identifier = describeFunctionCallExpression.expression as
				| Identifier
				| PropertyAccessExpression;
			if (identifier.kind === 79 && identifier.escapedText === functionName) {
				cb(describeFunctionCallExpression);
			} else if (identifier.kind === 205) {
				checker(identifier.expression as CallExpression);
			}
		}
	}

	if (expressionStatement.kind === 237) {
		const functionExpression = expressionStatement.expression as CallExpression;
		checker(functionExpression);
	}
}

// Check if the first argument is a string and second argument is an anonymous function expression
function argumentsChecker(
	callExpression: ts.CallExpression,
	cb: (stringArgument: StringLiteral, arrowFunctionArgument: ArrowFunction) => void
) {
	const stringLiteral = callExpression.arguments[0] as StringLiteral;
	if (stringLiteral.kind === 10 || stringLiteral.kind === 14) {
		const arrowFunction = callExpression.arguments[1] as ArrowFunction;
		if (arrowFunction.kind === 213) {
			cb(stringLiteral, arrowFunction);
		}
	}
}

function variableChecker(
	variableStatement: VariableStatement,
	variableName: string,
	cb: (initializer: ts.Expression) => void
) {
	if (variableStatement.kind === 236) {
		const variableDeclarationList = variableStatement.declarationList as VariableDeclarationList;
		if (variableDeclarationList.kind === 254) {
			const variableDeclaration = variableDeclarationList.declarations[0] as VariableDeclaration;
			if (variableDeclaration.kind === 253) {
				const identifier = variableDeclaration.name as Identifier;
				if (identifier.escapedText === variableName && variableDeclaration.initializer) {
					cb(variableDeclaration.initializer);
				}
			}
		}
	}
}

async function main() {
	const testFiles = await fs.readdir(testFilesDirectory);
	const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

	for (let index = 0; index < testFiles.length; index++) {
		const testFile = testFiles[index];
		// Make sure its a test.ts file
		if (testFile.endsWith('test.ts')) {
			const testFilePath = path.join(testFilesDirectory, testFile);
			const program = ts.createProgram([testFilePath], {});
			const sourceFile = program.getSourceFile(testFilePath)!;
			for (let index = 0; index < sourceFile.statements.length; index++) {
				const statement = sourceFile.statements[index] as ExpressionStatement;
				functionChecker(statement, 'describe', (describeFunctionCallExpression) => {
					argumentsChecker(
						describeFunctionCallExpression,
						(describeFunctionFirstArgument, describeFunctionSecondArgument) => {
							const describeFunctionBlock = describeFunctionSecondArgument.body as Block;
							if (describeFunctionBlock.kind === 234) {
								// Loop through all the `it` function statements
								// And see which `it` has the same first argument as describe
								for (let index = 0; index < describeFunctionBlock.statements.length; index++) {
									const describeFunctionBlockStatement = describeFunctionBlock.statements[
										index
									] as ExpressionStatement;
									functionChecker(
										describeFunctionBlockStatement,
										'it',
										(itFunctionCallExpression) => {
											// Only if the first argument of it and describe are the same
											argumentsChecker(
												itFunctionCallExpression,
												(itFunctionFirstArgument, itFunctionSecondArgument) => {
													if (itFunctionFirstArgument.text === describeFunctionFirstArgument.text) {
														const itFunctionBlock = itFunctionSecondArgument.body as Block;
														if (itFunctionBlock.kind === 234) {
															// Find the expect function call
															for (
																let index = 0;
																index < itFunctionBlock.statements.length;
																index++
															) {
																const itFunctionBlockStatement = itFunctionBlock.statements[
																	index
																] as ExpressionStatement | VariableStatement;
																if (itFunctionBlockStatement.kind === 236) {
																	variableChecker(
																		itFunctionBlockStatement,
																		'expected',
																		(variableInitializer) => {
																			console.log(
																				printer.printNode(
																					ts.EmitHint.Unspecified,
																					variableInitializer,
																					sourceFile
																				)
																			);
																		}
																	);
																} else {
																	functionChecker(
																		itFunctionBlockStatement,
																		'expect',
																		(expectFunctionCallExpression) => {
																			console.log(
																				printer.printNode(
																					ts.EmitHint.Unspecified,
																					expectFunctionCallExpression.arguments[0],
																					sourceFile
																				)
																			);
																		}
																	);
																}
															}
														}
													}
												}
											);
										}
									);
								}
							}
						}
					);
				});
			}
		}
	}
}

main();
