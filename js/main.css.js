/**
 * css javascript文件
 * @author dorsywang(bin wang)
 * @email dorsywang@tencent.com
 */

dorsyClip.module("css", function(M){

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
    opacity: 0.5;\
    background: #3f3f3f;\
    height:68px;\
    position:relative;\
    border-radius:2px;\
}\
.dorsyIcon{\
    background:url(images/dorsyIcon.png) no-repeat 11px 7px;\
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
    background:url(images/dorsyLogo.png) no-repeat;\
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
