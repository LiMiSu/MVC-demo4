import $ from "jquery";

class View {
    // constructor({html, render, events, container, data, eventBus}) {
    //     this.html=html
    //     this.render=render
    //     this.events=events
    //     this.container=container
    //     this.data=data
    //     this.eventBus=eventBus
    constructor(options) {
        Object.assign(this, options)
        this.render(this.container, this.data);
        this.autoBindEvents(this.container);
        this.eventBus.on('m:update', () => {
            this.render(this.container, this.data)
        })
    }

    autoBindEvents(container) {
        for (let key in this.events) {
            const spaceIndex = key.indexOf(' ')
            const part1 = key.slice(0, spaceIndex);
            const part2 = key.slice(spaceIndex + 1);
            const value = this[this.events[key]];
            $(container).on(part1, part2, value);
        }
    }
}

export default View