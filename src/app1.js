import './app1.css';
import $ from 'jquery';
import Model from "./base/Model.js";


const eventBus = $({});
//数据相关放到M
const m = new Model({
    data: {n: parseInt(localStorage.getItem('n')) || 0},
    update(data){
        Object.assign(m.data, data);
        eventBus.trigger('m:update');
        localStorage.setItem('n', m.data.n.toString())
    }
})
// 其他放到C
const view = {
    html: `
    <div>
        <div class="output">
            <span id="number">{{n}}</span>
        </div>
        <div class="actions">
            <button id="add1">+1</button>
            <button id="minus1">-1</button>
            <button id="mul2">*2</button>
            <button id="divide2">/2</button>
        </div>
    </div>
`,
    init(container) {
        view.render(container, m.data.n);
        view.autoBindEvents(container);
        eventBus.on('m:update', () => {
            view.render(container, m.data.n)
        })
    },
    render(container, n) {
        $(container).empty();
        $(view.html.replace('{{n}}', n)).appendTo($(container));
    },
    events: {
        'click #add1': 'add',
        'click #minus1': 'minus',
        'click #mul2': 'mul',
        'click #divide2': 'divide'
    },
    add() {
        const newD = {n: m.data.n + 1};
        m.update(newD)
    },
    minus() {
        const newD = {n: m.data.n - 1};
        m.update(newD)
    },
    mul() {
        const newD = {n: m.data.n * 2};
        m.update(newD)
    },
    divide() {
        const newD = {n: m.data.n / 2};
        m.update(newD)
    },
    autoBindEvents(container) {
        for (let key in view.events) {
            const spaceIndex = key.indexOf(' ')
            const part1 = key.slice(0, spaceIndex);
            const part2 = key.slice(spaceIndex + 1);
            const value = view[view.events[key]];
            $(container).on(part1, part2, value);
        }
    }
}

export default view;






