import { IContextFreeGrammar } from '@fauton/cfg';
import { useState } from 'react';
import { UserInputGrammar } from '../types';

export function useGrammarInput() {
	const [userInputGrammar, setUserInputGrammar] = useState<UserInputGrammar>({
		label: '',
		rules: [
			{
				variable: 'S',
				substitutions: [],
			},
		],
	});

	const productionRules: IContextFreeGrammar['productionRules'] = {};
	userInputGrammar.rules.forEach((userInputGrammarRule) => {
		if (!productionRules[userInputGrammarRule.variable]) {
			productionRules[userInputGrammarRule.variable] = [];
		}
		userInputGrammarRule.substitutions.forEach((substitution) => {
			productionRules[userInputGrammarRule.variable]?.push(substitution.join(' '));
		});
	});

	return {
		productionRules,
		userInputGrammar,
		addRule: () => {
			userInputGrammar.rules.push({
				variable: '',
				substitutions: [],
			});
			setUserInputGrammar({ ...userInputGrammar });
		},
		addSubstitution(ruleIndex: number) {
			if (userInputGrammar.rules[ruleIndex]) {
				userInputGrammar.rules[ruleIndex]!.substitutions.push(['']);
				setUserInputGrammar({ ...userInputGrammar });
			}
		},
		addToken(tokens: string[]) {
			tokens.push('');
			setUserInputGrammar({ ...userInputGrammar });
		},
		updateToken(ruleIndex: number, substitutionIndex: number, tokenIndex: number, value: string) {
			const substitution = userInputGrammar.rules[ruleIndex]?.substitutions[substitutionIndex];
			if (substitution && substitution.length > tokenIndex) {
				substitution![tokenIndex] = value;
				setUserInputGrammar({ ...userInputGrammar });
			}
		},
		updateRuleVariable(ruleIndex: number, value: string) {
			const rule = userInputGrammar.rules[ruleIndex];
			if (rule && value) {
				rule.variable = value;
				setUserInputGrammar({ ...userInputGrammar });
			}
		},
		removeToken(ruleIndex: number, substitutionIndex: number, tokenIndex: number) {
			const substitutions = userInputGrammar.rules[ruleIndex]?.substitutions;
			if (substitutions) {
				const tokens = substitutions[substitutionIndex];
				if (tokens) {
					tokens.splice(tokenIndex, 1);
					if (tokens.length === 0) {
						substitutions.splice(substitutionIndex, 1);
					}
					setUserInputGrammar({ ...userInputGrammar });
				}
			}
		},
		removeSubstitution(ruleIndex: number, substitutionIndex: number) {
			const substitutions = userInputGrammar.rules[ruleIndex]?.substitutions;
			if (substitutions) {
				substitutions.splice(substitutionIndex, 1);
				setUserInputGrammar({ ...userInputGrammar });
			}
		},
		removeRule(ruleIndex: number) {
			userInputGrammar.rules.splice(ruleIndex, 1);
			setUserInputGrammar({ ...userInputGrammar });
		},
		resetState() {
			setUserInputGrammar({
				label: '',
				rules: [
					{
						variable: 'S',
						substitutions: [],
					},
				],
			});
		},
	};
}
