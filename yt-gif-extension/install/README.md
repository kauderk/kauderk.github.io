# YT GIF Extension v0.2.0


## Features: [videos](https://www.youtube.com/watch?v=O6zULK3w5Go&list=PLsUa74AKSzOpEQvDmzDHFNUHu5tgXap_I&index=8) - [table](https://github.com/kauderk/kauderk.github.io/blob/main/yt-gif-extension/README.md#features)

# Installation
#### Keep in mind
  - The brand new installation might take some time.
  - Uninstall/disable previous versions, else untested code will be overwritten.

https://user-images.githubusercontent.com/65237382/153699100-3cb2cd87-31a8-440a-ae48-fada9eca0934.mp4 
##### [.gif file in case the video is down](https://user-images.githubusercontent.com/65237382/141890136-27b41d51-ff22-430d-aa21-94b3162fe406.gif)

---
# [This is how it should look like](https://user-images.githubusercontent.com/65237382/152562479-07b0ce90-c6fc-4cd5-8bd1-b665fcbc590c.png)

```javascript
YT GIF EXTENSION v0.2.0 {{[[roam/js]]}}
```

  - ```javascript
      /*
        How do I use it? -> https://github.com/kauderk/kauderk.github.io/blob/main/yt-gif-extension/install/faq/README.md#how-do-i-use-it
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


# Significant changes
1. Embracing `{{[[embed]]}}` and `((xxxuidxxx))` block references - [more...](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#embracing-embed-and-xxxuidxxx-block-references)
  - ![embeds](https://user-images.githubusercontent.com/65237382/152559217-91304aaa-baba-4a7e-bed6-7350252a4403.png)
3. Major features have their own video tutorials
  - ![tuts](https://user-images.githubusercontent.com/65237382/152561112-03641536-aee3-4c5a-ba19-53ae92db0579.png)
2. `Timestamp Emulation` - [more...](https://github.com/kauderk/kauderk.github.io/blob/main/yt-gif-extension/install/components/README.md#workflow) - [click events...](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#click-events)
  - ![tms](https://user-images.githubusercontent.com/65237382/152561122-403574d1-bdd2-47a5-a51e-db17a8ffd458.png)
3. Click on YouTube URLs and format them to `{{[[yt-gif]]}}` components - [more...](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#simulate-url-button-to-video-component)
  - ![url](https://user-images.githubusercontent.com/65237382/152561116-596482d7-78d8-40d8-8e36-aaab60b2de0a.png)
4. You decide how to initialize your YT GIFs
  - ![buffer](https://user-images.githubusercontent.com/65237382/152561120-1c3ed960-280f-4173-b52f-c21559f60406.png)
5. Customize each YT GIF, even multiple ones within the same block
  - ![sttgp](https://user-images.githubusercontent.com/65237382/152561125-c24bf9ab-fed8-4f11-8772-3b742cf60da7.png)


## Extra
1. #### 🎥 Watch [all the features in action](https://www.youtube.com/watch?v=O6zULK3w5Go&list=PLsUa74AKSzOpEQvDmzDHFNUHu5tgXap_I&index=1)
      - [![YT GIF - Showcase video](https://user-images.githubusercontent.com/65237382/152557440-bc172f73-91f7-4b8b-82c5-65ecd967c8b7.jpg)](https://www.youtube.com/watch?v=O6zULK3w5Go&list=PLsUa74AKSzOpEQvDmzDHFNUHu5tgXap_I&index=8) 
      - Or [skim through them in table form.](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension#features)
1. ### 🎥 Watch [a practical use of {{yt-gifs}}](https://www.youtube.com/watch?v=bKMop3MUIRU&list=PLsUa74AKSzOpEQvDmzDHFNUHu5tgXap_I&index=2) | Brainstorm ideas with YT GIFs | Roam Research
      - [![ytg tut roam research brainstrom ideas on game design](https://user-images.githubusercontent.com/65237382/153094875-6574c0a3-de81-4369-8c33-6bc63d7ed7c2.jpg)](https://www.youtube.com/watch?v=bKMop3MUIRU&list=PLsUa74AKSzOpEQvDmzDHFNUHu5tgXap_I&index=2)
1. #### They will inherit your graph's style, you can also [modify them](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/resources/css/themes)
      - ![Snag_ccb5385](https://user-images.githubusercontent.com/65237382/141852554-6689103e-1489-4cc2-a03b-b460b5f4427d.png)
![Snag_ccb5d2a](https://user-images.githubusercontent.com/65237382/141852562-2efd0f96-921a-44e3-99a9-c9a201789753.png) 
1. #### [HERE ARE SOME DEMOS AND USE CASES](https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/DEMOS#my-use-cases)

# Update
Whitin your `roam/js/kauderk/yt-gif/settings` page :D

# Bug Report
Something broke, doesn't work, strange/opposite behaviour or the extension does not run no matter what.

- Submit your issue [![Issue URL](https://img.shields.io/badge/GitHub-issue-yellow)](https://github.com/kauderk/kauderk.github.io/issues)
- Contact me on [![Twitter URL](https://img.shields.io/twitter/url?label=KauDerK_&style=social&url=https%3A%2F%2Ftwitter.com%2FkauDerk_)](https://twitter.com/kauDerk_)


