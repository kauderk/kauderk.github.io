### Can't they be like `{{[[video]]}}` components and it's features?
- I believe Roam Research does not expose their components; thus YT GIFs have to be their own separate extension, and for that matter they work exclusively with Youtube videos.

---
### How do i use it?
- Core funcionality: while exiting the frame, hold down the middle mouse button ("InAndOutKeys") to unmute videos

| [URL parameters](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#what-are-url-parameters-how-do-i-use-them) |                          |                                           |
|----------------|--------------------------|-------------------------------------------|
| ?t=            | start timestamp boundary | get the most out the extension - optional |
| &end=          | end timestamp boundary   | get the most out the extension - optional |
| &s=            | playback speed up to 2   | optional                                  |
| &vl=           | volume form 0 to 100     | optional                                  |

- Create `{{[[yt-gif]]}}` components
    - {{[[yt-gif]]: https://youtu.be/sFFwvr6l2mM?t=60&end=120 }}
- Or simply paste a `YouTube url` and format it with [Simulate url button to video component](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#simulate-url-button-to-video-component) enabled.
    - https://youtu.be/sFFwvr6l2mM?t=60 


---
### What are "InAndOutKeys"?
**While you exit** a frame/iframe/player/playbox/YTGIF **HOLD DOWN** either Alt - Ctrl - Shift or the Middle Mouse Button to unmute and or keep playing the video.
They can vary depending on the `Play Style` or `Sound Style` you choose.
    - Search `: InAndOutKeys` within your graph and enable the ones you'd like to use.


---
### Timestamps
- `{{[[video]]}}` and `{{[[yt-gif]]}}` components will use their own timestamps. They do not share logic, nor functionality.

#### The capture shortcuts don't work
- I'm afraid it's a Javascript cross Browser compatibility issue.
#### The capture smartblocks don't work
- There are `Smartblocks` and `SmartblocksV2`, the YT GIF extension uses the latest version of Smartblocks.


---
### Why is the playbox is so small? Can the playbox of GIf be resized?
- Append `&sp=100` [url parameter](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#what-are-url-parameters-how-do-i-use-them) to the youtube video url within a YTGIF you should be able to override the playbox/player span.
If this doesn't work, most likely you're using a custom css rules that conflicts with the YT GIF extension; downwards the `rm-block__input` element.


---
### What is the difference between [[video]] and [[yt-gif]]?
- `{{[[video]]}}` is a native component by Roam Research that supports multiple video types, and `{{[[yt-gif]]}}` is a component made by me that supports only Youtube videos (urls).



---
### What does "Iframe/Player Buffer" do?
- The nature of Roam Research makes it so you can open multiple pages with multiple blocks within them; YT GIFs, ultimately iframes, are way too expensive to have them loaded in the background all the time. The solution is to use a buffer; those oldest ones will be unloaded and ready to be played once you interact with them.



---
### Player Customizations
Customize each YT GIF, even multiple ones within the same block
  - ![image](https://user-images.githubusercontent.com/65237382/147406576-0bac7a67-dad0-441b-9836-c6eeaef93d23.png)

#### How do I change the volume?
- Append `&vl=50` [url parameter](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#what-are-url-parameters-how-do-i-use-them) to the youtube video url within a YTGIF. Keep in mind this is a custom parameter, and it's not supported by YouTube.

#### Can I set a custom playback speed?
- Append `&s=2` [url parameter](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#what-are-url-parameters-how-do-i-use-them) to the youtube video url within a YTGIF. Keep in mind this is a custom parameter, and it's not supported by YouTube.

#### Does it support multiple languages?
- Only the video player interface does. You will find more information within your own graph: `player_captions_on_load `, `player_captions_language` and `player_interface_language`.


---
### What is a "Timestamp Display"?
- Invisible anlong with the custom `YT GIF Controls`, hover over the *mid area* to reveal them.
    - ![image](https://user-images.githubusercontent.com/65237382/148078182-9a7d4189-a9d2-4488-b787-0e678a94b25b.png)
    - Scroll inside the actual `Timestamp` to back and forward (player).

Because the main feature of the YT GIF extension is to use timestamps as boundaries, you might be interested to see the duration of a small section, or the position relative to the entire video.



---
### Embracing `{{[[embed]]}}` and `((xxxuidxxx))` block references
YT GIFs, YT GIFs Timestamps & YT GIF Url Buttons will be rendered along with Roam Research's nesting block system. I encourage people to not hold back form exploding this `feature`; after all, it is what Roam Research users find more exciting about the software.

### Limitations
- **Sometimes** they will not work with **expanded** `{{=:|}}` tooltip cards. Why? [Because I can't find a way to retrieve their `uid` of origin.](https://roamresearch.slack.com/archives/CTAE9JC2K/p1638578496037700)



---




---
### What is "roam/js/kauderk/yt-gif/settings" really doing in my graph?
- The main and only purpose of this file is to store settings for the extension. Because Roam Research can be accesed from any device with a browser, it's wiser to store users data within their own graphs. Now, so far it stores numeric values, on and off switches, and strings.
It is a [javascript file](https://github.com/kauderk/kauderk.github.io/blob/main/yt-gif-extension/v0.2.0/testing/js/settings-page.js) that uses the `Roam Alpha API` to read and write the settings in the form of blocks, with the following structure: 
    -  `(xxxuidxxx)` : `yt_gif_settings_key` : `<value>`
    
### I change the `<values>` but nothing happens
- Any manual change done to `"roam/js/kauderk/yt-gif/settings"` block's values will be reflected **once you reload your graph** (with the extension running).
    - If you don't see `_opt` blocks nested along with a particular setting, most likekly it is a bynary input.
        - `<1>` or `<true>` means `on`
        - `<>` or `<false>` means `off`
    - Now, if you see `<>` or `<1>`, it means they were never been updated within your graph - you never interacted with them - factory settings.



---
### What are the URL parameters? How do I use them?
- Well, it depends, the way url parameters work:
In this case, youtube video urls, `https://youtu.be/videoID?` notice the `?` question mark, the first parameter will be anything supported, like `t=` start and `end=` etc.
But after any of them you'd like to use - **every single one must be chained** with a `&` before the actual parameter, like `&t=` start or `&end` end.
Now, most YTGIFs users are used to `https://youtu.be/videoID?t=0&end=100` for example. Starting form there, YT GIF supports additional parameters like `&s=` speed, ` &vl=` volume and [more...](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install#:~:text=Customize%20each%20YT%20GIF%2C%20even%20multiple%20ones%20within%20the%20same%20block)



---
### Simulate url button to video component

### How do they differentiate from the native feature?
- Currently, Roam Research's video buttons will format every single link; they will not respect current components `{{[[video]]}}` or any other.
YT GIF's Url Buttons will try to find the one the user requested (clicked on).

### Caution Prompt
- But I shall warn everybody who's reading this, it is using the function `window.roamAlphaAPI.updateBlock` to perform the changes (formatting), which means: that block on which you clicked on **will be updated [after it passes my standards](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#embracing-embed-and-xxxuidxxx-block-references)**. If Roam Research where to change: `css classes`, `uid's structure` or the `updateBlock` function itself. People might lose information related to that particular block.

- LocalStorage Key
    - The browser on which you accept to simulate the feature.
    - Once accepted, the confirmation prompt won't appear again, unless you clear your `localStorage`.
- Graph Key
    - Within your graph, search `simulate_url_to_video_component` under your `roam/js/kauderk/yt-gif/settings` page.

### How do I use it?
- With the simulation running `YT GIF Icon > Miscellaneous > Simulate url button to video component`
- Create blocks and paste urls such as this one `https://www.youtube.com/watch?v=loK7BWFdwlc`
- Hover over the play ▶️ button next to the url
- It's YT GIF version will pop up to the right
- Click on it to format it like this: `{{[[yt-gif]]: https://www.youtube.com/watch?v=loK7BWFdwlc }}`
    - ![Snag_3587bd78](https://user-images.githubusercontent.com/65237382/148058480-a1f3f175-590c-45fd-baf2-5cc97d14fe56.png)


---



> I can't find what I'm looking for.

- Submit your issue [![Issue URL](https://img.shields.io/badge/GitHub-issue-yellow)](https://github.com/kauderk/kauderk.github.io/issues)
- Contact me on [![Twitter URL](https://img.shields.io/twitter/url?label=KauDerK_&style=social&url=https%3A%2F%2Ftwitter.com%2FkauDerk_)](https://twitter.com/kauDerk_)
ﾠ
