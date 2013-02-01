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
            bind(window, "mousedown", function(e){
                if(! M.status.isOpen || ! M.el) return;

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
                if(! M.status.isOpen || ! M.el) return;

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
                if(! M.status.isOpen || ! M.el) return;

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
                if(! M.status.isOpen) return;

                M.status.isFixed = M.status.isFixed ? 0 : 1;
                M.view.toggleFixDesign();
            });

            bind(document.getElementById("dorsyClipT"), "click", function(){
                if(! M.status.isOpen) return;

                M.status.isClipT = M.status.isClipT ? 0 : 1;
                M.view.toggleClipT();
            });

            bind(document.getElementById("dorsyLogo"), "click", function(){
                M.status.isOpen = M.status.isOpen ? 0 : 1;
                M.view.toggleOpen(this);
            });

        }
    };
    return packageContent;
});
