# This is how it should look like
![Snag_726f9e19](https://user-images.githubusercontent.com/65237382/136782227-2fa80c84-bf90-47c2-aa85-e07852c589e7.png)

### Both extensions running back-to-back
Make sure you have installed [roam42](https://roamjs.com/extensions/roam42).
You might need to reload your graph ![Snag_728a31a0](https://user-images.githubusercontent.com/65237382/136785623-6f3035bf-7d2a-41f5-bd21-25a0219fbea3.png)

## Before you install
1. #### Watch [all the features in action and explained](https://www.youtube.com/watch?v=RW_vkyf0Uek&list=PLsUa74AKSzOrSLn0hYz6taAuQ_XfhPQIg&index=1)
2. #### [YOU CAN CUSTUMIZE THE STYLES INSIDE YOUR GRAPH](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/themes)
      - ![Snag_728825a4](https://user-images.githubusercontent.com/65237382/136785359-91e3fa14-d1fe-40df-98a7-79d4539109f1.png)![Snag_72882d55](https://user-images.githubusercontent.com/65237382/136785363-98206bb8-8ef7-4270-a60d-28ccc09c7875.png)   
4. #### [HERE ARE SOME DEMOS AND USE CASES](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/DEMOS)

---

- ` YT GIF EXTENSION {{[[roam/js]]}} ` 
  - ```javascript
    /*
    core funcionality, while exiting the frame: 
    to unmute videos; hold down the middle mouse button
    or the "InAndOutKeys"
    ?t= start | &end= end - timestamps - optional
    &s=                   - playback speed up to 2 - optional 
    &vl=                  - volume form 0 to 100 - optional
    Example ⬇️
    {{[[yt-gif]]: https://youtu.be/sFFwvr6l2mM?t=60&end=120 }}
    */
     ```


  - ```javascript
    window.YTGIF = {
        /* permutations - checkbox */
        permutations: {
            start_form_previous_timestamp: '1',
            clip_life_span_format: '1',
            referenced_start_timestamp: '1',
        },
        experience: {
            sound_when_video_loops: '1'
        },
        /* permutations - checkbox */
        inactiveStyle: {
            mute_on_inactive_window: '1',
            pause_on_inactive_window: '',
        },
        /* permutations - checkbox */
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
        /* one at a time - radio */
        playStyle: {
            strict_current_play_on_mouse_over: '1',
            play_on_mouse_over: '',
            visible_clips_start_to_play_unmuted: '',
        },
        range: {
            /*seconds up to 60*/
            wheelOffset: '5',
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
            yt_gif_drop_down_menu_theme: 'dark',
            /* empty means 50% - only valid css units like px  %  vw */
            player_span: '50%',
            /* distinguish between {{[[video]]:}} from {{[[yt-gif]]:}} or 'both' which is also valid*/
            override_roam_video_component: '',
            /* src sound when yt gif makes a loop, empty if unwanted */
            clip_end_sound: 'https://freesound.org/data/previews/256/256113_3263906-lq.mp3',
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
