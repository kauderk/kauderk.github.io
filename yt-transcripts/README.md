# YouTube Transcript Batch Downloader
So far, API-KEY is not required.

📄 https://kauderk.github.io/yt-transcripts/yt-transcript.py
##### [github file](https://github.com/kauderk/kauderk.github.io/blob/main/yt-transcripts/yt-transcript.py)

## How It works:
- Tested on an virtual enviroment (vs-code)
    - [Create a virtual enviroment](https://youtu.be/6W6iY7uUu34): `python -m venv venv`
    - [Install the dependencies](https://note.nkmk.me/en/python-pip-install-requirements/): `pip install -r requirements.txt`
    - On the terminal directory, run it: `python yt-transcript.py [-playlist|-id|-url]`


## Usage:
- `yt-transcript.py [-hl 'language code'] [-f 'file name'] [-prfx 'file name prefix'] [-path_prfx 'path prefix'] [-ft 'file type'] [-playlist 'playlist id'] [-id 'video id'] [-url 'youtube url']` [how to read this...](https://docs.python.org/3/using/cmdline.html) [syntax comprehension](https://github.com/Battleman/zoomdl#:~:text=the%20cookies%20once-,About%20syntax,-I%20see%20a)
- Mandatory, at least one of the following:
    - `-playlist` [help...](https://www.sociablekit.com/find-youtube-playlist-id/)
    - `-id` [help...](https://help.tcgplayer.com/hc/en-us/articles/115008106868-Finding-Your-YouTube-Video-ID)
    - `-url` [help...](https://www.computerhope.com/issues/ch002162.htm)
    - ###### add more separated by ","

- Optional:
  - `-hl` language code [help...](http://www.loc.gov/standards/iso639-2/php/code_list.php) | default: en
  - `-f` filename | default: [videoid]\_transcript_[title]
  - `-prfx` append to filename
  - `-path_prfx` | default: ./trasncripts-output/channel_name/...
  - `-ft` | default: "txt" file format

- Default output path: `./trasncripts-output/{channel_name}/{playlist_name}/{unique-file-name}.txt`


-  ``` 
    python yt-transcript.py -playlist 'my_playlist'
    python yt-transcript.py -id 'my_video_id'
    python yt-transcript.py -url 'https://www.youtube.com/watch?v=my_video' -f "my_file_name"
    python yt-transcript.py -playlist 'my_playlist' -id 'my_video_id' -url 'https://youtu.be/my_video_id' -hl 'en' -f 'my_file_name' -prfx 'my_prefix' -path_prfx './my_directory' -ft 'txt'
    ```


## How I use it:
- Change the variable `output_file_type` to `md` (markdown)
- Run the script
- Go to https://roamresearch.com/#/app/
- On top right corner, click on *Import Files* **· · ·** > Browse
    - Go to the `/{playlist_name}` folder
    - Select all the `.md` transcripts
    - Import
- Create keyword pages and LINK ALL UNLINKED REFERENCES

## What problems does it solve?
Saving time. You might have a phrase stuck in your head, but you don't remember from which video you heard it, so... Instead of watching hours upon hours, just download the transcripts and search for the phrase.

## Extra Resources
- [Get any YouTube Channel in playlist form!](https://webapps.stackexchange.com/questions/106815/how-to-find-videos-i-havent-watched-on-a-youtube-channel#:~:text=Go%20into%20any%20video%20of%20the%20channel%20you%20want)
    - You could add multiple videos, from multiple YouTube Channels to your own playlist
- [vscode save terminal output](https://codetryout.com/vscode-save-terminal-output/)
    - By saving it, you have the success/failure ratio, the percentage bar (build in) plus the exact `video-id` shows that a video is missing it's transcript. In my experience 10% of videos don't have a transcript.
- [bulk rename file extension](https://windowsloop.com/bulk-rename-file-extension/)
    - `for /R %x in (*.txt) do ren "%x" *.md` rename all .txt files to .md or vice versa 
- Referece for `target_language` variable [ISO 639-1 two-letter language code](http://www.loc.gov/standards/iso639-2/php/code_list.php)
- `pafy` import dependency workaround [Cupcakus/pafy](https://github.com/mps-youtube/pafy/pull/305#:~:text=You%20could%20just%20install%20pafy%20from%20this%20pull%20request%20(until%20the%20request%20is%20accepted))
    -  ``` 
        pip uninstall -y pafy
        pip install git+https://github.com/Cupcakus/pafy
        ``` 
- Inpired by https://github.com/Battleman/zoomdl

