import { marker, lastAttributeNameRegex, boundAttributeSuffix, nodeMarker } from './tools'
//防止xss
const trustedTypes = (<any>window).trustedTypes;
const policy =
    trustedTypes &&
    trustedTypes.createPolicy("future", { createHTML: (s: string) => s });
export class TemplateResult {
    public values: unknown[];
    public strings: TemplateStringsArray;
    constructor(strings: TemplateStringsArray, values: unknown[]) {
        this.strings = strings;
        this.values = values;
    }
    getHTML() {
        const len = this.strings.length - 1;
        let html = "";
        let isCommentBinding = false;
        for (let i = 0; i < len; i++) {
            const char = this.strings[i];
            const commentOpen = char.lastIndexOf("<!--");
            isCommentBinding =
                (commentOpen > -1 || isCommentBinding) &&
                char.indexOf("-->", commentOpen + 1) === -1;
            const attributeMatch = lastAttributeNameRegex.exec(char);
            if (!attributeMatch) {
                html += char + (isCommentBinding ? marker : nodeMarker);
            } else {
                html +=
                    char.substr(0, attributeMatch.index) +
                    attributeMatch[1] +
                    attributeMatch[2] +
                    boundAttributeSuffix +
                    attributeMatch[3] +
                    marker;
            }
        }
        html += this.strings[len];
        return html;
    }
    getTemplate() {
        const template = document.createElement("template");
        let value = this.getHTML();
        if (policy) {
            value = policy.createHTML(value);
        }
        template.innerHTML = value;
        return template;
    }
}