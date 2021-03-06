export enum NodeType {
    NODE = 1,
    COMMENT = 8,
    CALLBACK = 0
}

export interface WatchNodeBO {
    type: NodeType,
    name: string,
    value: unknown,
    node: Node
}