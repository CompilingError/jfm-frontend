import path from 'node:path';

const DEFAULT_PARSE_RULES = [
  {
    key: 'catalog-code',
    pattern: '(^|[^A-Za-z0-9])([A-Za-z][A-Za-z0-9]{1,9})-(\\d{1,10})(?!\\d)',
    defaultTagNames: ['Jav'],
  },
];

function removeExtension(fileName) {
  const extension = path.extname(fileName);

  if (!extension) {
    return fileName;
  }

  return fileName.slice(0, -extension.length);
}

function normalizeCatalogCode(match) {
  const prefix = match[2].toUpperCase();
  const number = match[3];

  return `${prefix}-${number}`;
}

export function parseFileName(fileName, rules = DEFAULT_PARSE_RULES) {
  const nameWithoutExtension = removeExtension(fileName);

  for (const rule of rules) {
    const regex = new RegExp(rule.pattern, 'i');
    const match = nameWithoutExtension.match(regex);

    if (!match) {
      continue;
    }

    return {
      originalName: nameWithoutExtension,
      parsedName: normalizeCatalogCode(match),
      matchedRuleKey: rule.key,
      defaultTagNames: rule.defaultTagNames,
      matched: true,
    };
  }

  return {
    originalName: nameWithoutExtension,
    parsedName: nameWithoutExtension,
    matchedRuleKey: null,
    defaultTagNames: [],
    matched: false,
  };
}