import { html } from '../src/index'
import { render, destroy } from '../src/render';

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

//页面
const h = (text, num, array) => html`
    <div data="${text}">123${num}
        ${array.map(item => html`<div>${item}</div>`)}
    </div>
`
const root = document.querySelector('#root');

console.time('1');
render(h('text1', 1, [1, 2, 3, 4]), root)
console.timeEnd('1')
setTimeout(() => {
    console.time('2');
    render(h('text2', 2, [5, 6, 7, 8, 9, 10]), root);
    console.timeEnd('2');
    destroy(root);
}, 3000);


