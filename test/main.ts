import { html, render,destroy } from '../src/index'

//html 字符串模板
//用法  const j =  html`<div>${变量}</div>`
//render(j,你需要添加的根元素)
//destory(你需要添加的根元素) 不需要时候释放内存
const h = (text, num,array) => html`
    <div data="${text}">123${num}
      ${html `<div>${num}</div>`}
      ${array.map(item=> {
        const div = document.createElement('div');
        div.innerHTML = item;
        return div;
      })}
    </div>
`
const root = document.querySelector('#root');

render(h('text1', 1,[5,6,7,8,9,10]  ), root)
setTimeout(() => {
  render(h('text2', 2,[1,2,3,4]), root);
  destroy(root);
}, 3000);