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
