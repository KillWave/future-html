
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
  // console.log()
  console.log('props: ',this);

  // bbb()
  return <template>
    123
  </template>
}
// function bbb(){
//   console.log(this.RootApp,this.RootApp.arguments)
//   function ccc(){
//     // this.RootApp
//     console.log('this.RootApp: ', this.bbb);
//   }
//   ccc()
// }

function a(){
  alert(111)
}
document.querySelector("#root").append(<RootApp onClick={a}>123</RootApp>)