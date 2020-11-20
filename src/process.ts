
import { TemplateResult } from './result'
import { NodeType, WatchNode } from './interfaces'
import { boundAttributeSuffix, endsWith, deleteSuffix, marker, diff } from './tools'

export class Process {
    public el: Node;
    private watchNodes: WatchNode[] = [];
    private arrSize: number[] = [];
    private root: ParentNode;
    constructor(result: TemplateResult) {
        const container = this.pretreatment(result.getTemplate().content, result.values);
        this.el = container;
        this.root = (<any>this.el).firstElementChild;
    }
    commentHandle(parent: Element, value: unknown, callBack: any) {
        const watchNode = {
            type: NodeType.COMMENT,
            value,
            node: null
        }
        if (value instanceof TemplateResult) {
            const val = new Process(value);
            watchNode.value = val;
            watchNode.node = val.el

        } else if (value instanceof Array) {
            const { length } = value;
            this.arrSize.push(length);
            for (let i = 0; i < length; i++) {
                this.commentHandle(parent, value[i], this.add.bind(this));
            }
            return;
        } else {
            watchNode.node = document.createTextNode(<string>value);
        }
        callBack(parent, watchNode);
    }
    pretreatment(content: DocumentFragment, values: unknown[]) {
        const iterator = document.createNodeIterator(
            content,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT
        );
        let node = null;
        let index = -1;
        while ((node = iterator.nextNode())) {
            if (node.nodeType === NodeType.NODE) {
                if (node.hasAttributes()) {
                    const attributes = [...node.attributes];
                    const preAttr = attributes.filter((attr) =>
                        endsWith(attr.name, boundAttributeSuffix)
                    );
                    const { length } = preAttr;
                    for (let i = 0; i < length; i++) {
                        index++;
                        const attr = preAttr[i];
                        const name = deleteSuffix(preAttr[i].name, boundAttributeSuffix);
                        node.removeAttribute(attr.name);
                        const prefix = name[0];
                        const value = values[index];
                        const watchNode = {
                            type: NodeType.CALLBACK,
                            name: name,
                            value,
                            node: null
                        }
                        if (prefix === "@") {
                            node.addEventListener(
                                name.slice(1).toLowerCase(),
                                value
                            );
                        } else {
                            node.setAttribute(name, value);
                            watchNode.type = NodeType.NODE;
                            watchNode.node = node;

                        }
                        this.watchNodes.push(watchNode);
                    }
                }
            } else {
                if (node.data === marker) {
                    index++;
                    const value = values[index];
                    const parent = node.parentNode;
                    this.commentHandle(parent, value, this.add.bind(this));
                    node.remove();
                }
            }
        }
        return iterator.root;
    }
    add(parent, val) {
        parent.append(val.node);
        this.watchNodes.push(val);
    }
    patch(values: unknown[], index = 0) {
        const { length } = values;
        for (let i = 0; i < length; i++) {
            const value = values[i];
            const watchNode: WatchNode = this.watchNodes[i + index];
            const watchValue = watchNode.value;
            if (value instanceof Array) {
                const oldSize = this.arrSize.pop();
                const newSize = value.length;
                if (oldSize != newSize) {
                    if (oldSize > newSize) {
                        const removeNodes = this.watchNodes.splice(i + index, oldSize - newSize);
                        const { length } = removeNodes;
                        for (let j = 0; j < length; j++) {
                            const removeNode = removeNodes[j];
                            const value = removeNode.value;
                            if (value instanceof Process) {
                                (<any>value.root).remove();
                            } else {
                                (<Element>removeNode.node)?.remove();
                            }
                        }
                    } else {
                        const val = watchNode.value;
                        if (val instanceof Process) {
                            for (let k = oldSize; k < newSize; k++) {
                                this.commentHandle((<any>val.root), value[k], (parent, val) => {
                                    this.watchNodes.splice(k - 1, 0, val);
                                    parent.append(val.node);
                                });
                            }
                        } else {
                            for (let k = oldSize; k < newSize; k++) {
                                this.commentHandle((<Element>watchNode?.node), value[k], (parent, val) => {
                                    this.watchNodes.splice(k - 1, 0, val);
                                    parent.append(val.node);
                                });
                            }
                        }
                    }
                    this.arrSize.push(newSize);
                }
                this.patch(value, i);
            } else if (value instanceof TemplateResult) {
                (<Process>watchValue).patch(value.values);
            } else {
                if (diff(value, watchValue)) {
                    if (watchNode.type === NodeType.NODE) {
                        (<Element>watchNode.node).setAttribute(watchNode.name, <string>value);
                    } else if (watchNode.type === NodeType.COMMENT) {
                        watchNode.node.nodeValue = <string>value;
                    }
                    watchNode.value = value;
                }
            }
        }
    }
}