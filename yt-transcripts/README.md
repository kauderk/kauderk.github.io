# YouTube Transcript Batch Downloader
So far, API-KEY is not required.

📄 https://kauderk.github.io/yt-transcripts/yt-transcript-batch-dowload.py
##### [github file](https://github.com/kauderk/kauderk.github.io/blob/main/yt-transcripts/yt-transcript-batch-dowload.py)

## How It works:
- Input a `playlist_id` and run the script. It will download all the **available transcripts** in the playlist to:
    - `./trasncripts-output/{channel_name}/{playlist_name}/{unique-file-name}.txt`
- You could also use the funcion `tryto_write_transcript(url)` by itself, you'll need to comment out the `for` loop. at the end.

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
- Referece for the `target_language` variable [ISO 639-1 two-letter language code](http://www.loc.gov/standards/iso639-2/php/code_list.php)

