# 简化MVC
![image.png](https://upload-images.jianshu.io/upload_images/12081122-148c09308dcc072e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
事不过三原则，抽MVC的公共属性到原型上，四个模型都能用
新建一个目录存放
类写法
抽离M
![image.png](https://upload-images.jianshu.io/upload_images/12081122-d5044f5cdbef9974.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
```
class Model {
    constructor(options) {
        this.data = options.data

    }

    //数据相关放到M
    create() {
        //检查console、console.error存不存在
        console && console.error && console.error('你还没实现 create')
    }

    delete() {
        //最新版js有一个可选链语法：console?.error?.('你还没实现 create'),有很多编辑器可能还不支持
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
```
那怎么引用它呢
![image.png](https://upload-images.jianshu.io/upload_images/12081122-4a93a2937d091111.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
或者把方法放到this上
![image.png](https://upload-images.jianshu.io/upload_images/12081122-3d01f41cd45f6908.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
事不过三，代码重复，可以遍历
![image.png](https://upload-images.jianshu.io/upload_images/12081122-ceb8abe160555788.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
```
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
```
就可以这样引用
![image.png](https://upload-images.jianshu.io/upload_images/12081122-5cb6494f04b0748c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

然后去第二、三个模块也引用Model
![image.png](https://upload-images.jianshu.io/upload_images/12081122-14263e23a36dff2c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![image.png](https://upload-images.jianshu.io/upload_images/12081122-3f66281bba6d72a9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
就搞定
接着抽离V
```
class View {
    constructor({html, render}) {//用参数解构的方法
        this.html=html
        this.render=render
    }
}
export default View
```
![image.png](https://upload-images.jianshu.io/upload_images/12081122-715452b549ae00f3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
其他模块也一样
抽离C，跟V差不多
但是发现V和C的属性特别少，没有必要单独分开，所以历史发展中V和C就合并了。
如何合并，想合并最好一开始就做好合并，回到抽离V之前的操作
把V和 C对象合并
```
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

```
关于名字，是叫C好还是V好，因为前端专注的是视图所以合并的对象名字叫做V(view)
然后抽离view
初始化就可以放到constructor里面，constructor就是初始化
container无法获取，所以外层包一层init
```
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
```
```
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
```
![image.png](https://upload-images.jianshu.io/upload_images/12081122-e24c1903128d30e4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
eventBus所有的m用到，所有的view也用到，可以优化
可以新建一个文件抽离eventBus
![image.png](https://upload-images.jianshu.io/upload_images/12081122-0576788ae240f639.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
抽离eventBus现在看来是多此一举，但是这种功能能在某一天eventBus不是依赖JQuery的时候只需要改一个文件，这就叫做解耦：很多模块都在依赖一个模块，在它们之间建一个中间层（浇水层），某一天这个依赖模块改变，直接重构中间层就可以
![image.png](https://upload-images.jianshu.io/upload_images/12081122-fdd4f638196644c9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
这样还是很奇怪，能不能直接让m去trigger不用到外层eventBus，它自己就能trigger
![image.png](https://upload-images.jianshu.io/upload_images/12081122-4516fa1609ce6b59.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
同理，让view能直接this.on
![image.png](https://upload-images.jianshu.io/upload_images/12081122-024a71b3a39a78b8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
怎么做到m和view能直接用eventBus的方法——继承
类写的就用类继承，把eventBus放到所有东西的最上面——所有主流框架的做法
![image.png](https://upload-images.jianshu.io/upload_images/12081122-28f0030580c6d8c8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
DOM其实也是这样做的（之前讲过eventBus就是原型链的倒数第二次层），这就是为什么所有的DOM元素都能够触发事件监听事件等
![image.png](https://upload-images.jianshu.io/upload_images/12081122-0baee5c7065c6f38.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![image.png](https://upload-images.jianshu.io/upload_images/12081122-75283e2e499d6d80.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
如何实现
![image.png](https://upload-images.jianshu.io/upload_images/12081122-484c61848d7ef744.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
就可以删掉eventBus了
![image.png](https://upload-images.jianshu.io/upload_images/12081122-51b39049d5d4ddd5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
插播一个报错：JS代码不能以括号开头
比如下图：括号会往上一句代码找能不能结合，能就结合，所以结合后的代码不是数组没有forEach方法。
![image.png](https://upload-images.jianshu.io/upload_images/12081122-785ada9f7f25f63e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
解决：
1. 要么句句记得要写分号结束符（工作量很大）
2. 要么不要以括号开头

搞个中间变量
![image.png](https://upload-images.jianshu.io/upload_images/12081122-0d9301acc967dc32.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
