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
