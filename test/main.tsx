
import {camelToDash} from '../utils'
 
import {CustomElement,createElement} from '../src/dom'


 function html(comp, props={}, children=[]) {
  
  if (typeof comp === 'function') {
    const tagName = camelToDash(comp.name)
    const compDefine = customElements.get(tagName)
    if (!compDefine) {
      customElements.define(tagName, CustomElement)
    }
    const component = document.createElement(tagName)

    const childrens = [comp(props)].concat(children)

    return createElement(component, props, childrens)
  } else {
    const component = document.createElement(comp)
    return createElement(component, props, children)
  }
}


function RootApp(props){
  console.log(props)
  const [num,setNum] = a(0)
  return <template>
    <button onClick={()=>{setNum(()=>num+1)}}>  {num}</button>
  
    123
  </template>
}


function a(data){
  const ctx = a.caller
  return [data,function(fn){
    fn()
    console.log(ctx.arguments)
    ctx.apply(ctx.arguments)
  }]
  //console.log(taget(...taget.arguments))
  // alert(111)
}
document.querySelector("#root").append(<RootApp onClick={a}>123</RootApp>)