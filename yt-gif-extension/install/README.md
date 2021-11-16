# YT GIF Extension v0.2.0

## [Features](https://github.com/kauderk/kauderk.github.io/blob/main/yt-gif-extension/README.md#features)

# Installation
#### Keep in mind
  - The brand new installation might take some time.
  - Uninstall/disable previous versions, else untested code will be overwritten.
  - ![YT GIF Extension v0 2 0 cleaner c2](https://user-images.githubusercontent.com/65237382/141890136-27b41d51-ff22-430d-aa21-94b3162fe406.gif)
  - If you are reading this, it is because I haven't announced v0.2.0 yet. But go ahead, install it, and tell how you plan on using it.
    - [v0.1.0](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/v0.1.0) - [announced](https://twitter.com/kauDerk_/status/1448886800798343206?s=20) on [Twitter](https://twitter.com/fbgallet/status/1449490195968110592?s=20) and many other social media platforms, is a somewhat stable version, but v0.2.0 comes with more quality of life features and has potential for scalability and maintainability.

---

```javascript
YT GIF EXTENSION v0.2.0 {{[[roam/js]]}}
```

  - ```javascript
      /*
        roam/js/kauderk/yt-gif/settings -> store session values | YT GIF Extension updates

        core funcionality: while exiting the frame, hold down the 
        middle mouse button ("InAndOutKeys") to unmute videos

        ?t=                   - start timestamp boundary - get the most out the extension - optional
        &end=                 - end timestamp boundary   - get the most out the extension - optional
        &s=                   - playback speed up to 2   - optional 
        &vl=                  - volume form 0 to 100     - optional

        Example ⬇️
        {{[[yt-gif]]: https://youtu.be/sFFwvr6l2mM?t=60&end=120 }}
      */

      var existing = document.getElementById('yt-gif-main');
      if (!existing) 
      {
        var extension = document.createElement("script");
        extension.src = "https://kauderk.github.io/yt-gif-extension/v0.2.0/js/yt-gif-main.js";
        extension.id = "yt-gif-main";
        extension.async = true;
        extension.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(extension);
      }
     ```

# This is how it should look like
![Snag_e41c464](https://user-images.githubusercontent.com/65237382/141892053-ef42814f-8fbb-4717-92f9-0348b8b0750b.png)

## Extra
1. #### Watch [all the features in action and explained](https://www.youtube.com/watch?v=RW_vkyf0Uek&list=PLsUa74AKSzOrSLn0hYz6taAuQ_XfhPQIg&index=1)
      - Or [skim through them in table form.](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension#features) 
3. #### [YOU CAN CUSTOMIZE THE STYLES INSIDE YOUR GRAPH](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/css/themes#dark--light-modes)
      - ![Snag_ccb5385](https://user-images.githubusercontent.com/65237382/141852554-6689103e-1489-4cc2-a03b-b460b5f4427d.png)
![Snag_ccb5d2a](https://user-images.githubusercontent.com/65237382/141852562-2efd0f96-921a-44e3-99a9-c9a201789753.png) 
4. #### [HERE ARE SOME DEMOS AND USE CASES](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/DEMOS#my-use-cases)

# Update
Whitin your `roam/js/kauderk/yt-gif/settings` page :D

# Bug Report
Something broke, doesn't work, strange/opposite behaviour or the extension does not run no matter what.

- Submit your issue [![Issue URL](https://img.shields.io/badge/GitHub-issue-yellow)](https://github.com/kauderk/kauderk.github.io/issues)
- Contact me on [![Twitter URL](https://img.shields.io/twitter/url?label=KauDerK_&style=social&url=https%3A%2F%2Ftwitter.com%2FkauDerk_)](https://twitter.com/kauDerk_)
ﾠ
