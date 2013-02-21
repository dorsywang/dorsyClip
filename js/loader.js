var dorsyJs = ["main", "main.model", "main.util", "main.view", "main.eventBind"];
for(var i = 0; i < dorsyJs.length; i ++){
    document.writeln("<script type='text/javascript' src='dorsyClip/js/" + dorsyJs[i] + ".js'></script>");
}
