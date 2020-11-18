
import { lastAttributeNameRegex, marker, startWidth, valueInstanceofto } from './tools'
import { Fragment } from './interfaces'
//防止xss
const trustedTypes = (<any>window).trustedTypes;
const policy =
    trustedTypes &&
    trustedTypes.createPolicy("future", { createHTML: (s: string) => s });
export class TemplateResult {
    private fragments: Fragment[] = [];
    public closeHtml: string;
    public values: unknown[];
    private strings: TemplateStringsArray;
    constructor(strings: TemplateStringsArray, values: unknown[]) {
        this.values = values;
        this.strings = strings;
    }
    initFragments() {
        const fragments = [];
        const len = this.strings.length;
        this.closeHtml = this.strings[len - 1];
        let isCommentBinding = true;
        for (let i = 0; i < len; i++) {
            const value = this.values[i];
            const htmlFragment = this.strings[i];
            const commentOpen = htmlFragment.lastIndexOf('<!--');
            isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                htmlFragment.indexOf('-->', commentOpen + 1) === -1;
            const attributeMatch = lastAttributeNameRegex.exec(htmlFragment);
            if (value) {
                if (value instanceof Array) {
                    const { length } = value;
                    for (let j = 0; j < length; j++) {
                        valueInstanceofto(value[j], fragments, attributeMatch, htmlFragment.trim());
                    }

                } else {
                    valueInstanceofto(value, fragments, attributeMatch, htmlFragment.trim());
                }
            }
        }
        return fragments;
    }
    getTemplate() {
        this.fragments = this.initFragments();
        const len = this.fragments.length;
        let html = '';
        for (let i = 0; i < len; i++) {
            const htmlFragment = this.fragments[i];
            if (htmlFragment.strings) {
                html += String.raw(htmlFragment.strings, htmlFragment.value);
            } else {
                html += `<!--${i}-->`
            }
        }
        html += this.closeHtml.trim();
        const template = document.createElement('template');
        if (policy) {
            html = policy.createHTML(html);
        }
        template.innerHTML = html;
        return template;
    }
    pretreatment() {
        const template = this.getTemplate().content;
        const iterator = document.createNodeIterator(
            template,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT
        );
        let node = null;
        let index = -1;
        while ((node = iterator.nextNode())) {
            if (node.nodeType === 1) {
                if (node.hasAttributes()) {
                    const attributes = [...node.attributes];
                    const { length } = attributes;
                    for (let i = 0; i < length; i++) {
                        const value = attributes[i].value;
                        if (startWidth(value)) {
                            index++;
                            const attrName = attributes[i].name;
                            const val = value.slice(8);
                            const itemFragment = this.fragments[index];
                            itemFragment.attribute = attrName;
                            itemFragment.el = node;
                            (<Element>itemFragment.el).setAttribute(attrName, val);
                        }
                    }
                }

            } else if (node.nodeType === 8) {
                if (node.data === marker) {
                    index++;
                    const nextNode = node.nextSibling;
                    const itemFragment = this.fragments[index];
                    itemFragment && (itemFragment.el = nextNode);
                } else {
                    const index = node.data;
                    node.parentNode.replaceChild(this.fragments[index].el, node);
                }
                node.remove();
            }
        }
        return iterator.root;
    }
    patch(values: unknown[]) {
        const { length } = values;
        const len = this.fragments.length;
        let index = 0;
        const addFragment = [];
        for (let i = 0; i < length; i++) {
            const fragment = this.fragments[i];
            const value = fragment.value;
            const data = values[i];
            if (data != value) {
                index = i;
                if (data instanceof Array) {
                    const { length } = data;
                    for (let j = 0; j < length; j++) {
                        index = i + j;
                        // console.log(index,this.fragments[index])
                        const itemFragment = this.fragments[index];
                        if (itemFragment) {
                            let val = itemFragment.value;
                            if (val instanceof TemplateResult) {
                                (<TemplateResult>val).patch(data[j].values);
                            }
                            else if (val instanceof Node) {
                                val.parentNode.replaceChild(data[j], val);
                                itemFragment.el = data[j];
                            } else {
                                itemFragment.el.nodeValue = data[j];
                            }
                            val = data[j];
                        } else {
                            const node = this.fragments[len - 1].el;
                            valueInstanceofto(data[j], addFragment, null);
                            node.parentNode.append(addFragment[addFragment.length - 1].el);
                        }
                    }
                    this.fragments.push(...addFragment);
                } else {
                    if (fragment.attribute) {
                        (<Element>fragment.el).setAttribute(fragment.attribute, <string>data);
                    } else {
                        (<Element>fragment.el).nodeValue = <string>data;
                    }
                    fragment.value = data;
                }
            }
        }

        const lastIndex = index + 1;
        if (lastIndex < len) {
            for (let n = lastIndex; n < len; n++) {
                const fragment = this.fragments[n];
                (<Element>fragment.el).remove();
            }
            this.fragments.splice(lastIndex, len);
        }
    }
}