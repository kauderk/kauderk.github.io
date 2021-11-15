# YT GIF an extension for Roam Research - **Legacy - v0.1.0**

*Released to the public: 15th October 2021 in [twitter](https://twitter.com/kauDerk_/status/1448886800798343206) and other social media forums.
The code is alright, though is kinda hard to read/follow in one pass.
I'm leaving the script and it's resources here, if anyone ever wants to review them.*

## What does it do?
Loops videos between the `start` and `end` YouTube URL parameters.
`{{[[yt-gif]]: https://youtu.be/46A01oukux0?t=20&end=100 }}` Simple as that, create as many "**YouTube Gifs**" and begin to visualize some ideas.


## [Installation](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/v0.1.0/install#installation)


## Features


| **Permutations**               | **ON**                                                        | **OFF**                                                 |
|:------------------------------:|:-------------------------------------------------------------:|:-------------------------------------------------------:|
| Start from previous timestamps | From the same edited block                                    | Always start from `t=`                                  |
| Clip lifespan format           | Display the duration from `t=` to `end=`                      | Display the clip timestamp relative to the entire video |
| Referenced start timestamp     | `Shift click`: the block will start from the referenced block | Always start from `t=`                                  |
| Observers                      | Stop or change the functionality of the YT GIF extension      | Depends on the request                                  |

---

| **Experience**                | **ON**                              | **OFF**           |
|:-----------------------------:|:-----------------------------------:|:-----------------:|
| Initialize on mouse enter     | Wait for user to hover on the frame | Don't autoplay    |
| Awaiting with video thumbnail | Thumbnail as the frame background   | A back background |
| Sound when video loops        | Play the sound from the given URL   | Don't play sound  |
| Volume of looping sound       | From 0 to 100                       |                   |

---

| **Full screen style**          | **ON**                          | **OFF**      |
|:------------------------------:|:-------------------------------:|:------------:|
| Smoll Vid When Big Ends        | The clip ends, exit full screen | Keep rolling |
| Mute when exiting full screen  | (While hovering the frame)      |              |
| Pause when exiting full screen | (While hovering the frame)      |              |

---

| **Sound Style**                                       | **ON**                                 |
|-------------------------------------------------------|----------------------------------------|
| Strict & recommended - mute everything except current | Hear one a the time                    |
| muted on mouse enter                                  | But the in and out keys can unmute it. |
| muted either way                                      | Strict. Either way.                    |

---

| **Play Style**                                     | **ON**                     |
|----------------------------------------------------|----------------------------|
| Strict & Recommended - play current on mouse enter | Play one at a time         |
| Play on mouse enter                                | Let others plays as well   |
| Visible clips begin to play unmuted                | Forever, like actual gifs. |

---

| **Timestamp Display**       | **Summary**                                                                              |
|-----------------------------|------------------------------------------------------------------------------------------|
| Time offset on scroll wheel | The amount the video will go back on forward when scrolling inside the timestamp display |

