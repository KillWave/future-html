
import {Process} from './process'
export const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
export const marker = `{{${String(Math.random()).slice(2)}}}`;
export const boundAttributeSuffix = "$future$";
export const nodeMarker = `<!--${marker}-->`;
export const containerMap = new WeakMap<Node, Process>();
export const deleteSuffix = (str: string, suffix: string) => {
  const index = str.length - suffix.length;
  return str.slice(0, index);
};
export const endsWith = (str: string, suffix: string) => {
  const index = str.length - suffix.length;
  return index >= 0 && str.slice(index) === suffix;
};
export const diff = (newData: unknown, oldData: unknown) => {
  if (newData === oldData) {
    return false;
  } else {
    return true;
  }
};
