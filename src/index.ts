import { TemplateResult } from './result'
export * from './interfaces'
export const html = ((strings: TemplateStringsArray, ...values: unknown[]) => new TemplateResult(strings, values));
export {render,destroy} from './render'