import { html, render } from '../src/index'
const child = html`
    <section class="section">
    <div class="container">
      <h1 class="title">
        Hello World
      </h1>
      <p class="subtitle">
        My first website with <strong>Bulma</strong>!
      </p>
    </div>
  </section>
`;
const h = (text, num,array) => html`
    <div data="${text}">123${num}
      ${child}
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