export interface Patch{
    pretreatment:(values:unknown[],content:Node | ShadowRoot | Element)=>Node;
}
export enum NodeType {
    NODE=1,
    COMMENT=8
}
export interface  VnodeAttribute{
    name:string;
    value:unknown;
    index:number;
}
export interface Vnode{
    node:Element | Text | Node;
    attributes?:VnodeAttribute[];
    value?:unknown;
    index?:number;
}