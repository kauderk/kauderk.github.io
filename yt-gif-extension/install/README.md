# This is how it should look like
![Snag_726f9e19](https://user-images.githubusercontent.com/65237382/136782227-2fa80c84-bf90-47c2-aa85-e07852c589e7.png)


1. #### Watch [all the features in action and explained](https://www.youtube.com/watch?v=RW_vkyf0Uek&list=PLsUa74AKSzOrSLn0hYz6taAuQ_XfhPQIg&index=1)
      - Or [skim through them in table form.](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension#features) 
3. #### [YOU CAN CUSTUMIZE THE STYLES INSIDE YOUR GRAPH](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/css/themes#dark--light-modes)
      - ![Snag_728825a4](https://user-images.githubusercontent.com/65237382/136785359-91e3fa14-d1fe-40df-98a7-79d4539109f1.png)![Snag_72882d55](https://user-images.githubusercontent.com/65237382/136785363-98206bb8-8ef7-4270-a60d-28ccc09c7875.png)   
4. #### [HERE ARE SOME DEMOS AND USE CASES](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/DEMOS#my-use-cases)

---

## [Features](https://github.com/kauderk/kauderk.github.io/blob/main/yt-gif-extension/README.md#features)


# Installation
![Installing YT GIF](https://user-images.githubusercontent.com/65237382/137433155-79f1a29a-4b1b-4f2b-8a56-8627e71ac44d.gif)

---


```javascript
YT GIF EXTENSION {{[[roam/js]]}}
```

  - ```javascript
      /*
      core funcionality: while exiting the frame, hold down the 
      middle mouse button ("InAndOutKeys") to unmute videos
      ?t=                   - start timestamp boundary - get the most out the extension - optional
      &end=                 - end timestamp boundary   - get the most out the extension - optional
      &s=                   - playback speed up to 2   - optional 
      &vl=                  - volume form 0 to 100     - optional
      Example ⬇️
      {{[[yt-gif]]: https://youtu.be/sFFwvr6l2mM?t=60&end=120 }}
      */
      window.YTGIF = {
          /* permutations - checkbox */
          display: {
              clip_life_span_format: '1',
          },
          previous: {
              start_timestamp: '1',
              start_volume: '1',
          },
          referenced: {
              block_timestamp: '1',
              block_volume: '1',
          },
          experience: {
              sound_when_video_loops: '1',
              awaiting_for_mouseenter_to_initialize: '',
              awaiting_with_video_thumnail_as_bg: '1',
          },
          inactiveStyle: {
              mute_on_inactive_window: '',
              pause_on_inactive_window: '',
          },
          fullscreenStyle: {
              smoll_vid_when_big_ends: '1',
              mute_on_exit_fullscreenchange: '',
              pause_on_exit_fullscreenchange: '',
          },
          /* one at a time - radio */
          muteStyle: {
              strict_mute_everything_except_current: '1',
              muted_on_mouse_over: '',
              muted_on_any_mouse_interaction: '',
          },
          playStyle: {
              strict_play_current_on_mouse_over: '1',
              play_on_mouse_over: '',
              visible_clips_start_to_play_unmuted: '',
          },
          range: {
              /*seconds up to 60*/
              timestamp_display_scroll_offset: '5',
              /* integers from 0 to 100 */
              end_loop_sound_volume: '50',
          },
          InAndOutKeys: {
              /* middle mouse button is on by default */
              ctrlKey: '1',
              shiftKey: '',
              altKey: '',
          },
          default: {
              video_volume: 40,
              /* 'dark' or 'light' */
              css_theme: 'light',
              /* empty means 50% - only valid css units like px  %  vw */
              player_span: '50%',
              /* distinguish between {{[[video]]:}} from {{[[yt-gif]]:}} or 'both' which is also valid*/
              override_roam_video_component: '',
              /* src sound when yt gif makes a loop, empty if unwanted */
              end_loop_sound_src: 'https://freesound.org/data/previews/256/256113_3263906-lq.mp3',
          },
      }

      var existing = document.getElementById('yt-gif-main');
      if (!existing) 
      {
        var extension = document.createElement("script");
        extension.src = "https://kauderk.github.io/yt-gif-extension/yt-gif-main.js";
        extension.id = "yt-gif-main";
        extension.async = true;
        extension.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(extension);
      }
     ```
     
# Update
If you were redirected here, please update your YT GIF EXTENSION with code above. This is a temporary thing.

# Bug Report

Something broke, doesn't work, opposite behaviour, strange behavior, or the extension straight up won't run.

- Submit your issue https://github.com/kauderk/kauderk.github.io/issues
- Contact me on [![Twitter URL](https://img.shields.io/twitter/url?label=KauDerK_&style=social&url=https%3A%2F%2Ftwitter.com%2FkauDerk_)](https://twitter.com/kauDerk_)
ﾠ
