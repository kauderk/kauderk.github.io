# YT GIF an extension for Roam Research

## What does it do?

Loops videos between the `start` and `end` YouTube URL parameters.
You create some `{{[[video]]: https://youtu.be/46A01oukux0?t=20&end=100 }}` blocks, note the `t=` and `end=`, though you can add playback speed also with `s=` up to `2`.
Simple as that, create as many "**YouTube Gifs**" and begin to visualize some ideas.

# You can [watch some video demos as well.](https://www.youtube.com/watch?v=kLGF_DMGVD0&list=PLsUa74AKSzOrSLn0hYz6taAuQ_XfhPQIg)

### This demo's base css should withstand your graphs' css rules. If it looks funny. [DM me on Twitter](https://twitter.com/kauDerk_), and we'll see what's going on.

## HOW TO SET IT UP

`Disclaimer` It's crucial that you have installed `roam42` https://roamjs.com/extensions/roam42
![Snag_4cf13e14](https://user-images.githubusercontent.com/65237382/135795342-c27f21b9-fbbe-4567-b6b0-b345a031f522.png)

## How & where

- ### JS
  - Under a block with the component `{{{[[roam/js]]}}}`, the javascript code will live inside a \`\`\`javascript \`\`\` code block.
- ### CSS
  - Under the `roam/css` page or a block with the component `{{{[[roam/css]]}}}`, in both cases, the CSS will live inside a \`\`\`css \`\`\` code block.
  - **DISCLAIMER - the extension works regardless, this is only for visuals.** Because of the `cross origin` web policy - we are not able to style the YT IFRAME. But I've developed the perfect CSS [STYLUS](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne?hl=en) rules to accommodate this annoyance. Just install the extension (chromium or mozilla) and import this [.json](https://github.com/kauderk/code-snippets/blob/7dd7cc565e4d4b1fbd83417719a41dcd7663a69f/yt-gif-extension-shareable-ver1/stylus-2021-10-03-yt-gif.json) file.

---

# Functionality

Hover over the YT GIF icon on the topbar.

![Snag_57088dd6](https://user-images.githubusercontent.com/65237382/136137184-54ee390e-45f7-4f46-b5f5-ccd530f2b0bc.png)

---

### Timestamp: Hover over the YT GIF, most specifically the middle bottom section, you'll see the desired elapsed time format.

##### Some are outdated, I'll update them tomorrow

- Previous Time Stamp
  - Seek to the last timestamp before editing a block (tweak the same block's content)
- Clip Span Format
  - Display the clip's live span or display it relative to the actual video duration. You either want to see the clip's live span from `t=` to `end=` or from the `t=` to the `actual video duration`. The YT GIF will rewind when it reaches it's `end=` no matter what.
- Referenced Time Stamp
  - Use the last timestamp from it's referenced parent. Say you are watching a YT GIF on the main bar and you want to open the BLOCK `shift + click`, should the clip start `t=` be referenced?
- Smoll Vid When Big Ends
  - Exit Fullscreen When Clip Ends. Might seem trivial, but watching your favorite YT GIFs is hypnotizing and time consuming. So once the clip ends, should it exit full screen automatically?
- Play On Hover
  - All videos are paused to focus on one at a time. Hop form one video to the next one, without worrying about multiple YT GIFs playing at the same time.
- Playing
  - Loaded videos autoplay and keep on playing. ALL VISISBLE YT GIFs are playing without sound. Hover over one at a time to unmute them.
- Scroll Wheel
  - Up to 60 seconds, hover over the `Timestamp` and scroll up and down to go back and forward into the video. You can't go past the end `end=` of behind the start `t=`.

---

# WHAT IT CAN LOOK LIKE

### `DISCALIMER` these styles && DARK CSS rules are not part of the demo

![Snag_4d185b14](https://user-images.githubusercontent.com/65237382/135798255-c4a7f083-bd55-4043-9609-e08cdf8b8a43.png)
![Snag_4d17ff58](https://user-images.githubusercontent.com/65237382/135798221-d9831d2e-7592-498a-a39a-6aeece868ec9.png)
![Snag_4d1838c7](https://user-images.githubusercontent.com/65237382/135798239-d1ee9251-bc36-4c29-8cf8-a2f261e77dd1.png)
![Snag_4d180b2f](https://user-images.githubusercontent.com/65237382/135798225-091e8f9c-0b08-42d5-999e-da2309e002d9.png)
![Snag_4f85bcb0](https://user-images.githubusercontent.com/65237382/135890504-bc8c6724-70dd-4ee5-9154-b342988b9e64.png)
