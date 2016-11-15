###自定义实现图片轮播效果
    使用方式调用方式： carousel.init([{src: imagepath, timeout:3000},{}...], opts).show();
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

carousel.init(items).show();
```

    参数讲解: 
        src: 要播放的图片路径，相对路径比如images/image01.jpg
        timeout: 当前图片显示的时间，毫秒值
        opts: 参数信息，可以配置的参数信息有：
            switchTimeout: 图片切换的时长，单位毫秒
            optEnable: 是否显示控制点，用于手动控制显示的图片