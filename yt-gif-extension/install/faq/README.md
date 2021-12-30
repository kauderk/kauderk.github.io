### Can't they be like `{{[[video]]}}` components and it's features?
- I believe Roam Research does not expose their components, thus YT GIFs have to be their own separate extension, and for that matter they work exclusively with Youtube videos.


---
### What are "InAndOutKeys"?
Whenever you exit a frame/iframe/player/playbox/YTGIF hold down either Alt - Ctrl - Shift or the Middle Mouse Button to unmute and or keep playing the video.
They can vary depending on the `Play Style` or `Sound Sytle` you choose.


---
### Timestamps
- `{{[[video]]}}` and `{{[[yt-gif]]}}` components will use their own timestamps. They do not share logic, nor functionality.

#### The capture shortcuts don't work
- I'm affraid it's a Javascript cross Browers compatibility issue.
#### The capture smartblocks don't work
- There are `Smartblocks` and `SmartblocksV2`, the YT GIF extension uses the latest version of Smartblocks.


---
### Why the playbox is so small? Can the playbox of GIf be resized?
- Append `&sp=100` [url parameter](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#what-are-url-parameters-how-do-i-use-them) to the youtube video url within a YTGIF you should be able to override the playbox/player span.
If this doesn't work, most likely you're using a custom css rules that conflicts with the YT GIF extension, downwards the `rm-block__input` elemeent.


---
### What is the difference between [[video]] and [[yt-gif]]?
- `{{[[video]]}}` is a native component by Roam Research that supports multiple video types and `{{[[yt-gif]]}}` is a component made by me that supports only Youtube videos (urls).


---
### What does "Iframe/Player Buffer" do?
- The nature of Roam Research makes it so you can open multiples pages with multiple blocks within them and YT GIFs, ultimately iframes, are way too expensive to have them loaded in the background all the time. The solution is to use a buffer, those oldest ones will be unloaded and ready to be played once you interact with them.


---
### How do I change the volume?
- Append `&vl=50` [url parameter](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#what-are-url-parameters-how-do-i-use-them) to the youtube video url within a YTGIF. Keep in mind this is custom parameter, and it's not supported by YouTube.


---
### Can I set a custom playback speed?
- Append `&s=2` [url parameter](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#what-are-url-parameters-how-do-i-use-them) to the youtube video url within a YTGIF. Keep in mind this is custom parameter, and it's not supported by YouTube.


---
### Does it support multiple languages?
- Only the video player interface does. You will find more information within your own graph: `player_captions_on_load `, `player_captions_language` and `player_interface_language`.


---
### What is a "Timestamp Display"?
Because the main fueature of the YT GIF extension is to use the timestamps boundaries, you might be interested see the duration of a small section or the position releative to the entire video.


---
### What is "roam/js/kauderk/yt-gif/settings" really doing in my graph?
- The main and only purpose of this file is to store settings for the extension. Because Roam Research can be accesed from any device with a browser, it's wiser to store users data within their own graphs. Now, so far it stores numeric values, on and off switches, and strings.
It is a [javascript file](https://github.com/kauderk/kauderk.github.io/blob/main/yt-gif-extension/v0.2.0/testing/js/settings-page.js) that uses the `Roam Alpah API` to read and write the settings in form of blocks, with following structure: 
    -  `(xxxuidxxx)` : `yt_gif_settings_key` : `<value>`

---
### What are url parameters? How do I use them?
- Well it depends, the way url parameters work:
In this case youtube video urls, `https://youtu.be/videoID?` notice the `?` question mark, the first parameter will be anything supported, like `t=` start and `end=` etc.
But after any of them you'd like to use - **every single one must be chained** with a `&` before the actual parameter, like `&t=` start or `&end` end.
Now, most YTGIFs users are used to `https://youtu.be/videoID?t=0&end=100` for example. Starting form there, YT GIF support additional parameters like `&s=` speed, ` &vl=` volume and [more...](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install#:~:text=Customize%20each%20YT%20GIF%2C%20even%20multiple%20ones%20within%20the%20same%20block)


---

> I can't find what I'm looking for.

- Submit your issue [![Issue URL](https://img.shields.io/badge/GitHub-issue-yellow)](https://github.com/kauderk/kauderk.github.io/issues)
- Contact me on [![Twitter URL](https://img.shields.io/twitter/url?label=KauDerK_&style=social&url=https%3A%2F%2Ftwitter.com%2FkauDerk_)](https://twitter.com/kauDerk_)
ﾠ
