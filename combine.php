<?php
$files = scandir("js/");
$contents = file_get_contents("js/main.js");
foreach($files as $file){
    if(preg_match("/[^\.]+\.js$/",$file)){
         if($file == "main.js") continue;
        $contents .= file_get_contents("js/".$file);
    }
}
$wfile = fopen("combined/dorsyClip.js","w+");
if(fwrite($wfile,$contents)){
    echo "OK";
}
