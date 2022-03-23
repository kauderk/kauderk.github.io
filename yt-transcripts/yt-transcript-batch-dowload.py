# Python 3.10.3 64-bit
import os
import re
import unicodedata
from tqdm import tqdm
from youtube_transcript_api import YouTubeTranscriptApi
from pytube import Playlist
from pytube import YouTube
import pafy


# download all transcripts from a youtube playlist
# see last line to change the output directory
target_language = 'en'  # en
output_file_type = 'txt'  # txt
# single video? use tryto_write_transcript(url) only, instead of looping over a playlist
playlist_id = 'PLNpR94A_g5PAlLpAR4GrPr-4YKCSPfKeD'


def get_available_transcript(video_id):
    try:
        obj_transcript = YouTubeTranscriptApi.get_transcript(
            video_id, languages=[target_language])
    except:
        return None

    text = ''
    for obj in obj_transcript:
        outTxt = (obj['text'])
        text += outTxt + '\n'

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


def tryto_write_transcript(url, path_prefix='./'):
    """
    Download the transcript from a youtube video.
    Write it to a file with some metadata on the header.
    Do nothing if the transcript-file exist.
    """
    id, response, transcript, video = None, None, None, None

    # 1. trying to get data from youtube
    try:
        # video info
        id = url[-11:]
        response = pafy.new(url)  # avialble: title, duration
        video = YouTube(url)  # nice! it has the description
        transcript = get_available_transcript(id)

        if not (transcript):
            raise Exception('No transcript')
    except:
        return print(f'\nERROR: Video transcript {id} not found')

    # 2. output
    txt = f'title: {video.title}\nduration: {response.duration}\ndescription: {video.description}\n\n{transcript}\n'
    sufix = f'{slugify(video.title)}'
    filename = f'{path_prefix}{id}_transcript_{sufix}.{output_file_type}'

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
        f.fileinfo = {'Title': video.title}
        f.write(txt)


# transcrpts form playlist - output to folder
yt = Playlist(f'https://www.youtube.com/playlist?list={playlist_id}')
count = 0
channel_name = slugify(yt.owner)
playlist_name = slugify(yt.title)
for url in tqdm(yt):
    count += 1
    # remove the path_prefix argument, I want the output on this directory
    path_prefix = f'./trasncripts-output/{channel_name}/{playlist_name}/{count}_'
    tryto_write_transcript(url, path_prefix)
