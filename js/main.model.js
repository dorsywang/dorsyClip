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
