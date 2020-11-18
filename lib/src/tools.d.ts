import { TemplateResult } from './result';
import { Fragment } from './interfaces';
export declare const lastAttributeNameRegex: RegExp;
export declare const marker = "$future$";
export declare const containerMap: WeakMap<Node, TemplateResult>;
export declare function startWidth(name: string): boolean;
export declare function valueInstanceofto(value: unknown, arr: Fragment[], attributeMatch: any, htmlFragment?: string): void;
