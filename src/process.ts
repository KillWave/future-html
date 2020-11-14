import { boundAttributeSuffix, endsWith, deleteSuffix, marker, diff } from './tools'
import { TemplateResult } from './result'
import { NodeType, Vnode, VnodeAttribute } from './interfaces'
import { render } from './render';
export class Process {
    public tempalte: Node;
    public values: unknown[];
    public bindNodes: Vnode[] = [];
    constructor(tempalte: HTMLTemplateElement, values: unknown[]) {
        this.tempalte = this.pretreatment(tempalte.content, values);

    }
    pretreatment(content: DocumentFragment, values: unknown[]) {
        const iterator = document.createNodeIterator(
            content,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT
        );
        let node = null;
        let index = -1;
        while ((node = iterator.nextNode())) {
            switch (node.nodeType) {
                case NodeType.NODE:
                    if (node.hasAttributes()) {
                        //node节点
                        const attributes = [...node.attributes];
                        const preAttr = attributes.filter((attr) =>
                            endsWith(attr.name, boundAttributeSuffix)
                        );
                        const { length } = preAttr;
                        const vnode = length ? { node, attributes: [] } : null;
                        for (let i = 0; i < length; i++) {
                            index++;
                            const attr = preAttr[i];
                            const name = deleteSuffix(preAttr[i].name, boundAttributeSuffix);
                            node.removeAttribute(attr.name);
                            const prefix = name[0];
                            if (prefix === "@") {
                                node.addEventListener(
                                    name.slice(1).toLowerCase(),
                                    values[index]
                                );
                            } else {
                                vnode.attributes.push({
                                    name: name,
                                    value: values[index],
                                    index,
                                });
                                node.setAttribute(name, values[index]);
                                // if (prefix === ":") {
                                //     //TODO
                                //     node.setAttribute(name.slice(1), values[index]);
                                // } else if (prefix === "?") {
                                //     if (values[index]) {
                                //         node.setAttribute(name.slice(1), values[index]);
                                //     }
                                //     //TODO
                                // } else {
                                //     node.setAttribute(name.slice(1), values[index]);
                                // }
                            }
                        }
                        vnode?.attributes.length && this.bindNodes.push(vnode);
                    }
                    break;
                case NodeType.COMMENT:
                    //注释节点
                    if (node.data === marker) {
                        index++;
                        let childerNode = null;
                        const parent = node.parentNode;
                        if (values[index] instanceof TemplateResult) {
                            node.remove();
                            const result = <TemplateResult>values[index];
                            render(result, parent)
                        } else if (values[index] instanceof Node) {
                            childerNode = values[index];
                            parent.replaceChild(childerNode, node);
                        } else {
                            childerNode = document.createTextNode(<string>values[index]);
                            parent.replaceChild(childerNode, node);
                        }
                        const vnode: Vnode = {
                            node: childerNode,
                            value: values[index],
                            index,
                        }
                        childerNode && this.bindNodes.push(vnode);
                    }
                    break;

            }

        }

        return iterator.root;
    }
    patch(values: unknown[]) {
        this.bindNodes.forEach((vnode: Vnode) => {
            if (vnode.attributes) {
                //node
                vnode.attributes = vnode.attributes.map((attr: VnodeAttribute) => {
                    if (diff(values[attr.index], attr.value)) {
                        attr.value = values[attr.index];
                        (<Element>vnode.node).setAttribute(attr.name, <string>attr.value);
                    }
                    return attr;
                });
            } else {
                //comment
                if (vnode.value instanceof Node) {
                    if (diff((<Node>values[vnode.index]).nodeValue, vnode.node.nodeValue)) {
                        vnode.node.nodeValue = (<Node>values[vnode.index]).nodeValue;
                    }
                } else {
                    if (diff(values[vnode.index], vnode.value)) {
                        vnode.value = values[vnode.index];
                        vnode.node.nodeValue = <string>vnode.value;
                    }

                }
            }
        })

    }
}