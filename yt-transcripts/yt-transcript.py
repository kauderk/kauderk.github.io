# Python 3.10.3 64-bit
import os
import re
import argparse
import unicodedata
from copy import deepcopy
from datetime import timedelta
from tqdm import tqdm
from youtube_transcript_api import YouTubeTranscriptApi
from pytube import Playlist, YouTube, extract


# download all transcripts from a youtube playlist
# see last line to change the output directory
# single video? use tryto_write_transcript(url) only, instead of looping over a playlist


def get_available_transcript(video_id, target_language):
    try:
        obj_transcript = YouTubeTranscriptApi.get_transcript(
            video_id, languages=[target_language])
    except:
        return None

    text = ''
    for obj in obj_transcript:
        outTxt = (obj['text'])
        start = str(timedelta(seconds=int(obj['start'])))
        text += f'{outTxt}  {start}\n'

    return text


def slugify(value, allow_unicode=False):
    """
    Taken from https://github.com/django/django/blob/master/django/utils/text.py
    Convert to ASCII if 'allow_unicode' is False. Convert spaces or repeated
    dashes to single dashes. Remove characters that aren't alphanumerics,
    underscores, or hyphens. Convert to lowercase. Also strip leading and
    trailing whitespace, dashes, and underscores.
    """
    value = str(value)
    if allow_unicode:
        value = unicodedata.normalize('NFKC', value)
    else:
        value = unicodedata.normalize('NFKD', value).encode(
            'ascii', 'ignore').decode('ascii')
    value = re.sub(r'[^\w\s-]', '', value)  # changed
    return re.sub(r'[-\s]+', ' ', value)  # changed


def tryto_write_transcript(url, args, path_prfx=None):
    """
    Download the transcript from a youtube video.
    Write it to a file with some metadata on the header.
    Do nothing if the transcript-file exist.
    """
    id, transcript, video = None, None, None

    # 1. trying to get data from youtube
    try:
        # video info
        id = extract.video_id(url)
        video = YouTube(url)  # nice! it has the description
        transcript = get_available_transcript(id, args.hl)

        if not (transcript):
            raise Exception(f'\nERROR: Transcript? {id}')
    except:
        return print(f'\nERROR: Video transcript {id} not found')

    # 2. output
    txt = f'title: {video.title}\nduration: {str(timedelta(seconds=video.length))}\ndescription: {video.description}\n\n{transcript}\n'
    sufix = f'{slugify(video.title)}'

    fname = args.f
    if args.f == 'default':
        fname = f'{id}_transcript_{sufix}'

    if path_prfx is None:
        path_prfx = f'./trasncripts-output/{slugify(video.author)}/'
        path_prfx = args.path_prfx if args.path_prfx != './' else path_prfx

    filename = path_prfx + args.prfx + fname + f'.{args.ft}'

    # 3. validate directory
    os.makedirs(os.path.dirname(filename), exist_ok=True)

    if(os.path.exists(filename)):
        if(open(filename, 'r', encoding='utf8').read() == txt):
            return print(f'\nFile: {filename} already exists with the same content')
        else:
            # clean file
            open(filename, 'w', encoding='utf8').close()

    # 4. write file
    with open(filename, 'a', encoding='utf8') as f:
        f.write(txt)


# transcrpts form playlist - output to folder
def loop_playlist(playlist_id, args):
    yt = Playlist(f'https://www.youtube.com/playlist?list={playlist_id}')
    count = 0
    channel_name = slugify(yt.owner)
    playlist_name = slugify(yt.title)
    for url in tqdm(yt):
        count += 1
        # remove the path_prfx argument, I want the output on this directory
        path_prfx = f'./trasncripts-output/{channel_name}/{playlist_name}/{count}_'
        path_prfx = args.path_prfx if args.path_prfx != './' else path_prfx
        tryto_write_transcript(url, args, path_prfx)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--hl', default='en', help='language code')  # language
    parser.add_argument('--f', default='default',
                        help='filename default [videoid]_transcript_[title]')  # file name
    parser.add_argument('--prfx', default='',
                        help='append to filename')  # file prefix
    parser.add_argument('--path_prfx', default='./',
                        help='default ./this-directory/channel_name/...')  # file prefix
    parser.add_argument('--ft', default='txt',
                        help='default "txt" file format')  # file type
    parser.add_argument(
        '--playlist', help='playlist id | download every video | add more separated by ","')  # playlist id
    parser.add_argument(
        '--id', help='video id | standalone download | add more separated by ","')  # video id
    parser.add_argument(
        '--url', help='video url | standalone download | add more separated by ","')  # video url
    args = parser.parse_args()

    if not any((args.playlist, args.id, args.url)):
        print('\nUse either --playlist --id --url | add more separated by ","\n')
        print(parser.print_help())
        exit()

    if(args.playlist):
        for ply in args.playlist.split(","):
            loop_playlist(ply.strip(), deepcopy(args))

    if(args.id):
        for id in args.id.split(","):
            tryto_write_transcript(
                'https://youtu.be/' + id.strip(), deepcopy(args))

    if(args.url):
        for url in args.url.split(","):
            tryto_write_transcript(url.strip(), deepcopy(args))
