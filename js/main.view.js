Main.module("view", function(M){
    //事件处理者
    var eventListener = {

        getBottleSuccess: function(data){
        }

    };

    var packageContent = {
        eventListener: eventListener,
        init: function(){
            M.config.designUrl = "dxPs/home.jpg";

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

            console.log(M.config.top);

            document.body.appendChild(el);
            //document.body.style.opacity = "0.5";
            
            M.el = el;

        },

        //创建工具条
        createToolBar: function(){
            var toolBar = document.createElement("div");
            toolBar.style.position = "fixed";
            toolBar.style.bottom = "0";
            toolBar.style.background = "red";
            toolBar.style.height = "100px";
            toolBar.style.width = "100px";
            toolBar.style.zIndex = "1000";

            document.body.appendChild(toolBar);

            toolBar.innerHTML = "<div id='dorsyFix'>固定</div>";
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
        }

    };

    return packageContent;
});
