import { html, render } from '../src/index'
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
const root = document.querySelector('#root')
var observer = new MutationObserver(function (mutations, observer) {
  mutations.forEach(function (mutation) {
    console.log(mutation, 11);
  });
});
observer.observe(root, {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true,
});
render(h('text1', 1,[5,6,7,8,9,10]  ), root)
setTimeout(() => {
  render(h('text2', 2,[1,2,3,4]), root)
}, 3000);