
import { TemplateResult } from './result'
import { containerMap } from './tools'
import { Process } from './process'
export const render = ((result: TemplateResult, container: Node) => {
    let process = containerMap.get(container);
    if (!process) {
        containerMap.set(container, (process = new Process(result)));
        container.appendChild(process.el)
    } else {
        process.patch(result.values);
    }
})
export const destroy = ((container: Node) => {
    containerMap.delete(container);
})