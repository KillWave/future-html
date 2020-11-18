
import { TemplateResult } from './result'
import { Fragment } from './interfaces'
import { render } from './render'
export const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
export const marker = "$future$";

export const containerMap = new WeakMap<Node, TemplateResult>();


export function startWidth(name: string) {
  return name.slice(0, 8) === marker;
}

export function valueInstanceofto(value: unknown, arr: Fragment[], attributeMatch: any, htmlFragment?: string) {
  let fragment: Fragment = { value: null }
  if (value instanceof TemplateResult) {
    //result
    const box = document.createDocumentFragment();
    render(value, box);
    fragment.value = value;
    fragment.el = box.childNodes[0];
  } else if (value instanceof Node) {
    //node
    fragment.el = value;
    fragment.value = value;
  } else {
    //test
    if (htmlFragment) {
      fragment.strings = !!attributeMatch ? newTemplateStringsArray(htmlFragment, marker) : newTemplateStringsArray(htmlFragment, `<!--${marker}-->`);
      fragment.value = value;
    } else {
      fragment.el = document.createTextNode(<string>value);
      fragment.value = value;
    }

  }
  arr.push(fragment);

}

function newTemplateStringsArray(str: string, comment: string): TemplateStringsArray {
  const arr: any = [str + comment, ''];
  arr.raw = [str + comment, ''];
  return arr;
}
