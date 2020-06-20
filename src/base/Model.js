import EventBus from "./EventBus";

class Model extends EventBus{
    constructor(options) {
        super();//调用EventBus的constructor才能继承它constructor里面的东西
        ['data', 'update', 'create', 'delete', 'get'].forEach((key)=>{
            if (key in options){
                this[key]=options[key]
            }
        })
    }
    create() {
        console && console.error && console.error('你还没实现 create')
    }

    delete() {
        console?.error?.('你还没实现 delete')
    }

    update() {
        console && console.error && console.error('你还没实现 update')
    }

    get() {
        console && console.error && console.error('你还没实现 get')
    }
}
 export default Model