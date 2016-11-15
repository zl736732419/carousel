/**
* @author zhenglian
* 实现图片轮播效果
* 调用方式： carousel.init([{src: imagepath, timeout:3000},{}...], opts).show();
* 参数讲解： 
* src: 要播放的图片路径，相对路径比如images/image01.jpg
* timeout: 当前图片显示的时间，毫秒值
* opts: 参数信息，可以配置的参数信息有：
* switchTimeout: 图片切换的时长，单位毫秒
* optEnable: 是否显示控制点，用于手动控制显示的图片
*/
(function($) {
    
    'use strict';

    var carousel = {
        settings: {
            items: [], //{src: imagepath, timeout: 3000}
            container: null,
            panel: null, //image panel
            optPanel: null, // 拖动点panel
            curIndex: 0, //当前播放的图片索引
            switchTimeout: 500, //300毫秒的图片切换时间
            optEnable: true, //是否添加控制点
            timer: null,
            size: {
                width: 400,
                height: 550
            }
        },
        init: function(items, opts) {
            if(items.length <= 0) {
                console.error('错误，没有图片!');
                return;
            }

            if((typeof opts) != 'undefined' && 
                    null != opts) {
                if((typeof opts.switchTimeout) != 'undefined' 
                    && null != opts.switchTimeout) {
                    this.settings.switchTimeout = opts.switchTimeout;
                }

                if((typeof opts.optEnable) != 'undefined' 
                    && null != opts.optEnable) {
                    this.settings.optEnable = opts.optEnable;
                }
            }

            this.settings.items = items;
            
            return this;
        },
        show: function() {
            this.initParams();
            this.createImages();
            if(this.settings.optEnable) {
                this.createOptPanel();
                this.initOptBtnsEvent();    
            }

            this.animate();
        },
        /**
        * 开始实现图片的轮播动画效果
        */
        animate: function() {
            var items = this.settings.items;
            var index = (this.settings.curIndex++) % items.length;
            var item = items[index];
            //这里为了循环取值，需要对索引值求余, 不然会数组越界
            this.settings.curIndex %= items.length;
            
            var lis = document.getElementsByClassName('carousel-item');
            var li = lis[0]; //当前展示的li
         
            //将图片展示指定的时间
            var element = this;

            this.settings.timer = setTimeout(function() {
                //这里
                // element.switchWithNoAnimate(li,element.callback);
                element.switchFromRightToLeft(li, element.callback);
                
            }, item.timeout);
        },
        callback: function() {
            var element = this;
            var timer = element.settings.timer;
            element.updateOptStyle();
            element.animate(); //等待下一张图片进行渲染
            if(timer != null) {
                clearTimeout(timer);
            }
        },
        /**
        * 更新控制点样式
        */
        updateOptStyle: function() {
            var index = this.settings.curIndex;
            var activeBtn = document.getElementsByClassName('active')[0];
            activeBtn.className = 'opt-btn';

            var curActiveBtn = document.getElementsByClassName('opt-btn')[index];
            curActiveBtn.className = 'opt-btn active';
        },
        /**
        * 没有动画效果，直接闪现图片
        */
        switchWithNoAnimate: function(li, callback) {
            var panel = document.getElementById('carousel-panel');
            panel.removeChild(li); //删除
            panel.appendChild(li); //添加到末尾

            callback && callback.call(element);
        },
        /**
        * 采用jquery的 animate动画
        */
        switchFromRightToLeft: function(li, callback) {
            var element = this;
            var size = element.settings.size;

            var $panel = $('#carousel-panel');
            var switchTimeout = this.settings.switchTimeout;
            $(li).stop().css({
                width: size.width + 'px'
            }).animate({
                width: 0
            }, switchTimeout, 'swing', function() {
                //将宽度恢复为原来的样子
                $(li).css({
                    width: size.width + 'px'
                });
                $panel.find('li:last').after($(li));
                callback && callback.call(element);
            });
        },
        /**
        * 初始化控制点的点击事件
        */
        initOptBtnsEvent: function() {
            var element = this;
            var btns = document.getElementsByClassName('opt-circle');
            var btn;
            for(var i = 0; i < btns.length; i++) {
                btn = btns[i];
                this.bindEvent(btn, 'click', i, function(index) {
                    element.jumpToIndexImage(index);
                })();
            }
        },
        /**
        * 跳转到指定的index索引位置
        */
        jumpToIndexImage: function(index) {
            var element = this;
            var items = this.settings.items;
            if((index+1) % items.length == element.settings.curIndex) { //点击的是当前页
                return;
            }


            var timer = element.settings.timer;
            if(timer != null) {
                clearTimeout(timer);    
            }

            var panel = document.getElementById('carousel-panel');
            
            //回退到上一个图片显示的索引位置
            //这里是为了计算要跳过多少张图片
            var start = (items.length + element.settings.curIndex - 1) % items.length;
            var count = 0;
            while((start++) % items.length != index) {
                count++;
            }

            var lis, li;
            for(var i = 0; i < count; i++) {
                //重新获取lis,因为位置在循环中会发生变化
                lis = document.getElementsByClassName('carousel-item');
                li = lis[0];
                panel.removeChild(li);
                panel.appendChild(li);
            }

            //重新设置index位置
            element.settings.curIndex = index;
            element.updateOptStyle();

            element.animate();
        },
        /**
        * 事件绑定
        */
        bindEvent: function(target, event, params, callback) {
            return function() {
                var args = params;
                var eventName = 'on' + event;
                target[eventName] = function() {
                    callback && callback(params);
                };
            };
        },
        /**
        * 创建控制点
        */
        createOptPanel: function() {
            var items = this.settings.items;
            for(var i = 0; i < items.length; i++) {
                this.createOneOptBtn(i);
            }
        },
        createOneOptBtn: function(i) {
            var optPanel = this.settings.optPanel;
            var li = document.createElement('li');
            var active = '';
            if(i == 0) {
                active = ' active';
            }
            li.className = 'opt-btn' + active;
            li.innerHTML = '<a class="opt-circle" href="javascript:void(0);"></a>';
            optPanel.appendChild(li);

        },
        createImages: function() {
            var items = this.settings.items;
            var item = null;
            for(var i = 0; i < items.length; i++) {
                item = items[i];
                this.createImage(item, i);
            }  
        },
        initParams: function() {
            var size = this.settings.size;
            var container = document.getElementsByClassName('carousel-container')[0];
            container.style.width = size.width + 'px';
            container.style.height = size.height + 'px';
            this.settings.container = container;
            var carousel = document.getElementById('carousel-panel');
            this.settings.panel = carousel;
            var optPanel = document.getElementById('opt-panel');
            this.settings.optPanel = optPanel;


            var length = this.settings.items.length;
            var size = this.settings.size;
            carousel.style.width = length * size.width + 'px';
            carousel.style.height = size.height + 'px';

        },
        /**
        * 创建一张轮播图片图片
        */
        createImage: function(item, index) {
            var panel = this.settings.panel;

            var li = document.createElement('li');
            panel.appendChild(li);
            li.className = 'carousel-item';
            var size = this.settings.size;
            li.style.width = size.width + 'px';
            li.style.height = size.height + 'px';

            var image = new Image();
            li.appendChild(image);
            image.src=item.src;
        }
    };


    /**
    * 启动函数
    */
    function init() {
        //调用carousel组件，进行图片轮播
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
    }

    //这里开始调用
    init();
})(jQuery);