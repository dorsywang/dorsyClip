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

window.onload = function(){
    /**
     * @ NAME: Cross-browser TextStorage
     * @ DESC: text storage solution for your pages
     * @ COPY: sofish, http://sofish.de
     */

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
    Main.init();

};
Main.module("eventBind", function(M){
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
            bind(window, "mousedown", function(e){
                if(/dorsyIcon/.test(e.target.className)){
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
                    e.preventDefault();
                }


            });

            bind(window, "mouseup", function(){
                clickFlag = 0;
            });

            bind(document.body, "mousemove", function(e){
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

                    if(clickFlag && ! M.status.isFixed && ! M.status.isClipT){
                        

                        M.el.style.left = leftX + dx + "px";
                        M.el.style.top = leftY + dy + "px";

                    }

                    //阻止其他监听
                    e.preventDefault();
                }
            });

            var ctrlFlag = 0;
            bind(window, "keydown", function(e){
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


            bind(window, "keyup", function(e){
                if(e.keyCode == 17){
                    ctrlFlag = 0;
                }
            });

            bind(document.getElementById("dorsyFix"), "click", function(){
                M.status.isFixed = M.status.isFixed ? 0 : 1;
                M.view.toggleFixDesign();
            });

            bind(document.getElementById("dorsyClipT"), "click", function(){
                M.status.isClipT = M.status.isClipT ? 0 : 1;
                M.view.toggleClipT();
            });

        }
    };
    return packageContent;
});
Main.module("model", function(M){

    var packageContent = {
        //写入一个持久的变量
        write: function(name ,value){
            localStorage.setItem(name, value);
        },

        //读入一个持久的变量
        read: function(name){
            return localStorage.getItem(name);
        }
    };

    return packageContent;
});
Main.module("msgbox", function(M){
    var packageContent = {
        show: function(obj){
            $(".msgbox").show("fast");
            $(".msgContent").html(obj.content);
        },

        hide: function(){
            $(".msgbox").hide("fast");
        }
    };

    return packageContent;
});
Main.module("util", function(M){
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
                                    if(selector.test(node[proName].toLowerCase())){
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
           var currValue = parseInt(el.style[i]);
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
            return el.currentStyle[property];
        }catch(e){
            var computedStyle = getComputedStyle(el);
            return computedStyle.getPropertyValue(property);
        }
      }
    };

    return packageContent;

});
Main.module("view", function(M){
    //事件处理者
    var eventListener = {

        getBottleSuccess: function(data){
        }

    };

    var packageContent = {
        eventListener: eventListener,
        init: function(){
            M.config.designUrl = "home.png";

            this.createDesignEle();
            this.createToolBar();

        },

        //创建视觉稿图片
        createDesignEle: function(){
            document.body.style.position = "relative";

            var el = document.createElement("img");
            el.src = M.config.designUrl;
            el.style.position = "absolute";
            el.style.left = M.config.left + "px";
            el.style.top = M.config.top + "px";
            el.style.opacity = "0.5";
            el.style.zIndex = "999";
            el.setAttribute("draggable", "false");


            document.body.appendChild(el);
            //document.body.style.opacity = "0.5";
            
            M.el = el;

        },

        //创建工具条
        createToolBar: function(){
            var toolBar = document.createElement("div");
            toolBar.className = "dorsyToolbarWrapper";

            document.body.appendChild(toolBar);

            toolBar.innerHTML = "<div class='dorsyToolbar'><div id='dorsyFix' class='dorsyIcon' title='固定'></div><div id='dorsyClipT' title='测距' class='dorsyIcon'></div><div id='dorsyScale' title='缩放' class='dorsyIcon'></div><div class='dorsyIcon' id='dorsyOpacity' title='透明度'></div><div id='dorsyLogo'></div></div>";
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

            var all = document.getElementsByTagName("*");;
            for(var i = 0;i < all.length; i ++){
                all[i].style.opacity = "0.9";
            }

            document.body.style.background = "url(" + M.config.designUrl + ") no-repeat " + M.config.left + "px " + (M.config.top) + "px";

            M.util.addClass(document.getElementById("dorsyFix"), "dorsyIconSelected");
        },

        //解除固定
        unfixDesign: function(){
            document.body.style.background = "none";
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
        }

    };

    return packageContent;
});
