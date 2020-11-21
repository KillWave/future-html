import { html } from '../src/index'
import { render, destroy } from '../src/render';
import { getCLS, getFID, getLCP } from 'web-vitals';

function logDelta({ name, id, delta }) {
    console.log(`${name} matching ID ${id} changed by ${delta}`);
}

getCLS(logDelta, true);
getFID(logDelta, true);
getLCP(logDelta, true);

//html 字符串模板
//用法  const j =  html`<div>${变量}</div>`
//render(j,你需要添加的根元素)
//destory(你需要添加的根元素) 不需要时候释放内存
//const h = (text, num, array) => 
// const root = document.querySelector('#root');
// var observer = new MutationObserver(function (mutations, observer) {
//   mutations.forEach(function (mutation) {
//     console.log(mutation, 11);
//   });
// });
// observer.observe(root, {
//   attributes: true,
//   characterData: true,
//   childList: true,
//   subtree: true,
//   attributeOldValue: true,
//   characterDataOldValue: true,
// });
// console.time('1');
// render(h('text1', 1,[5, 6, 7, 8, 9, 10] ), root)
// console.timeEnd('1')
// setTimeout(() => {
//   console.time('2');
//   render(h('text2', 2, [1, 2, 3, 4]), root);
//   console.timeEnd('2');
//   destroy(root);
// }, 3000);


// html`
// <div data="${'text1'}">
//   123${1 + 4}

// </div>
// `;

const root = document.querySelector('#root');

// //页面
const h = (text, num, array) => html`
    <div data="${text}" @click="${handle}">123${num}
        ${array.map(item => html`<div>${item}</div>`)}
    </div>`
const handle = () => {

    console.time('update');
    render(h('text2', 2,[5, 6, 7, 8, 9, 10] ), root);
    console.timeEnd('update');


}

// function define(tagName: string, fn) {
//     customElements.define(tagName, class Cmp extends HTMLElement {
//         constructor(){
//             super();
//             const h = fn({propertys:this.attributes});
//             render(h(),this);
//         }
//     });
// }
// define('app-root', ({propertys:{data}}) => {
//     console.log(data);
//     return () => html`<div>${data.value}</div>`;
// })

// AppRoot.prototype.render = () => {
//     const val = '123'
//     html`<div>${val}</div>`;
// }





render(h('text1', 1,[1, 2, 3, 4] ), root)




