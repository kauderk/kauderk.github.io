# YouTube Transcript Batch Downloader
So far, API-KEY is not required.

## How It works:
- Input a `playlist_id` and run the script. It will download all the videos in the playlist to:
    - `./trasncripts-output/{channel_name}/{playlist_name}/{unique-file-name}.txt`
- You could also use the funcion `tryto_write_transcript(url)` by itself, you'll need to comment out the `for` loop. at the end.

## How I use it:
- Change the variable `output_file_type` to `md` (markdown)
    - Run the script 
- Go to https://logseq.com/#/
    - Open the `/{playlist_name}` folder
    - Export Graph > Export as Roam JSON
- Go to https://roamresearch.com/#/app/
    - Import the JSON file
    - Create keyword pages and LINK ALL UNLINKED REFERENCES

## What problems does it solve?
Saving time. You might have a phrase stuck in your head, you don't rememeber in which video you heard it, so... Instead of watching hours upon hours, just download the transcripts and search for the phrase.

## Extra Tools
    - https://windowsloop.com/bulk-rename-file-extension/
        - `for /R %x in (*.txt) do ren "%x" *.md` rename all .txt files to .md or vice versa 