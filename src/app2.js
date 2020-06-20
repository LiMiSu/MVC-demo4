import './app2.css';
import $ from 'jquery';
import Model from "./base/Model.js";
import View from "./base/View";

const eventBus = $({});
//数据相关放到M
const m = new Model({
    data: {
        index: parseInt(localStorage.getItem('index')) || 0
    },
    update(data) {
        Object.assign(m.data, data);
        eventBus.trigger('m:update');
        localStorage.setItem('index', m.data.index.toString())
    },
})

// 其他放到C
const init = (container) => {
    // const view = new View({//没必要取名字
    new View({
        eventBus: eventBus,
        data: m.data,
        container: container,
        html: (index) => {
            return `
    <div>
        <ol class="tab-bar">
            <li class="${index === 0 ? 'selected' : ''}" data-index="0">1</li>
            <li class="${index === 1 ? 'selected' : ''}" data-index="1">2</li>
        </ol>
        <ol class="tab-content">
            <li class="${index === 0 ? 'active' : ''}">内容1</li>
            <li class="${index === 1 ? 'active' : ''}">内容2</li>
        </ol>
    </div>
`
        },
        render(container, data) {
            $(container).empty();
            $(this.html(this.data.index)).appendTo($(container));
        },
        events: {
            'click .tab-bar li': 'add',
        },
        add(e) {
            const index = parseInt(e.currentTarget.dataset.index);
            const newD = {index: index};
            m.update(newD);
        },

    })
}

export default init;
