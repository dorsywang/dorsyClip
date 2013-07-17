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
