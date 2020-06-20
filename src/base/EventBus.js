import $ from 'jquery'

class EventBus {
    //从JQuery偷梁换柱  把eventBus藏好
    constructor() {
        this._eventBus = $({})
    }
    on(eventName, fn) {
        return this._eventBus.on(eventName, fn)
    }
    trigger(eventName, data) {
        return this._eventBus.trigger(eventName, data)
    }
    off(eventName, fn) {
        return this._eventBus.off(eventName, fn)
    }
}
export default EventBus