### Can't they be like `{{[[video]]}}` components and it's features?
- I believe Roam Research does not expose their components; thus YT GIFs have to be their own separate extension, and for that matter they work exclusively with Youtube videos.
- What is the difference between `{{[[video]]}}` and `{{[[yt-gif]]}}` components?
    - `{{[[video]]}}` is a native component by Roam Research that supports multiple video types, and `{{[[yt-gif]]}}` is a component made by me that supports only Youtube videos (urls).



---
---



# How do i use it?
- Main funcionality: while exiting the frame, hold down the middle mouse button ("[InAndOutKeys](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#what-are-inandoutkeys)") to unmute videos
- Create `{{[[yt-gif]]}}` components with [url parameters](https://github.com/kauderk/kauderk.github.io/edit/main/yt-gif-extension/install/faq/README.md#what-are-the-url-parameters-how-do-i-use-them)

    - ```
      {{[[yt-gif]]: https://youtu.be/sFFwvr6l2mM?t=60&end=120 }}
      ```
- Or simply paste a `YouTube url` and format it with [Simulate url button to video component](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#simulate-url-button-to-video-component) enabled.
    - ##### yt-gif icon > Miscellaneous > (top left corner, tutorial drop down menu) > 🎥 [URL Formatter video tutorial](https://youtu.be/1ABtb346pc0) 


---
### What are "InAndOutKeys"?
- ##### yt-gif icon > (bottom icons) Show Info > (bottom left corner, tutorial drop down menu) > 🎥 [InAndOutKeys video tutorial](https://youtu.be/sCC-QXRdcOc)
- **While you exit** a frame/iframe/player/playbox/YTGIF **HOLD DOWN** either Alt - Ctrl - Shift or the Middle Mouse Button to unmute and or keep playing the video.
They can vary depending on the `Play Style` or `Sound Style` you choose.
    - Search `: InAndOutKeys` within your graph and [enable the ones you'd like to use](https://github.com/kauderk/kauderk.github.io/blob/main/yt-gif-extension/install/faq/README.md#i-change-the-values-but-nothing-happens).



---
---



# Timestamps
- `{{[[video]]}}` and `{{[[yt-gif]]}}` components will use their own timestamps. They do not share logic, nor functionality.

### Hod do I use them?
- [How to enable them...](https://github.com/kauderk/kauderk.github.io/blob/main/yt-gif-extension/install/components/README.md#workflow)
- ![image](https://user-images.githubusercontent.com/65237382/147398656-9d6f5c07-e861-4087-8c2c-751d0025ecf6.png)

### How do they differentiate from the native feature?
- You have the ability to set boundaries, meaning you can play section by section and they will loop. `{{[[video-timestamp]]}}` will `seekTo` a value and that's all.
- `YT GIF icon > YT GIF timestamps > Timestamp Recovery` after you edit a block with YT GIF timestamp components, they will update their YT GIF Player accordingly.
    - `YT GIF icon > YT GIF timestamps > Reset boundaries on last active timestamp container removed` will do the oposite.
- You know which one you are currently using, because they change their style, based on if they are active.

### CLICK EVENTS!
- Based on `root` and `cross root` concept - `side/main` and `main/side` bars (for example)
- Right click
    - Play and SeekTo timestamp on your `root`
- Left Click
    - Pause and Mute on your `root`
- Middle click
    - Pause and Mute on your `root`, Open current YT GIF Block on your `cross root`, Play and SeekTo timestamp on your new `root`


#### The capture shortcuts don't work
- `yt-gif icon > YT GIF Timestmap > (bottom row) Shortcut` toggle ON
- ##### yt-gif icon > YT GIF Timestmap > (top left corner, tutorial drop down menu) > 🎥 [Creation video tutorial](https://youtu.be/cXf-PB1Vae4)
- Place your cursor under a `{{[[yt-gif]]}}` block:
    - `"Ctrl or cmd" + Alt + S` > outuputs {{start}} component
    - `"Ctrl or cmd" + Alt + D` > outputs {{end}} component
#### The capture smartblocks don't work
- There are `Smartblocks` and `SmartblocksV2`, the YT GIF extension uses the latest version of Smartblocks.
- Update them from here or [re-import them](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/components).

    - 
        ``` 
        #SmartBlock YTGIF start timestamp 
        ```
        -   ``` 
            const obj = await window.YTGIF?.getTimestampObj?.("start");
            const select = UI?.timestamps?.tm_workflow_grab?.value;
            return obj?.[select]?.fmt ?? '';
            ```
    - 
        ``` 
        #SmartBlock YTGIF end timestamp 
        ```
        -   ``` 
            const obj = await window.YTGIF?.getTimestampObj?.("end");
            const select = UI?.timestamps?.tm_workflow_grab?.value;
            return obj?.[select]?.fmt ?? '';
            ```



---
---



# Player Customizations
Customize each YT GIF, even multiple ones within the same block
  - ![image](https://user-images.githubusercontent.com/65237382/147406576-0bac7a67-dad0-441b-9836-c6eeaef93d23.png)

#### How do I change the volume?
- Append `&vl=50` [url parameter](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#what-are-url-parameters-how-do-i-use-them) to the youtube video url within a YTGIF. Keep in mind this is a custom parameter, and it's not supported by YouTube.

#### Can I set a custom playback speed?
- Append `&s=2` [url parameter](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#what-are-url-parameters-how-do-i-use-them) to the youtube video url within a YTGIF. Keep in mind this is a custom parameter, and it's not supported by YouTube.

#### Does it support multiple languages?
- Only the video player interface does. You will find more information within your own graph: `player_captions_on_load `, `player_captions_language` and `player_interface_language`.

#### How did you make your YouTube Player look like that?
- ![image](https://user-images.githubusercontent.com/65237382/148123731-b5b585e7-0d57-49a4-a2a4-c808aabddb06.png) VS. ![image](https://user-images.githubusercontent.com/65237382/148123710-ecbd8a30-766f-4035-b6ad-e0e07e607240.png)

- Reasons Why
    - I got used to holding down the middle mouse button to keep watching videos, but using any kind of click will focus the iframe/video/player, which is ultimately a website and once out of there, you can't unfocus it.
        - Alternative
            - Using `InAndOutkeys` - the keyboard won't focus the iframe from within. This solves the issue completely.

> Where are the controls?

- Well, they are centered at the bottom, and they appear once I hover over them. It's easier on the eyes, if you know where/what to look for, you don't know need see them all the time.
- [You can follow these steps...](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/resources/css/Beautiful%20YT%20iframe%20controls)
    - ##### yt-gif icon > Miscellaneous > (top left corner, tutorial drop down menu) > 🎥 [Video Controls video tutorial](https://youtu.be/1ABtb346pc0)
        - shows you what it looks like



---

### What is a "Timestamp Display"?
- Invisible within the `YT GIF Controls`. *hover over the *mid area* to reveal them*
    - ![image](https://user-images.githubusercontent.com/65237382/148078182-9a7d4189-a9d2-4488-b787-0e678a94b25b.png)
    - Scroll inside the actual `Timestamp` to back and forward (player).

- `YT GIF icon > Miscellaneous > Clip lifespan format`
    - Because the main feature of the YT GIF extension is to use timestamps as boundaries, you might be interested to see the duration of a small section, or the position relative to the entire video.


### What does "Iframe/Player Buffer" do?
- The nature of Roam Research makes it so you can open multiple pages with multiple blocks within them; YT GIFs, ultimately iframes, are way too expensive to have them loaded in the background all the time. The solution is to use a buffer; those oldest ones will be unloaded and ready to be played once you interact with them.
    - ##### yt-gif icon > Experience > (top left corner, tutorial drop down menu) > 🎥 [Iframe Buffer video tutorial](https://youtu.be/_96XDmFPzbU)


### Why is the playbox is so small? Can the playbox of GIf be resized?
- Append `&sp=100` [url parameter](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#what-are-url-parameters-how-do-i-use-them) to the youtube video url within a YTGIF you should be able to override the playbox/player span.
If this doesn't work, most likely you're using a custom css rules that conflicts with the YT GIF extension; downwards the `rm-block__input` element.



---
---




# Simulate url button to video component

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
- ##### yt-gif icon > Miscellaneous > (top left corner, tutorial drop down menu) > 🎥 [URL Formatter video tutorial](https://youtu.be/1ABtb346pc0) 
- With the simulation running `YT GIF Icon > Miscellaneous > Simulate url button to video component`
- Create blocks and paste urls such as this one `https://www.youtube.com/watch?v=loK7BWFdwlc`
- Hover over the play ▶️ button next to the url
- It's YT GIF version will pop up to the right
- Click on it to format it like this: `{{[[yt-gif]]: https://www.youtube.com/watch?v=loK7BWFdwlc }}`
    - ![Snag_3587bd78](https://user-images.githubusercontent.com/65237382/148058480-a1f3f175-590c-45fd-baf2-5cc97d14fe56.png)

### Url Button Troubleshooting
- Particularly for "Safary" users
    - It seems that `localStorage` [is stopping users form using the feature](https://www.reddit.com/r/learnprogramming/comments/8x5keq/javascript_localstorage_not_working_on_safari/).
    - You can search `override_simulate_url_to_video_component` within your graph and [enable it](https://github.com/kauderk/kauderk.github.io/blob/main/yt-gif-extension/install/faq/README.md#i-change-the-values-but-nothing-happens) to overcome this issue.
        - Why Doing all of this?
            - As explained above on the Caution Prompt, I'm very serious about functions that write on people's graphs; this is a script (and automated workflow) and it is susceptible to changes from the source - `Roam Research`.




---
---



# Embracing `{{[[embed]]}}` and `((xxxuidxxx))` block references
YT GIFs, YT GIFs Timestamps & YT GIF Url Buttons will be rendered along with Roam Research's nesting block system. I encourage people to not hold back form exploding this `feature`; after all, it is what Roam Research users find more exciting about the software.

### Limitations
- **Sometimes** they will not work with **expanded** `{{=:|}}` tooltip cards. Why? [Because I can't find a way to retrieve their `uid` of origin.](https://roamresearch.slack.com/archives/CTAE9JC2K/p1638578496037700)



---
---



### What is "roam/js/kauderk/yt-gif/settings" really doing in my graph?
- The main and only purpose of this file is to store settings for the extension. Because Roam Research can be accesed from any device with a browser, it's wiser to store users data within their own graphs. Now, so far it stores numeric values, on and off switches, and strings.
It is a [javascript file](https://github.com/kauderk/kauderk.github.io/blob/main/yt-gif-extension/v0.2.0/js/settings-page.js) that uses the `Roam Alpha API` to read and write the settings in the form of blocks, with the following structure: 
    -  `(xxxuidxxx)` : `yt_gif_settings_key` : `<value>`
    
### I change the `<values>` but nothing happens
- Any manual change done to `"roam/js/kauderk/yt-gif/settings"` block's values will be reflected **once you reload your graph** (with the extension running).
    - If you don't see `_opt` blocks nested along with a particular setting, most likely it is a binary input.
        - `<1>` or `<true>` means `on`
        - `<>` or `<false>` means `off`
    - Now, if you see `<>` or `<1>`, it means they have never been updated within your graph - you never interacted with them - factory settings.



---
### What are the URL parameters? How do I use them?
- Well, it depends, the way url parameters work:
In this case, youtube video urls, `https://youtu.be/videoID?` notice the `?` question mark, the first parameter will be anything supported, like `t=` start and `end=` etc.
But after any of them you'd like to use - **every single one must be chained** with a `&` before the actual parameter, like `&t=` start or `&end` end.
Now, most YTGIFs users are used to `https://youtu.be/videoID?t=0&end=100` for example. Starting form there, YT GIF supports additional parameters like `&s=` speed, ` &vl=` volume and [more...](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install#:~:text=Customize%20each%20YT%20GIF%2C%20even%20multiple%20ones%20within%20the%20same%20block)

- URL parameters Table

| [URL parameters](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#what-are-url-parameters-how-do-i-use-them) |                          |                                           |
|----------------|--------------------------|-------------------------------------------|
| ?t=            | start timestamp boundary | get the most out the extension - optional |
| &end=          | end timestamp boundary   | get the most out the extension - optional |
| &s=            | playback speed up to 2   | optional                                  |
| &vl=           | volume form 0 to 100     | optional                                  |
| &sp=           | player span              | optional                                  |
| &hl=           | player interface language| optional                                  |
| &cc=           | player captions language | optional                                  |


---

---

---


> I can't find what I'm looking for.

- Submit your issue [![Issue URL](https://img.shields.io/badge/GitHub-issue-yellow)](https://github.com/kauderk/kauderk.github.io/issues)
- Contact me on [![Twitter URL](https://img.shields.io/twitter/url?label=KauDerK_&style=social&url=https%3A%2F%2Ftwitter.com%2FkauDerk_)](https://twitter.com/kauDerk_)
ﾠ
