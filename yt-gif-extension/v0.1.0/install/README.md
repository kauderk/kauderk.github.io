# Legacy - v0.1.0

1. #### Watch [all the features in action and explained](https://www.youtube.com/watch?v=RW_vkyf0Uek&list=PLsUa74AKSzOrSLn0hYz6taAuQ_XfhPQIg&index=1) or [skim through them in table form.](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension#features) 
3. #### [You can customize the styles inside your graph](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/css/themes#dark--light-modes)  
4. #### [Here are some demos and use cases](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/DEMOS#my-use-cases)

---

## [Features](https://github.com/kauderk/kauderk.github.io/blob/main/yt-gif-extension/v0.1.0/README.md#features)


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
              /* one a time */
              strict_start_timestamp: '1',
              start_timestamp: '',
              fixed_start_timestamp: '',
              /* one a time */
              strict_start_volume: '1',
              start_volume: '',
              fixed_start_volume: '',
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
        extension.src = "https://kauderk.github.io/yt-gif-extension/v0.1.0/js/yt-gif-main.js";
        extension.id = "yt-gif-main";
        extension.async = true;
        extension.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(extension);
      }
     ```
     
# Update
The latest version is [v0.2.0](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install)

# Bug Report
Something broke, doesn't work, strange/opposite behaviour or the extension does not run no matter what.

- Submit your issue [![Issue URL](https://img.shields.io/badge/GitHub-issue-yellow)](https://github.com/kauderk/kauderk.github.io/issues)
- Try to contact me on [![Twitter URL](https://img.shields.io/twitter/url?label=KauDerK_&style=social&url=https%3A%2F%2Ftwitter.com%2FkauDerk_)](https://twitter.com/kauDerk_)
    - I might not reply or be able to solve your problems... since this is an usuported version.
ﾠ
