import './app1.css';
import $ from 'jquery';
import Model from "./base/Model.js";
import View from "./base/View";


const eventBus = $({});
//数据相关放到M
const m = new Model({
    data: {n: parseFloat(localStorage.getItem('n')) || 0},
    update(data) {
        Object.assign(m.data, data);
        eventBus.trigger('m:update');
        localStorage.setItem('n', m.data.n.toString())
    }
})
// 其他放到C
const init = (container) => {
    new View({
        eventBus: eventBus,
        data: m.data,
        container: container,
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
        render(container, data) {
            $(container).empty();
            $(this.html.replace('{{n}}', this.data.n)).appendTo($(container));
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
        }
    })
}


export default init;






