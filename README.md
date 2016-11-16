###自定义实现图片轮播效果
    使用方式调用方式： 
    1.引入jquery.js
    <script type="text/javascript" src="script/lib/jquery-1.8.0.min.js"></script>
    2.引入carousel.js
    <script type="text/javascript" src='script/carousel.js'></script>
    3.调用carousel对象，初始化
    carousel.init([{src: imagepath, timeout:3000},{}...], opts).show();
    其中timeout参数可选，如果没有配置，则默认为每张图显示3秒钟
    4.该实例切换时默认为
    实例:

```
var items = [{
    src: 'images/image01.jpg',
    timeout: 3000 //播放3秒
},{
    src: 'images/image02.jpg',
    timeout: 4000 // 播放4秒
},{
    src: 'images/image03.jpg',
    timeout: 5000 //播放5秒
}];

var opts = {
    useJquery: true, //平滑切换
    optEnable: true, //使用控制点,是否需要人为干预图片展示顺序
    // switchTimeout: 600 //切换图片时间隔
}

carousel.init(items, opts).show();
```

    参数讲解: 
        src: 要播放的图片路径，相对路径比如images/image01.jpg
        timeout: 当前图片显示的时间，毫秒值
        opts: 参数信息，可以配置的参数信息有：
            switchTimeout: 图片切换的时长，单位毫秒，默认为500毫秒
            optEnable: 是否显示控制点，用于手动控制显示的图片
            useJquery: 是否使用jquery平滑切换动画