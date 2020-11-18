
import { TemplateResult } from './result'
import { containerMap } from './tools'
export const render = (result: TemplateResult, container: Node) => {
    let process = containerMap.get(container);
    if (!process) {
        containerMap.set(container, (process = result));
        container.appendChild(process.pretreatment())
    } else {
        process.patch(result.values);
    }
}
export const destroy = (container:Node)=>{
    containerMap.delete(container);
}