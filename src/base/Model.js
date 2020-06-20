class Model {
    constructor(options) {
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