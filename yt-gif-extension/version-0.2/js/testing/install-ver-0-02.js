// Within Roam Research
// under a {{[[roam/js]]}} block,
// nest a javascript code block 
// paste this code snippet there 
// and click the button "Yes, I know what I'm doing."
//
// YT GIF Extension - version 0.02 beta
// Persistent settings, interface language customizations & iframe buffer.
//
// disable your previous version, if any, else untested code will be overwritten
var existing = document.getElementById('yt-gif-main');
if (!existing) 
{
    var extension = document.createElement("script");
    extension.src = "https://kauderk.github.io/yt-gif-extension/version-0.2/js/yt-gif-main.js";
    extension.id = "yt-gif-main";
    extension.async = true;
    extension.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(extension);
}
