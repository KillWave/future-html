import { TemplateResult } from './result'
export {render,destroy} from './render'
export * from './interfaces'
export const html = (strings: TemplateStringsArray, ...values: unknown[]) => new TemplateResult(strings, values);