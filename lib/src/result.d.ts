export declare class TemplateResult {
    private fragments;
    closeHtml: string;
    values: unknown[];
    private strings;
    constructor(strings: TemplateStringsArray, values: unknown[]);
    initFragments(): any[];
    getTemplate(): HTMLTemplateElement;
    pretreatment(): Node;
    patch(values: unknown[]): void;
}
