dorsyClip.module("view", function(M){
    //事件处理者
    var eventListener = {

        getBottleSuccess: function(data){
        }

    };

    var packageContent = {
        eventListener: eventListener,
        init: function(){
            this.createDesignEle();
            this.createToolBar();

            M.status.isOpen = 1;

        },

        //创建视觉稿图片
        createDesignEle: function(){
            document.body.style.position = "relative";

            var el = document.createElement("img");
            el.src = M.config.designUrl || "home.jpg";
            el.style.position = "absolute";
            el.style.left = M.config.left + "px";
            el.style.top = M.config.top + "px";
            el.style.opacity = "0.5";
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
                 bodyChildren[i] && (bodyChildren[i].className && (! /^dorsy/.test(bodyChildren[i].className))) && bodyChildren[i].style && (bodyChildren[i].style.opacity = op);
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
                    M.el.style.opacity = value;
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
        toggleOpen: function(el){
            var _this = this;

            if(M.status.isOpen){
                M.util.animate(el, {width: "131px"}, 600, function(){
                   ! M.status.isFixed && _this.unfixDesign();
                   M.status.isFixed && function(){
                        document.body.style.background = "url(" + M.config.designUrl + ") no-repeat " + M.config.left + "px " + (M.config.top) + "px";

                        //设置body的透明度
                        _this.setBodyOpicy(0.5);

                   }();

                });
            }else{
                M.util.animate(el, {width: "78px"}, 600, function(){
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
