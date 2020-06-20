import './app3.css';
import $ from 'jquery';
import Model from "./base/Model";

const eventBus = $({});
const localKey = 'app3.active';

//数据相关放到M
const m = new Model({
    data: {
        active: localStorage.getItem(localKey) || 'yes',

    },
    update(data) {
        Object.assign(m.data, data);
        eventBus.trigger('m:update');
        localStorage.setItem('active', m.data.active)
    },
})

// 其他放到C
const view = {
    html: (active) => {
        return `
       <div>
        <div class="${active === 'yes' ? 'square active' : 'square'}" ></div>
       </div>
        `
    },

    init(container) {
        view.render(container, m.data.active);
        view.autoBindEvents(container);
        //监听m
        eventBus.on('m:update', () => {
            view.render(container, m.data.active)
        })
    },
    render(container, active) {
        $(container).empty();
        $(view.html(active)).appendTo($(container));
    },
    events: {
        'click .square': 'move',
    },
    move() {
        localStorage.getItem(localKey) === 'yes' ? localStorage.setItem(localKey, 'no') : localStorage.setItem(localKey, 'yes');
        const active = localStorage.getItem(localKey);
        const newD = {active: active}
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
