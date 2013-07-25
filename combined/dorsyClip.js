/**
 * @description main file
 * @author dorsywang(Bin Wang)
 * @email 314416946@qq.com
 */

(function(){
    var Main = {
        config: {},

        Observer: {
        },
        module: function(name, func){
            Main[name] = new func(this);
        },

        addObserver: function(eventName, observer){
            this.Observer[eventName] = this.Observer[eventName] || [];
            this.Observer[eventName].push(observer);
        },
        
        fireEvent: function(eventName, data){
            var actions = this.Observer[eventName];
            for(var i = 0; i < actions.length; i ++){
                actions[i].eventListener[eventName](data);
            }
        },

        init: function(){
            this.status.clipNodes = [];

            this.readConfig();
            this.view.init();
            this.eventBind.init();
        },

        setConfig: function(){
        },

        readConfig: function(){
            this.config.left = parseInt(this.model.read("dorsy_left")) || 0;
            this.config.top = parseInt(this.model.read("dorsy_top")) || 0;
        },

        //状态属性
        status: {
        }
    };

    //返回外部接口
    window.dorsyClip = {
       module: function(name , func){
            Main.module(name, func);
       },

       init: function(){
            Main.init();
       },

       set: function(pic){
            Main.config.designUrl = pic;
       }

    };

    window.$DC || (window.$DC = window.dorsyClip);

})();

window.onload = function(){
    /**
     * @ NAME: Cross-browser TextStorage
     * @ DESC: text storage solution for your pages
     * @ COPY: sofish, http://sofish.de
     */

    //使用localStorage
    typeof window.localStorage == 'undefined' && ~function(){

        var localStorage = window.localStorage = {},
            prefix = 'data-userdata',
            doc = document,
            attrSrc = doc.body,
            html = doc.documentElement,
            
            // save attributeNames to <html>'s
            // data-userdata attribute
            mark = function(key, isRemove, temp, reg){
            
                html.load(prefix);
                temp = html.getAttribute(prefix);
                reg = RegExp('\\b' + key + '\\b,?', 'i');
                
                hasKey = reg.test(temp) ? 1 : 0;
                    
                temp = isRemove ? temp.replace(reg, '').replace(',', '') : 
                        hasKey ? temp : temp === '' ? key :
                            temp.split(',').concat(key).join(',');
                        
            
                html.setAttribute(prefix, temp);
                html.save(prefix);

            };
            
        // add IE behavior support
        attrSrc.addBehavior('#default#userData');
        html.addBehavior('#default#userData');
            
        // 
        localStorage.getItem = function(key){
            attrSrc.load(key);
            return attrSrc.getAttribute(key);
        };
        
        localStorage.setItem = function(key, value){
            attrSrc.setAttribute(key, value);
            attrSrc.save(key);
            mark(key);
        };
        
        localStorage.removeItem = function(key){
            attrSrc.removeAttribute(key);
            attrSrc.save(key);
            mark(key, 1);
        };
        
        // clear all attributes on <body> that using for textStorage 
        // and clearing them from the 'data-userdata' attribute's value of <html>
        localStorage.clear = function(){
        
            html.load(prefix);
        
            var attrs = html.getAttribute(prefix).split(','),
                len = attrs.length;
                
            for(var i=0;i<len;i++){
                attrSrc.removeAttribute(attrs[i]);
                attrSrc.save(attrs[i]);
            };
            
            html.setAttribute(prefix,'');
            html.save(prefix);
            
        };
                  
    }(); 


    //使用cookie来存储信息
    cookieStorage = {
        getItem: function(key){
            var cookie = document.cookie;

            var cookieReg = new RegExp("(?:^|;+|\\s+)" + key + "=([^;]*)");
            var value = cookie.match(cookieReg);
            
            return !value ? "" : value[1];
        },

        setItem: function(key, value){
            var cookieString = key + "=" + value + ";max-age=" + (60 * 60 * 24 * 356);
            document.cookie = cookieString;
        }
    };

    dorsyClip.init();

};
﻿/**
 * css javascript文件
 * @author dorsywang(bin wang)
 * @email dorsywang@tencent.com
 */

dorsyClip.module("css", function(M){

//图片的base64格式
var dorsyIconImg = "data:image/png;base64,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";
var dorsyLogoImg = "data:image/png;base64,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";

var mainCss = "\
.dorsyToolbarWrapper{\
    width: 100%;\
    height: 68px;\
    position:fixed;\
    bottom:0;\
    left: 0;\
    z-index:1000;\
}\
.dorsyToolbar{\
    width:480px;\
    margin: 0 auto;\
    filter:Alpha(opacity=90);\
    opacity: 0.9;\
    background: #3f3f3f;\
    height:68px;\
    position:relative;\
    border-radius:4px;\
    border-bottom-left-radius: 0;\
    border-bottom-right-radius: 0;\
}\
.dorsyIcon{\
    background:url(" + dorsyIconImg + ") no-repeat 11px 7px;\
    width:58px;\
    height:60px;\
    margin-top:3px;\
    cursor:pointer;\
    margin-left:20px;\
    float:left;\
    border:2px solid #3f3f3f;\
}\
.dorsyIcon:hover, .dorsyIconSelected{\
    border:2px solid #ccc;\
    border-radius:3px;\
}\
#dorsyClipT{\
    background-position:-79px 7px;\
}\
#dorsyScale{\
    background-position:-170px 7px;\
}\
#dorsyOpacity{\
    background-position:-256px 7px;\
}\
#dorsyLogo{\
    background:url(" + dorsyLogoImg + ") no-repeat;\
    width:131px;\
    height:36px;\
    position:absolute;\
    right:12px;\
    top:33px;\
    cursor:pointer;\
}\
\
.dorsyRect{\
    border:1px solid red;\
    position:absolute;\
    z-index:1000;\
}\
.dorsyInfo{\
    position:absolute;\
    z-index:1000;\
}\
.dorsyInfoNum{\
    color:red;\
    font-size:18px;\
}\
.dorsySlideBarWrapper{\
    position:fixed;\
    bottom:68px;\
    width:100%;\
    z-index: 10000;\
}\
.dorsySlideBar{\
        width:300px;\
        height:15px;\
        border:2px solid #ccc;\
        position:relative;\
        border-radius:10px;\
        margin-top:10px;\
        margin-bottom:10px;\
        vertical-align:bottom;\
        margin:0 auto;\
}\
.dorsySlideBar a{\
        display:block;\
        position:absolute;\
        left:135px;\
        top:-20%;\
        width:20px;\
        height:140%;\
        border:1px solid #999;\
        border-radius:20px;\
        background:#999;\
}\
.dorsySlideBar .dMsg{\
        position:absolute;\
        right:-20px;\
        top:0;\
}\
body{\
}\
";

    return {
        applyStyle: function(){
            var head = document.getElementsByTagName("head");

            var styleEl = document.createElement("style");
            try{
                styleEl.innerHTML = mainCss;

                head[0].appendChild(styleEl);

            //for badly ie 8-
            }catch(e){
                var div = document.createElement("div");
                div.innerHTML = "&nbsp;<style type='text/css'>" + mainCss + "</style>";

                head[0].appendChild(div);
                head[0].replaceChild(div.getElementsByTagName("style")[0], div);
            }
        }
    };
});
/**
 * @description eventBind file
 * @author dorsywang(Bin Wang)
 * @email 314416946@qq.com
 */

dorsyClip.module("eventBind", function(M){
    var bind = (function(){
        var method = "";

        if(window.addEventListener){

            return function(el, event, func){
                el.addEventListener(event, func, false);
            };
        }else{
            return function(el, event, func){
                el.attachEvent("on" + event, func);
            };
        }
        
    })();

    var unbind = (function(){
        var method = "";

        if(window.addEventListener){

            return function(el, event, func){
                el.removeEventListener(event, func, false);
            };
        }else{
            return function(el, event, func){
                el.detachEvent("on" + event, func);
            };
        }
        
    })();

    var packageContent = {
        init: function(){
            var _this = this;
            //d & d
            function offset(e, type){
                if(type == "x"){
                    return e.offsetX ? e.offsetX : e.pageX;
                }else{
                    return e.offsetY ? e.offsetY : e.pageY;
                }
            }

            var clickFlag = 0, x0, y0, leftX, leftY, isClipT_el;

            //鼠标按下
            bind(window.document, "mousedown", function(e){
                if(! M.status.isOpen && ! M.el) return;

                e.target && console.log(e.target.className);
                if(/dorsyIcon/.test(e.target && e.target.className)){
                    return;
                }

                clickFlag = 1;

                x0 = e.clientX;
                y0 = e.clientY;

                leftX = parseInt(M.el.style.left);
                leftY = parseInt(M.el.style.top);

                //如果标尺被按下，在click的时候创建一个元素
                if(M.status.isClipT){
                    isClipT_el = M.view.createClipEle(x0, y0);
                    (e.preventDefault && e.preventDefault()) || (e.returnValue = false);
                }

                (e.preventDefault && e.preventDefault()) || (e.returnValue = false);
                e.cancelBubble = true;

            });

            bind(window.document, "mouseup", function(){
                clickFlag = 0;

                M.status.slideDown = 0;
            });

            bind(document.body, "mousemove", function(e){
                if(! M.status.isOpen) return;

                if(clickFlag){
                        var x = e.clientX;
                        var y = e.clientY;
                        
                        var dx = x - x0;
                        var dy = y - y0;

                    //如果 标尺被按下 优先级高于移动
                    if(M.status.isClipT){
                        isClipT_el.rect.style.width = dx + "px";
                        isClipT_el.rect.style.height = dy + "px";
                        M.view.updateClipT(isClipT_el, dx, dy);
                    }

                    if(M.status.slideDown){

                        (dorsySlideLeft + dx > 0 && dorsySlideLeft + dx < parseInt(M.util.css(document.getElementById("dorsySlideBar"), "width"))) && function(){
                            document.getElementById("dorsySlideA").style.left = (dorsySlideLeft + dx) + "px";
                            var value = (dorsySlideLeft + dx) / parseInt(M.util.css(document.getElementById("dorsySlideBar"), "width"));

                            M.util.Bar.notify(value);
                            //阻止其他监听
                            (e.preventDefault && e.preventDefault()) || (e.returnValue = false);
                        }();

                        return;
                    }

                    if(clickFlag && ! M.status.isFixed && ! M.status.isClipT){
                        

                        M.el.style.left = leftX + dx + "px";
                        M.el.style.top = leftY + dy + "px";

                    }

                    //阻止其他默认监听
                    (e.preventDefault && e.preventDefault()) || (e.returnValue = false);
                }
            });

            var ctrlFlag = 0;
            bind(window.document, "keydown", function(e){
                if(! M.status.isOpen) return;

                if(e.keyCode == 17){
                    ctrlFlag = 1;
                }

                var left = parseInt(M.el.style.left);
                var top = parseInt(M.el.style.top);
                //right
                if(e.keyCode == 39 && ctrlFlag){
                    M.el.style.left = (left + 1) + "px";
                    e.preventDefault();
                }

                //left
                if(e.keyCode == 37 && ctrlFlag){
                    M.el.style.left = (left - 1) + "px";
                    e.preventDefault();
                }

                //up
                if(e.keyCode == 38 && ctrlFlag){
                    M.el.style.top = (top - 1) + "px";
                    e.preventDefault();
                }

                //left
                if(e.keyCode == 40 && ctrlFlag){
                    M.el.style.top = (top + 1) + "px";
                    e.preventDefault();
                }
            });


            bind(window.document, "keyup", function(e){
                if(e.keyCode == 17){
                    ctrlFlag = 0;
                }
            });

            bind(document.getElementById("dorsyFix"), "click", function(){
                if(! M.status.isOpen) return;

                M.status.isFixed = M.status.isFixed ? 0 : 1;
                M.view.toggleFixDesign();
            });

            bind(document.getElementById("dorsyClipT"), "click", function(){
                if(! M.status.isOpen) return;

                M.status.isClipT = M.status.isClipT ? 0 : 1;
                M.view.toggleClipT();
            });

            bind(document.getElementById("dorsyLogo"), "click", function(e){
                M.status.isOpen = M.status.isOpen ? 0 : 1;

                M.model.write("dorsyIsOpen", M.status.isOpen);
                M.view.toggleOpen();
            });

            bind(document.getElementById("dorsyOpacity"), "click", function(){
                M.status.isOpacity = M.status.isOpacity ? 0 : 1;
                M.view.toggleOpacity();
            });

            var dorsySlideLeft = 0;
            M.util.addEvent(document.body, "#dorsySlideA", "mousedown", function(e){
                M.status.slideDown = 1;
                dorsySlideLeft = parseInt(M.util.css(this, "left"));
            });

        }
    };
    return packageContent;
});
/**
 * @description model file
 * @author dorsywang(Bin Wang)
 * @email 314416946@qq.com
 */

dorsyClip.module("model", function(M){

    var packageContent = {
        //写入一个持久的变量
        write: function(name ,value){
            localStorage ? localStorage.setItem(name, value) : cookieStorage.setItem(name, value);
        },

        //读入一个持久的变量
        read: function(name){
            return localStorage ? localStorage.getItem(name) : cookieStorage.getItem(name);
        }
    };

    return packageContent;
});
/**
 * @description util file
 * @author dorsywang(Bin Wang)
 * @email 314416946@qq.com
 */


dorsyClip.module("util", function(M){
    var packageContent = {
        addEvent: function(proxyNode, selector, eventType, func){//为代理节点添加事件监听
                    var proName = "",flag = 0;
                    if(typeof(selector) == "string"){

                        flag = 1;
                        switch(true){
                            case /^\./.test(selector) :
                                proName = "className";
                                selector = selector.replace(".", "");
                                selector = new RegExp(" *" + selector + " *");
                                break;
                            case /^\#/.test(selector) :
                                proName = "id";
                                selector = new RegExp(selector.replace("#", ""));
                                break;
                            default: 
                                selector = new RegExp(selector);
                                proName = "tagName";
                        }

                    }

                    var addEvent = window.addEventListener ? "addEventListener" : "attachEvent";
                    var eventType = window.addEventListener ? eventType : "on" + eventType;

                    proxyNode[addEvent](eventType,function(e){

                            function check(node){

                                if(flag){
                                    if(selector.test(node[proName])){

                                        func.call(node, e);
                                        return;
                                    };
                                }else{
                                    if(selector == node){
                                        func.call(node, e);
                                        return;
                                    };
                                }

                                if(node == proxyNode || node.parentNode == proxyNode) return;
                                check(node.parentNode);
                            }

                            check(e.srcElement);
                    });
        },

      each: function(els, func){
        for(var i = 0, n = els.length;i < n;i ++){
          func.call(els[i], i);
        }
      },

      addClass: function(el, className){
        if(el.className.match(className)){
        }else{
          el.className += " " + className;
        }
      },

      removeClass: function(el, className){
        el.className = el.className.replace(new RegExp(" ?" + className), "");
      },

      //获取元素的第一个子元素节点
      firstChild: function(el){
        for(var i = 0;i < el.childNodes.length;i ++){
          if(el.childNodes[i].nodeType == 1){
            return el.childNodes[i];
          }
        }
      },

      //获得元素的最后一个子元素节点
      lastChild: function(el){
         for(var i = el.childNodes.length - 1;i >= 0;i --){
           if(el.childNodes[i].nodeType == 1){
            return el.childNodes[i];
          }
         }
       },

      //执行动画   类似jquery animate
      animate: function(el, endCss, time, callBack){
         var FPS = 60;
         var everyStep = {}, currStyle = {};

         for(var i in endCss){
           var currValue = parseInt(this.css(el, i));
           currStyle[i] = currValue;

           everyStep[i] = parseInt(parseInt(endCss[i]) - currValue) / time;
         }

         //当前frame
         var frame = 0, timer;

         function step(){
           frame ++;

           //当前时间 ms
           var t = frame / FPS * 1000;

           //对时间做缓动变换

           //标准化当前时间
           var t0 = t / time;

           //变换函数
           var f = function(x, p0, p1, p2, p3){

             //二次贝塞尔曲线
             //return Math.pow((1 - x), 2) * p0 + (2 * x) * (1 - x) * p1 + x * x * p2; 

             //基于三次贝塞尔曲线 
             return p0 * Math.pow((1 - x), 3) + 3 * p1 * x * Math.pow((1 - x), 2) + 3 * p2 * x * x * (1 - x) + p3 * Math.pow(x, 3);
           }

           //对时间进行三次贝塞尔变换 输出时间
           var t1 = f(t0, 0, 0.42, 1.0, 1.0) * time;

           for(var i in everyStep){
             el.style[i] = (currStyle[i] + everyStep[i] * t1) + "px";
           }

           if(frame == time / 1000 * FPS){
             clearInterval(timer);
             callBack && callBack();
           }
         }

         timer = setInterval(step, 1000 / FPS);

      },

      //对cookie的读写操作
      cookie: function(name, value){
        if(value){
        }else{
            var cookies = document.cookie;
            var cookieReg = new RegExp(";?" + name + "=([^;]+);");
            return cookieReg.exec(cookies)[1] || null;
        }
      },

      //jsonp
      loadScript: function(url){
        var script = document.createElement("script");
        script.src = url;
        script.onload = function(){
        };
        document.body.appendChild(script);
      },
      
      //读取元素的css属性值
      css: function(el, property){
        try{
            return el.currentStyle[property] || el.style[property];
        }catch(e){
            var computedStyle = getComputedStyle(el);
            return computedStyle.getPropertyValue(property);
        }
      },

      setOpacity: function(el, value){
        if(window.addEventListener){
            el.style && (el.style.opacity = value);
        }else{
            el.style && (el.style.filter = "alpha(opacity=" + (value * 100) + ")");

            function setChild(el){
                var children = el.childNodes; 
                for(var j = 0, n = children.length; j < n; j ++){
                    children[j] && children[j].nodeType == 1 && (children[j].style.filter = "alpha(opacity=" + (value * 100) + ")") || setChild(children[j]);
                }
            }

            setChild(el);
        }
      },

      Bar: {//对滑动bar的事件处理对象
            observer: [],
            notify: function(value){
                for(var i = 0;i < this.observer.length;i ++){
                    this.observer[i](value);
                }
            },
            addObserver: function(func){
                this.observer.push(func);
            }
        }
    };

    return packageContent;

});
/**
 * @description view-control file
 * @author dorsywang(Bin Wang)
 * @email 314416946@qq.com
 */

dorsyClip.module("view", function(M){
    //事件处理者
    var eventListener = {
    };

    var packageContent = {
        eventListener: eventListener,
        init: function(){
            this.createToolBar();

            M.status.isOpen = parseInt(M.model.read("dorsyIsOpen"));

            var dorsyLogo = document.getElementById("dorsyLogo");

            if(M.status.isOpen){
                this.createDesignEle();
                dorsyLogo.style.width = "131px";
            }else{
                dorsyLogo.style.width = "78px";
            }

            //设置css
            M.css.applyStyle();

        },

        //创建视觉稿图片
        createDesignEle: function(){
            document.body.style.position = "relative";

            var el = document.createElement("img");
            el.src = M.config.designUrl || "home.jpg";
            el.style.position = "absolute";
            el.style.left = M.config.left + "px";
            el.style.top = M.config.top + "px";
            
            M.util.setOpacity(el, 0.5);

            el.style.zIndex = "999";
            el.setAttribute("draggable", "false");

            el.onerror = function(e){
                if(M.config.designUrl){
                    throw new Error("视觉图片" + el.src + "没有找到,请检查路径是否正确--dorsyClip");
                }else if(/home.png/.test(el.src)){
                    throw new Error("视觉图片" + el.src + "没有找到,请检查路径是否正确--dorsyClip");
                }else{
                    el.src = "home.png";
                }
            };

            el.onload = function(e){
                M.config.designUrl = M.config.designUrl || el.src;
            };


            document.body.appendChild(el);
            //document.body.style.opacity = "0.5";
            
            M.el = el;

        },

        //创建工具条
        createToolBar: function(){
            var toolBar = document.createElement("div");
            toolBar.className = "dorsyToolbarWrapper";

            document.body.appendChild(toolBar);

            toolBar.innerHTML = "<div class='dorsyToolbar'><div id='dorsyFix' class='dorsyIcon' title='固定'></div><div id='dorsyClipT' title='测距' class='dorsyIcon'></div><div id='dorsyScale' title='缩放' class='dorsyIcon'></div><div class='dorsyIcon' id='dorsyOpacity' title='透明度'></div><div id='dorsyLogo' style='width:131px' title='开关'></div></div>";
        },

        //设置body的透明度
        setBodyOpicy: function(op){
            /*
            all = document.getElementsByTagName("*");;
            for(var i = 0;i < all.length; i ++){
                all[i].style.opacity = "0.9";
            }
            */

            var bodyChildren = document.body.childNodes;
            for(var i = 0; i < bodyChildren.length; i ++){
                 if(bodyChildren[i]){
                    if(bodyChildren[i].className){
                        if(/^dorsy/.test(bodyChildren[i].className)){
                            continue;
                        }
                    }else{
                    }

                    M.util.setOpacity(bodyChildren[i], op);
                 }
            }
        },

        //创建滑动bar
        createSlideBar: function(){
            var barHtml = "<div id='dorsySlideBar' class='dorsySlideBar' rangeMin='-50' rangeMax='50'><a id='dorsySlideA' draggable='false' href='#'></a><div class='dMsg'></div></div>";
            var slideBar = document.createElement("div");
            slideBar.innerHTML = barHtml;
            slideBar.className = "dorsySlideBarWrapper";
            M.slideEle = slideBar;

            document.body.appendChild(slideBar);
            M.util.animate(slideBar, {bottom: "85px"}, 300);

            var _this = this;
            M.util.Bar.addObserver(function(value){
                M.status.opacityValue = value;

                M.status.isFixed && _this.setBodyOpicy(value);
                ! M.status.isFixed && function(){
                    M.util.setOpacity(M.el, value);
                }();
            });
        },

        //点击透明度
        toggleOpacity: function(){
            if(M.status.isOpacity){
                this.createSlideBar();
                M.util.addClass(document.getElementById("dorsyOpacity"), "dorsyIconSelected");
            }else{
                M.util.removeClass(document.getElementById("dorsyOpacity"), "dorsyIconSelected");
                M.util.animate(M.slideEle, {bottom: "68px", opacity: "0"}, 300, function(){
                    document.body.removeChild(M.slideEle);
                });
            }
        },

        //固定为背景
        fixDesign: function(){

            //将当前的图片left top 值设置为config值
            M.config.left = parseInt(M.el.style.left);
            M.config.top = parseInt(M.el.style.top);

            console.log("t" + M.config.top);

            M.model.write("dorsy_left", M.config.left);
            M.model.write("dorsy_top", M.config.top);

            document.body.removeChild(M.el);

            //设置body的透明度
            this.setBodyOpicy(0.5);

            document.body.style.background = "url(" + M.config.designUrl + ") no-repeat " + M.config.left + "px " + (M.config.top) + "px";

            M.util.addClass(document.getElementById("dorsyFix"), "dorsyIconSelected");
        },

        //解除固定
        unfixDesign: function(){
            document.body.style.background = "none";
            this.setBodyOpicy(1);

            this.createDesignEle();
            M.util.removeClass(document.getElementById("dorsyFix"), "dorsyIconSelected");
        },

        toggleFixDesign: function(){
            if(M.status.isFixed){
                this.fixDesign();
            }else{
                this.unfixDesign();
            }
        },

        //创建标尺元素
        createClipEle: function(x, y){
            var x0 = x || 0;
            var y0 = y || 0;

            var el = document.createElement("div");
            el.className = "dorsyRect";
            el.style.left = x0 + "px";
            el.style.top = y0 + "px";

            var info = document.createElement("div");
            info.className = "dorsyInfo";
            info.style.left = x0 + "px";
            info.style.top = y0 + "px";

            document.body.appendChild(el);
            document.body.appendChild(info);

            var clipNode = {
                rect: el,
                info: info
            };

            M.status.clipNodes.push(clipNode);

            return clipNode;
        },

        //更新标尺
        updateClipT: function(el, w, h){

            el.info.innerHTML = "长度: <span class='dorsyInfoNum'>" + w + "</span>px, 高度:<span class='dorsyInfoNum'>" + h + "</span>px";
        },

        //标尺元素视觉
        toggleClipT: function(){
            if(M.status.isClipT){
                M.util.addClass(document.getElementById("dorsyClipT"), "dorsyIconSelected");
                document.body.style.cursor = "crosshair";
            }else{
                M.util.removeClass(document.getElementById("dorsyClipT"), "dorsyIconSelected");
                document.body.style.cursor = "auto";

                this.clearClipT();
            }
        },

        //清除所有的标尺信息
        clearClipT: function(){
            var els = M.status.clipNodes;
            for(var i = 0, n = els.length; i < n; i ++){
                document.body.removeChild(els[i].rect);
                document.body.removeChild(els[i].info);
            }

            M.status.clipNodes = [];
        },

        //开启关闭dorsyClip
        toggleOpen: function(){
            var el = document.getElementById("dorsyLogo");
            var _this = this;

            if(M.status.isOpen){
                M.util.animate(el, {width: "131px"}, 400, function(){
                   ! M.status.isFixed && _this.unfixDesign();
                   M.status.isFixed && function(){
                        document.body.style.background = "url(" + M.config.designUrl + ") no-repeat " + M.config.left + "px " + (M.config.top) + "px";

                        //设置body的透明度
                        _this.setBodyOpicy(0.5);

                   }();

                });
            }else{
                M.util.animate(el, {width: "78px"}, 400, function(){
                    ! M.status.isFixed && document.body.removeChild(M.el);
                    document.body.style.background = "none";

                        //设置body的透明度
                        _this.setBodyOpicy(1);
                       M.status.isOpacity && ! (M.status.isOpacity = 0) && _this.toggleOpacity();
                });
            }
        }

    };

    return packageContent;
});
