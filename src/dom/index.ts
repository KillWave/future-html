import {marker} from '../../utils'

export  class CustomElement extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

export function createElement(component, props, children) {
  const dom = component.content
  
    ? component.content.cloneNode(true)
    : component
  const root = dom.shadowRoot ? dom.shadowRoot : dom
  const regx = /^on/
  for (let key in props) {
    if (regx.test(key)) {
      dom.addEventListener(key.toLowerCase().slice(2), props[key])
      // delete props[key]
    }
    if(typeof props[key] != 'object'){
      dom.setAttribute(key, props[key])
    }
  
  }
  children.forEach((child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      dom.appendChild(document.createComment(marker))
      dom.appendChild(document.createTextNode(child + ''))
    } else {

      if (child instanceof DocumentFragment) {
        root.appendChild(child)
      } else {
        dom.appendChild(document.createComment(marker))
        dom.appendChild(child)
      }
    }
  })
  return dom
}
