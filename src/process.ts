import { boundAttributeSuffix, endsWith, deleteSuffix, marker, diff } from './tools'
import { TemplateResult } from './result'
import { NodeType, Vnode, VnodeAttribute } from './interfaces'
import { render, destroy } from './render';
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
                            const name = deleteSuffix(attr.name, boundAttributeSuffix);
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
                        const vnodes: Vnode[] = [];
                        let resultVnode = null;
                        if (values[index] instanceof TemplateResult) {
                            node.remove();
                            const tem = document.createDocumentFragment();
                            const result = <TemplateResult>values[index];
                            render(result, tem)
                            // tem.append(result)
                            resultVnode = {
                                node: tem,
                                childNodes: [...Array.from(tem.childNodes)],
                                value: result,
                                index,
                                parent
                            };
                            parent.append(tem);
                        } else if (values[index] instanceof Node) {
                            childerNode = values[index];
                            parent.replaceChild(childerNode, node);
                        } else if (values[index] instanceof Array) {
                            node.remove();
                            const arr = <Array<unknown>>values[index];
                            const len = arr.length;
                            for (let i = 0; i < len; i++) {
                                const data = arr[i];
                                if (data instanceof TemplateResult) {
                                    const tem = document.createDocumentFragment();
                                    render(<TemplateResult>data, tem);
                                    vnodes.push({
                                        node: tem,
                                        childNodes: [...Array.from(tem.childNodes)],
                                        value: data,
                                        index: i,
                                        parent
                                    });

                                } else if (data instanceof Node) {
                                    vnodes.push({
                                        node: <Node>data,
                                        value: data,
                                        index: i
                                    });

                                } else {
                                    const text = document.createTextNode(<string>data);
                                    vnodes.push({
                                        node: text,
                                        value: data,
                                        index: i
                                    });
                                }

                            }
                            parent.append(... (<Node[]>vnodes.map(node => node.node)));
                        }
                        else {
                            childerNode = document.createTextNode(<string>values[index]);
                            parent.replaceChild(childerNode, node);
                        }
                        if (values[index] instanceof Array) {
                            const vnode: Vnode = {
                                node: vnodes,
                                value: values[index],
                                index,
                            }
                            vnodes.length && this.bindNodes.push(vnode);
                        } else if (values[index] instanceof TemplateResult) {
                            resultVnode && this.bindNodes.push(resultVnode);
                        } else {
                            const vnode: Vnode = {
                                node: childerNode,
                                value: values[index],
                                index,
                            }
                            childerNode && this.bindNodes.push(vnode);
                        }
                    }
                    break;
            }

        }
        return iterator.root;
    }
    commit(vnode: Vnode, value: unknown) {
        if (value instanceof Node) {
            (<Node>vnode.node).parentNode.replaceChild(<Node>value, <Node>vnode.node);
            vnode.node = <Node>value;
            vnode.value = value;
        } else if (value instanceof TemplateResult) {
            render(value, <Node>vnode.node);
        } else {
            if (diff(value, vnode.value)) {
                (<Node>vnode.node).nodeValue = <string>value;
                vnode.value = value;
            }
        }

    }
    patch(values: unknown[]) {
        const bindNodesLen = this.bindNodes.length;
        for (let b = 0; b < bindNodesLen; b++) {
            const vnode = this.bindNodes[b];
            const index = vnode.index;
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
                if (values[index] instanceof Array) {
                    const datas = <Array<unknown>>values[index];
                    const len = datas.length;
                    const vnodeLen = (<Vnode[]>vnode.node).length;
                    const vnodelast = vnodeLen - 1;
                    const resultNodes = [];
                    const resultParent = vnode.node[vnodelast].parent;
                    const nodeParent = vnode.node[vnodelast].node.parentNode;
                    const nodeChild = [];
                    for (let i = 0; i < len; i++) {
                        const data = datas[i];
                        if (data instanceof TemplateResult) {
                            if (vnode.node[i]?.node) {
                                this.commit(<Vnode>vnode.node[i], data);
                            } else {
                                (<unknown[]>vnode.value).push(data);
                                const tmp = document.createDocumentFragment();
                                render(<TemplateResult>data, tmp);
                                (<Vnode[]>vnode.node).push({
                                    node: tmp,
                                    childNodes: [...Array.from(tmp.childNodes)],
                                    value: data,
                                    index: i,
                                    parent: resultParent
                                });
                                resultNodes.push(vnode.node[i].node);
                            }
                        } else {
                            if (vnode.node[i]) {
                                this.commit(vnode.node[i], data);
                            } else {
                                const tmp = document.createDocumentFragment();
                                tmp.append(<string>data);
                                const [box] = [...Array.from(tmp.childNodes)];
                                (<Vnode[]>vnode.node).push({
                                    node: box,
                                    value: data,
                                    index: i
                                });
                                nodeChild.push(tmp);
                            }

                        }
                    }
                    resultParent?.append(...resultNodes);
                    nodeParent?.append(...nodeChild);

                    if (len < (<Vnode[]>vnode.node).length) {
                        const deletelen = vnodeLen - len;
                        for (let i = len; i < (<Vnode[]>vnode.node).length; i++) {
                            const vnodeItem = vnode.node[i];
                            if (vnodeItem.value instanceof TemplateResult) {
                                destroy(vnodeItem.node);
                                const arr = (<Vnode[]>vnode.node).splice(i, deletelen);
                                const arrLen = arr.length;
                                for (let j = 0; j < arrLen; j++) {
                                    const items = arr[i].childNodes;
                                    const itemsLen = items.length;
                                    for (let k = 0; k < itemsLen; k++) {
                                        (<Element>items[k]).remove();
                                    }
                                }
                                (<unknown[]>vnode.value).splice(i, deletelen);
                            } else {
                                const arr = (<Vnode[]>vnode.node).splice(i, deletelen);
                                (<unknown[]>vnode.value).splice(i, deletelen);
                                const arrLen = arr.length;
                                for (let j = 0; j < arrLen; j++) {
                                    (<Element>arr[j].node).remove();
                                }
                            }

                        }
                    }
                } else {
                    this.commit(vnode, values[index]);
                }

            }

        }


    }
}