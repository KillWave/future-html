
import {TemplateResult} from './result'
import {containerMap} from './tools'
import {Process} from './process'
export const render = (result:TemplateResult,container:Node)=>{
    let process = containerMap.get(container);
    if(!process){
        containerMap.set(container,(process = new Process(result.getTemplate(),result.values)));
        container.appendChild(process.tempalte)
    }else{
        process.patch(result.values);
    }
}

export const destroy = (container:Node)=>{
    containerMap.delete(container);
}