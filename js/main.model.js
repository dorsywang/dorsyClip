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
