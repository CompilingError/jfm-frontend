import { zh } from './zh.js';

const currentMessages = zh;

function getNestedValue(object, path) {
  return path.split('.').reduce((current, key) => {
    if (!current) {
      return undefined;
    }

    return current[key];
  }, object);
}

function interpolate(template, params = {}) {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
    return params[key] ?? '';
  });
}

export function t(key, params = {}) {
  const value = getNestedValue(currentMessages, key);

  if (!value) {
    return key;
  }

  if (typeof value !== 'string') {
    return key;
  }

  return interpolate(value, params);
}