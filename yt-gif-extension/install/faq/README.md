### Can't they be just like `[[video]]` components and it's features?


### What are "InAndOutKeys"?


### Timestamps
Yep, because naturally [[video]] and [[yt-gif]]  will use their own timestamps. I'm guessing that caused confusion.

#### The capture shortcuts don't work
#### The capture smartblocks don't work


### Can I use shortcuts?


### Why the playbox is so small? Can the playbox of GIf be resized?

Btw if you append &sp=100 to the video url you should be able to override the playbox/player span.


### What is the difference between [[video]] and [[yt-gif]]?
[[video]] is a video component. [[yt-gif]] is a gif component.


### What does "Iframe/Player Buffer" do?


### How do I change the volume?

### Can I set a custom playback speed?

### Does it support multiple languages?


### What is a "Timestamp Display"?


### What is "roam/js/kauderk/yt-gif/settings" really doing in my graph?


### How do I use it?
Well it depends, the way url parameters work:
In this case youtube video urls, https://youtu.be/videoID? notice the ? question mark, the first parameter will be anything supported, like t= start and end= etc.
But after any of them you'd like to use - every single one must be chained with a & before the actual parameter, like &t= start or&end end.
Now, most YTGIFs users are used to https://youtu.be/videoID?t=0&end=100 for example. Starting form there, YT GIF support additional parameters like &s= speed, &vl= volume and more...


---

> I can't find what I'm looking for.

- Submit your issue [![Issue URL](https://img.shields.io/badge/GitHub-issue-yellow)](https://github.com/kauderk/kauderk.github.io/issues)
- Contact me on [![Twitter URL](https://img.shields.io/twitter/url?label=KauDerK_&style=social&url=https%3A%2F%2Ftwitter.com%2FkauDerk_)](https://twitter.com/kauDerk_)
ﾠ