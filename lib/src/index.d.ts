import { TemplateResult } from './result';
export * from './interfaces';
export declare const html: (strings: TemplateStringsArray, ...values: unknown[]) => TemplateResult;
export { render, destroy } from './render';
