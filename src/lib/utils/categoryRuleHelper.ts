import { Transaction } from '@prisma/client';

export type CategoryWrapped = {
  id: number;
  name: string;
  color: string;
  label: string;
  rules: CategoryRules;
  tag: boolean;
}

export type CategoryRulePair = {
  key: typeof RuleKeys[number] | string;
  value: string;
};

export type CategoryRule = {
  pairs: CategoryRulePair[];
};
export type CategoryRules = CategoryRule[];

export type RawCategoryRule = {
  keys: string[];
  values: string[];
};
export type RawCategoryRules = RawCategoryRule[];

export const RuleKeys = [
  'kind',
  'content',
  'amount',
  'amountSign',
] as const;

export const AmountSignValues = [
  '+',
  '-',
] as const;

export function convertCategoryRuleToRawCategoryRule(
  categoryRule: CategoryRule,
): RawCategoryRule {
  const { pairs } = categoryRule;
  const keys = pairs.map(({ key }) => key);
  const values = pairs.map(({ value }) => value);
  return { keys, values };
}

export function convertRawCategoryRuleToCategoryRule(
  rawCategoryRule: RawCategoryRule,
): CategoryRule {
  const { keys, values } = rawCategoryRule;
  const pairs = keys.map((key, index) => ({
    key: key,
    value: values[index],
  }));
  return { pairs };
}

export function convertCategoryRulesToRawCategoryRules(
  categoryRules: CategoryRules,
): RawCategoryRules {
  return categoryRules.map(convertCategoryRuleToRawCategoryRule);
}

export function convertRawCategoryRulesToCategoryRules(
  rawCategoryRules: RawCategoryRules,
): CategoryRules {
  return rawCategoryRules.map(convertRawCategoryRuleToCategoryRule);
}

export function checkRules(rules: CategoryRules, transaction: Transaction): boolean {
  for (const rule of rules) {
    if (checkRule(rule, transaction)) {
      return true;
    }
  }

  return false;
}

export function checkRule(rule: CategoryRule, transaction: Transaction): boolean {
  for (const pair of rule.pairs) {
    if (!checkRuleKey(pair, transaction)) {
      return false;
    }
  }

  return true;
}

export function checkRuleKey(pair: CategoryRulePair, transaction: Transaction): boolean {
  const { key, value } = pair;

  if (key === 'amountSign') {
    if (value === '+') {
      return transaction.amount > 0;
    } else if (value === '-') {
      return transaction.amount < 0;
    } else {
      throw new Error(`Invalid amount sign value: ${value}`);
    }
  } else if (key === 'amount') {
    return transaction.amount.toString() === value;
  } else {
    const match = transaction[key as keyof Transaction]!.toString().match(value);
    return match !== null;
  }
}