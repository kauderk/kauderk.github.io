//This code is updated?
//- Hello? 5

// version 26 - semi-refactored
// Load the IFrame Player API.
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/player_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
window.YTGIF = {
    /* permutations - checkbox */
    permutations: {
        start_form_previous_timestamp: '1',
        clip_life_span_format: '1',
        referenced_start_timestamp: '1',
        smoll_vid_when_big_ends: '1',
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
        player_span: '45%',
        /* distinguish between {{[[video]]:}} from {{[[yt-gif]]:}} or 'both' which is also valid*/
        override_roam_video_component: 'both',
        /* src sound when yt gif makes a loop, empty if unwanted */
        clip_end_sound: 'https://freesound.org/data/previews/256/256113_3263906-lq.mp3',
    },
}



/*-----------------------------------*/
/* USER SETTINGS  */
const UI = window.YTGIF;
/* user doen't need to see this */
UI.label = {
    rangeValue: ''
}
/*-----------------------------------*/
const iframeIDprfx = 'player_';
let creationCounter = -1;
let currentFullscreenPlayer = '';
let currentMasterObserver = undefined;
/*-----------------------------------*/
const allVideoParameters = new Map();
const lastBlockIDParameters = new Map();
const videoParams = {
    src: 'https://www.youtube.com/embed/---------?',
    id: '---------',
    start: 000,
    end: 000,
    speed: 1,
    updateTime: 0,
    volume: UI.default.video_volume
};
//
const recordedIDs = new Map();
const sesionIDs = {
    target: null,
    uid: '---------'
}
/*-----------------------------------*/
function URLFolder(f)
{
    return `https://kauderk.github.io/yt-gif-extension/${f}`
};
const links = {
    css: {
        dropDownMenu: URLFolder('drop-down-menu.css'),
        player: URLFolder('player.css'),
        themes: {
            dark_dropDownMenu: URLFolder('themes/dark-drop-down-menu.css'),
            light_dropDownMenu: URLFolder('themes/light-drop-down-menu.css'),
        }
    },
    html: {
        dropDownMenu: URLFolder('drop-down-menu.html'),
        playerControls: URLFolder('player-controls.html')
    },
    js: {
        main: URLFolder('yt-gif-main.js')
    }
}
const cssData = {
    yt_gif_wrapper: 'yt-gif-wrapper',
    yt_gif_timestamp: 'yt-gif-timestamp'
}
/*-----------------------------------*/
const ytGifAttr = {
    sound: {
        mute: 'yt-mute',
        unMute: 'yt-unmute'
    },
    play: {
        playing: 'yt-playing',
        paused: 'yt-paused'
    },
    extra: {
        readyToEnable: 'readyToEnable'
    }
}
/*-----------------------------------*/


// wait for APIs to exist
const almostReady = setInterval(() =>
{
    if ((typeof window.roam42?.common == 'undefined'))
    {
        //this is ugly - 
        console.count('activating YT GIF extension | common');
        return;
    }
    if ((typeof (YT) == 'undefined'))
    {
        console.count('activating YT libraries | common');
        console.count('this is ugly | YT');
        return;
    }

    clearInterval(almostReady);
    Ready(); // load dropdown menu and deploy iframes

}, 500);

async function Ready()
{
    // 1.
    await LoadCSS(links.css.dropDownMenu);
    await LoadCSS(links.css.player);

    // 2.
    await deal_with_user_custimizations();

    // 3. 
    await load_html_drop_down_menu();

    // 4. assign the User Inputs (UI) to their variables
    drop_down_menu_inputs_as_variables();

    // 5. One time - the timestamp scroll offset updates on changes
    timestamp_offset_features();

    // 6. is nice to have an option to stop the masterObserver for good
    currentMasterObserver = ObserveIframesAndDelployYTPlayers();


    //#region hidden functions
    async function deal_with_user_custimizations()
    {
        if (UI.default.yt_gif_drop_down_menu_theme === 'dark')
            await LoadCSS(links.css.themes.dark_dropDownMenu);

        else
            await LoadCSS(links.css.themes.light_dropDownMenu);

        if (isValidCSSUnit(UI.default.player_span))
        {
            create_css_rule(`.${cssData.yt_gif_wrapper}, .yt-gif-iframe-wrapper {
                width: ${UI.default.player_span} !important;
            }`);
        }
    }

    async function load_html_drop_down_menu()
    {
        const moreIcon = document.querySelector('.bp3-icon-more').closest('.rm-topbar .rm-topbar__spacer-sm + .bp3-popover-wrapper');
        const htmlText = await FetchText(links.html.dropDownMenu);
        moreIcon.insertAdjacentHTML('afterend', htmlText);
    }


    function drop_down_menu_inputs_as_variables()
    {
        // this took a solid hour. thak you thank you
        for (const parentKey in UI)
        {
            for (const childKey in UI[parentKey])
            {
                const userValue = UI[parentKey][childKey];
                const domEl = document.getElementById(childKey);
                //don't mess up any other variable
                if (domEl)
                    UI[parentKey][childKey] = domEl;

                switch (parentKey)
                {
                    case 'permutations':
                    case 'muteStyle':
                    case 'playStyle':
                        UI[parentKey][childKey].checked = isTrue(userValue);
                        break;
                    case 'range':
                        UI[parentKey][childKey].value = Number(userValue);
                        break;
                    case 'label':
                        UI[parentKey][childKey].innerHTML = userValue;
                        break;
                }
            }
        }
    }

    function timestamp_offset_features()
    {
        UI.range.wheelOffset.addEventListener('change', () => UpdateRangeValue());
        UI.range.wheelOffset.addEventListener('wheel', (e) =>
        {
            const dir = Math.sign(e.deltaY) * -1;
            const parsed = parseInt(UI.range.wheelOffset.value, 10);
            UI.range.wheelOffset.value = Number(dir + parsed);
            UpdateRangeValue();
        });
        UpdateRangeValue();

        //#region  local utils
        function UpdateRangeValue()
        {
            UI.label.rangeValue.innerHTML = UI.range.wheelOffset.value;
        }
        //#endregion
    }
    //#endregion

    //#region uitils
    async function LoadCSS(cssURL) // 'cssURL' is the stylesheet's URL, i.e. /css/styles.css
    {
        if (await !tryingToFetch(cssURL)) return;

        return new Promise(function (resolve, reject)
        {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssURL;
            document.head.appendChild(link);

            link.onload = () => resolve();
        });
    }

    //#endregion
}

function ObserveIframesAndDelployYTPlayers()
{
    const targetClass = 'rm-video-player__spacing-wrapper';

    // 1. set up all visible YT GIFs
    const visible = inViewport(document.querySelectorAll('.' + targetClass));
    for (const wrapper of visible)
    {
        onYouTubePlayerAPIReady(wrapper, 'first wave');
    }

    // 2. IntersectionObserver attached to deploy when visible
    const hidden = document.querySelectorAll('.' + targetClass);
    for (const wrapper of hidden)
    {
        ObserveIntersectToSetUpPlayer(wrapper, 'second wave'); // I'm quite impressed with this... I mean...
    }

    // 3. ready to observe and deploy iframes
    const targetNode = document.getElementById('app');
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(mutation_callback);
    observer.observe(targetNode, config);

    return observer

    //#region observer utils
    function ObserveIntersectToSetUpPlayer(iterator, message = 'YscrollObserver')
    {
        const yobs = new IntersectionObserver(Ycallback, { threshold: [0] });

        function Ycallback(entries)
        {
            if (!entries[0])
                yobs.disconnect();

            for (const entry of entries)
            {
                if (entry.isIntersecting)
                {
                    onYouTubePlayerAPIReady(iterator, message);
                    yobs.disconnect();
                    break;
                }
            }
        }

        yobs.observe(iterator);

        return yobs;
    }
    // ObserveIntersectToSetUpPlayer when cssClass is added to the DOM
    function mutation_callback(mutationsList, observer)
    {
        const found = [];
        for (const { addedNodes } of mutationsList)
        {
            for (const node of addedNodes)
            {
                if (!node.tagName) continue; // not an element

                if (node.classList.contains(targetClass))
                {
                    found.push(node);
                }
                else if (node.firstElementChild)
                {
                    // javascript is crazy and i don't get how or what this is doing... man...
                    found.push(...node.getElementsByClassName(targetClass));
                }
            }
        }
        for (const node of found)
        {
            ObserveIntersectToSetUpPlayer(node, 'valid entries MutationObserver');
        }
    };
    //#endregion
}



/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
//
async function onYouTubePlayerAPIReady(playerWrap, message = 'I dunno')
{
    if (!playerWrap) return; //console.count(message);

    // 1. last 9 letter form the closest blockID
    const uid = playerWrap.closest('span[data-uid]')?.getAttribute('data-uid') ||
        closestBlockID(playerWrap)?.slice(-9) ||
        closestBlockID(document.querySelector('.bp3-popover-open'))?.slice(-9);

    if (!uid) return;

    const newId = iframeIDprfx + Number(++creationCounter);


    // 2. the div that the YTiframe will replace
    playerWrap.className = `${cssData.yt_gif_wrapper} dont-focus-block`;
    playerWrap.innerHTML = '';
    const htmlText = await FetchText(links.html.playerControls);
    playerWrap.insertAdjacentHTML('afterbegin', htmlText);
    playerWrap.querySelector('.yt-gif-player').id = newId;


    // 3. weird recursive function... guys...
    const url = await InputBlockVideoParams(uid);
    allVideoParameters.set(newId, urlConfig(url));


    // 4. to record a target's point of reference
    const record = Object.create(sesionIDs);
    sesionIDs.uid = uid;
    const blockID = closestBlockID(playerWrap);
    if (blockID != null)
        recordedIDs.set(blockID, record);


    // 5. ACTUAL CREATION OF THE EMBEDED YOUTUBE VIDEO PLAYER (target)
    return new window.YT.Player(newId, playerConfig());

    //#region local utilites
    async function InputBlockVideoParams(tempUID)
    {
        const [finalURL, innerUIDs] = await TryToFindURL(tempUID);
        //
        const aliasText = document.querySelector('.bp3-popover-open .rm-alias--block')?.textContent;
        // lucky guy, this block contains a valid url
        if (finalURL && aliasText == null) return finalURL;

        // try on the same block
        for (const i of innerUIDs)
        {
            const [pURL, uids] = await TryToFindURL(i);
            if (pURL) return pURL;
        }

        // ok so... the recursive youtube class didn't quite register... don't look at me.

        for (const i of innerUIDs)
        {
            const [pURL, nestedUIDs, pAliases] = await TryToFindURL(i);

            for (const j of nestedUIDs)
            {
                const [pNestedURL] = await TryToFindURL(j);
                if (pNestedURL && pAliases && pAliases[j] === aliasText)
                    return pNestedURL;
            }
        }

        async function TryToFindURL(desiredUID)
        {
            const info = await window.roam42.common.getBlockInfoByUID(desiredUID);
            const rawText = info[0][0].string;
            const urls = rawText.match(/(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?[^ }]/);
            const innerUIDs = rawText.match(/(?<=\(\()([^(].*?[^)])(?=\)\))/gm);
            const aliases = rawText.match(/(?<=\[)(.*?)(?=\]\(\(\()/gm);
            //if url exist as Array return first index    //         //
            return [Array.isArray(urls) ? urls[0] : null, innerUIDs, aliases];
        }
    }
    function urlConfig(url)
    {
        let success = false;
        const media = Object.create(videoParams);
        if (url.match('https://(www.)?youtube|youtu\.be'))
        {
            // get ids //url = 'https://www.youtube.com/embed//JD-tF73Lyqo?t=423?end=425';
            const stepOne = url.split('?')[0];
            const stepTwo = stepOne.split('/');
            const videoId = stepTwo[stepTwo.length - 1];

            // get start & end seconds
            const start = /(t=|start=)(?:\d+)/g;
            const startSeconds = ExtractFromURL('int', start);
            //
            const end = /(end=)(?:\d+)/g;
            const endSeconds = ExtractFromURL('int', end);

            // get playback speed
            const speed = /(s=|speed=)([-+]?\d*\.\d+|\d+)/g;
            const speedFloat = ExtractFromURL('float', speed);

            // get volume
            const volume = /(vl=)(?:\d+)/g;
            const volumeInt = ExtractFromURL('int', volume);


            media.src = url;
            media.type = 'youtube';
            media.id = videoId;
            media.start = startSeconds;
            media.end = endSeconds;
            media.speed = speedFloat;
            media.volume = volumeInt;
            //
            success = true;

            //#region util
            function ExtractFromURL(key, regexedValue)
            {
                let pass;
                let desiredValue;
                let valueCallback = () => { };
                switch (key)
                {
                    case 'int':
                        valueCallback = (desiredValue, pass) =>
                        {
                            desiredValue = pass[0].match(/\d+/g).map(Number);
                            desiredValue = parseInt(desiredValue);
                            return desiredValue;
                        }
                        break;
                    case 'float':
                        valueCallback = (desiredValue, pass) =>
                        {
                            desiredValue = pass[0].match(/[+-]?\d+(\.\d+)?/g).map(function (v) { return parseFloat(v); });
                            desiredValue = parseFloat(desiredValue);
                            return desiredValue;
                        }
                        break;
                }
                //
                while ((pass = regexedValue.exec(url)) != null)
                {
                    if (pass.index === regexedValue.lastIndex)
                    {
                        regexedValue.lastIndex++;
                    }
                    desiredValue = valueCallback(desiredValue, pass);
                }
                return desiredValue;
            }
            //#endregion
        }

        if (success) { return media; }
        else { alert('No valid media id detected'); }
        return false;
    }
    function playerConfig()
    {
        const map = allVideoParameters.get(newId);
        return params = {
            height: '100%',
            width: '100%',
            videoId: map?.id,
            playerVars: {
                autoplay: 1, 		// Auto-play the video on load
                controls: 1, 		// Show pause/play buttons in player
                mute: 1,
                start: map?.start,
                end: map?.end,

                vq: 'hd1080',
                version: 3,
                feature: 'oembed',
                autohide: 1, 		// Hide video controls when playing
                showinfo: 0, 		// Hide the video title
                modestbranding: 1,  // Hide the Youtube Logo
                fs: 1,              // Hide the full screen button
                rel: 0,
                cc_load_policy: 3,  // Hide closed captions
                iv_load_policy: 3,  // Hide the Video Annotations
                enablejsapi: 1,
                origin: 'https://roamresearch.com',
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onStateChange
            }
        };
    }
    //#endregion
}
//
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
//
function onPlayerReady(event)
{
    const t = event.target;
    const iframe = document.querySelector('#' + t.h.id) || t.getIframe();
    const parent = iframe.closest('.' + cssData.yt_gif_wrapper) || iframe.parentElement;
    //
    const key = t.h.id;
    const map = allVideoParameters.get(key); //videoParams
    const start = map?.start || 0;
    const end = map?.end || t.getDuration();
    const clipSpan = end - start;
    const speed = map?.speed || 1;
    const volume = map?.volume || videoParams.volume || 40;
    const tickOffset = 1000 / speed;
    //
    const blockID = closestBlockID(iframe);
    const rocording = recordedIDs.get(blockID);
    // 🚧?
    if (rocording != null)
        rocording.target = t;

    // store them to cleare them
    t.__proto__.timers = [];
    t.__proto__.isPlaying = true;

    //autostop 🚧
    const loadingMarginOfError = 1; //seconds
    let updateStartTime = start;
    //
    t.__proto__.globalHumanInteraction = false;


    t.setVolume(volume);
    iframe.removeAttribute('title');
    t.setPlaybackRate(speed);

    //huh
    const timeDisplay = parent.querySelector('div.' + cssData.yt_gif_timestamp);

    //#region Loading values 🌿
    // load last sesion values
    if (lastBlockIDParameters.has(blockID))
    {
        let sesion = lastBlockIDParameters.get(blockID);
        //
        if (UI.permutations.start_form_previous_timestamp?.checked && bounded(sesion.updateTime))
            seekToUpdatedTime(sesion.updateTime);
        //
        t.setVolume(sesion.volume);
    }
    // load referenced values
    else
    {
        //Future Brand new adition to 'lastBlockIDParameters' map
        if (UI.permutations.referenced_start_timestamp.checked)
        {
            const players = document.querySelectorAll(`[id*=${iframeIDprfx}]`);
            for (let i = 0; i < players.length; i++)
            {
                if (players[i] === iframe) continue; //ignore itself

                if (players[i]?.src?.slice(0, -11) == iframe?.src?.slice(0, -11))
                { //removes at least 'widgetid=··' so they reconize each other

                    const desiredBlockID = blockID || document.querySelector('body > span[blockID]')?.getAttribute('blockID') || closestBlockID(players[i]);

                    const desiredTarget = recordedIDs.get(desiredBlockID)?.target || t;
                    const desiredTime = tick(desiredTarget) || start;
                    const desiredVolume = desiredTarget?.getVolume();

                    seekToUpdatedTime(desiredTime)

                    console.count(`loaded referenced values to ${key} from ${desiredBlockID}`);
                    break;
                }
            }
        }
    }
    function seekToUpdatedTime(desiredTime)
    {
        updateStartTime = desiredTime;
        t.seekTo(updateStartTime);
    }
    // #endregion



    //#region Event Handelers | DDMO stands for 'Drop Down Menu Option'
    function InAndOutHoverStatesDDMO(e)
    {
        //🌿
        if (e.type == 'mouseenter')
        {
            t.__proto__.globalHumanInteraction = true; // I'm afraid this event is slower to get attached than 200ms intervals... well 

            togglePlay(true);



            // kinda spaguetti code🚧 
            if (UI.muteStyle.strict_mute_everything_except_current.checked)
            {
                if (anyValidInAndOutKey(e))
                {
                    function muteWithBlock(id, el)
                    {
                        SoundIs(ytGifAttr.sound.mute, el);
                        recordedIDs.get(id)?.target?.mute();
                    }

                    const config = {
                        styleQuery: ytGifAttr.sound.unMute,
                        self_callback: (id, el) => muteWithBlock(id, el),
                        others_callback: (id, el) => muteWithBlock(id, el)
                    }

                    LoopTroughVisibleYTGIFs(config);
                }
            }
            if (UI.playStyle.strict_current_play_on_mouse_over.checked)
            {
                const config = {
                    styleQuery: ytGifAttr.play.playing,
                    others_callback: (id, el) =>
                    {
                        PlayIs(ytGifAttr.play.paused, el);
                        recordedIDs.get(id)?.target?.pauseVideo()
                    }
                }
                LoopTroughVisibleYTGIFs(config);
            }
            // ...but how else...? 🚧



            if (CanUnmute())
            {
                isSoundingFine();
            }
            else if (UI.muteStyle.muted_on_mouse_over.checked)
            {
                isSoundingFine(false);
            }

            //#region local utils
            function LoopTroughVisibleYTGIFs(config = { styleQuery, others_callback: () => { }, self_callback: () => { } })
            {
                const ytGifs = inViewport(allIframeStyle(config?.styleQuery));
                for (const i of ytGifs)
                {
                    const blockID = closestBlockID(i);
                    if (i != iframe)
                    {
                        config?.others_callback(blockID, i);
                    }
                    else if (config.BlockID_self_callback)
                    {
                        config?.self_callback(blockID, i);
                    }
                }
            }
            //#endregion
        }
        else if (e.type == 'mouseleave')
        {
            t.__proto__.globalHumanInteraction = false;

            togglePlay(!AnyPlayOnHover() && t.__proto__.isPlaying);

            //ﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠ//the same as: if it's true, then the other posibilities are false
            if (anyValidInAndOutKey(e) && !UI.muteStyle.muted_on_any_mouse_interaction.checked)
            {
                videoIsPlayingWithSound();
            }
            else
            {
                isSoundingFine(false);
            }
        }
    }
    function playStyleDDMO()
    {
        if (!inViewport(iframe)) return; //play all VISIBLE Players, this will be called on all visible iframes

        if (UI.playStyle.visible_clips_start_to_play_unmuted.checked)
        {
            togglePlay(true);
            isSoundingFine(false);
        }
        else if (AnyPlayOnHover())
        {
            togglePlay(!AnyPlayOnHover());
        }
        //console.count('playStyleDDMO');
    }

    function muteStyleDDMO()
    {
        if (!inViewport(iframe)) return; //mute all VISIBLE Players, this will be called on all visible iframes

        if (UI.muteStyle.strict_mute_everything_except_current.checked || UI.muteStyle.muted_on_any_mouse_interaction.checked)
        {
            isSoundingFine(false);
        }
        //console.count('muteStyleDDMO');
    }
    //#endregion


    // #region EventListeners | from DDMO
    for (const p in UI.playStyle)
    {
        UI.playStyle[p].addEventListener('change', playStyleDDMO); // all valid, toggle play state
    }
    for (const m in UI.muteStyle)
    {
        UI.muteStyle[m].addEventListener('change', muteStyleDDMO); // all valid, toggle play state
    }
    //toggle visuals or sound on hover
    parent.addEventListener('mouseenter', InAndOutHoverStatesDDMO);
    parent.addEventListener('mouseleave', InAndOutHoverStatesDDMO);
    //#endregion




    //#region Event Handelers | Instantiance Interactive Elements
    t.__proto__.timerID;
    t.__proto__.timeDisplayHumanInteraction = false;
    t.__proto__.enter = ContinuouslyUpdateTimeDisplay;
    t.__proto__.ClearTimers = ClearTimers;

    // for the timeDisplay
    function ContinuouslyUpdateTimeDisplay()
    {
        //🙋 this is too uggly
        if (document.querySelector('#' + key) == null)
        {
            t.__proto__.enter = () => { };
            t.destroy();
            return;
        }
        //🙋
        if (t.__proto__.timeDisplayHumanInteraction === false) return;


        UpdateTimeDisplay();

        t.__proto__.timerID = window.setInterval(() => UpdateTimeDisplay(), tickOffset);
        t.__proto__.timers.push(t.__proto__.timerID);

    }
    function UpdateTimeDisplay()
    {
        const sec = Math.abs(clipSpan - (end - tick()));

        //timeDisplay.innerHTML = '00:00/00:00'
        if (UI.permutations.clip_life_span_format.checked) 
        {
            timeDisplay.innerHTML = `${fmtMSS(sec)}/${fmtMSS(clipSpan)}`; //'sec':'clip end'
        }
        else
        {
            timeDisplay.innerHTML = `${fmtMSS(tick())}/${fmtMSS(end)}`; //'update':'end'
        }

        //#region util
        function fmtMSS(seconds)
        {
            const format = val => `0${Math.floor(val)}`.slice(-2);
            const hours = seconds / 3600;
            const minutes = (seconds % 3600) / 60;
            const displayFormat = hours < 1 ? [minutes, seconds % 60] : [hours, minutes, seconds % 60];

            return displayFormat.map(format).join(':');
        }
        //#endregion
    }

    function BoundWheelValueToSeek(e)
    {
        videoIsPlayingWithSound(false);

        let dir = tick() + (Math.sign(e.deltaY) * Math.round(UI.range.wheelOffset.value) * -1);
        if (UI.permutations.clip_life_span_format)
        {
            if (dir <= start)
                dir = end - 1;

            if (dir >= end)
                dir = start;
        }

        t.seekTo(dir);
        UpdateTimeDisplay();

        setTimeout(() =>
        {
            if (t.__proto__.timeDisplayHumanInteraction)
            {
                videoIsPlayingWithSound();
            }
        }, tickOffset); //nice delay to show feedback
    }

    function HumanInteractionHandeler()
    {
        t.__proto__.timeDisplayHumanInteraction = true
    }

    // for the parent
    function ResetTrackingValues()
    {
        t.__proto__.timeDisplayHumanInteraction = false;
        ClearTimers();
    }
    // for the timeDisplay | Utilie
    function ClearTimers()
    {
        window.clearInterval(t.__proto__.timerID);
        t.__proto__.timerID = null;

        if (t.__proto__.timers != [])
        {
            for (const tmr of t.__proto__.timers)
            {
                clearInterval(tmr);
            }

            t.__proto__.timers = [];
        }
    }

    //#endregion


    //#region EventListeners | from Elements
    timeDisplay.addEventListener('wheel', BoundWheelValueToSeek);
    timeDisplay.addEventListener('mouseenter', HumanInteractionHandeler);
    timeDisplay.addEventListener('mouseenter', ContinuouslyUpdateTimeDisplay);
    timeDisplay.addEventListener('mouseleave', ResetTrackingValues);
    // #endregion 



    //const withEventListeners = [parent, parent.parentNode, timeDisplay, ...Object.values(UI.playStyle), ...Object.values(UI.muteStyle)];
    const withEventListeners = [parent, parent.parentNode, timeDisplay];

    //#region OnDestroyed | UpdateNextSesionValues | Delete allVideoParameters | removeEventListeners
    const OnDestroyedObserver = new MutationObserver(function (mutationsList)
    {
        // check for removed target
        mutationsList.forEach(function (mutation)
        {
            const nodes = Array.from(mutation.removedNodes);
            const directMatch = nodes.indexOf(iframe) > -1
            const parentMatch = nodes.some(parent => parent.contains(iframe));

            if (directMatch)
            {
                console.log('node', iframe, 'was directly removed!');
            }
            else if (parentMatch)
            {
                // expensive for sure 🙋
                for (const el of withEventListeners)
                {
                    el.replaceWith(el.cloneNode(true));
                }
                for (const p in UI.playStyle)
                {
                    UI.playStyle[p].removeEventListener('change', playStyleDDMO); // all valid, toggle play state
                }
                for (const m in UI.muteStyle)
                {
                    UI.muteStyle[m].removeEventListener('change', muteStyleDDMO); // all valid, toggle play state
                }

                //🚧
                const media = Object.create(videoParams);
                media.updateTime = bounded(tick()) ? tick() : start;
                media.volume = t.getVolume();
                if (blockID != null)
                    lastBlockIDParameters.set(blockID, media);

                // clean...
                ClearTimers();
                recordedIDs.delete(blockID);
                allVideoParameters.delete(key);
                OnDestroyedObserver.disconnect();
                t.__proto__.enter = () => { };

                // either keep target
                const targetExist = document.querySelector('#' + key) == iframe;
                if (targetExist)
                    return console.log(`${key} is displaced, not removed, thus is not destroyed.`);

                //or destroy it after 1000ms
                setTimeout(() =>
                {
                    //this is too uggly
                    if (!targetExist)
                    {
                        t.destroy();
                        console.count('Destroyed! ' + key);
                    }
                }, 1000);
            }

        });
    });

    const config = { subtree: true, childList: true };

    OnDestroyedObserver.observe(document.body, config);
    //#endregion


    // #region pause onOffScreen
    const YscrollObserver = new IntersectionObserver(function (entries)
    {
        if (!entries[0])
            YscrollObserver.disconnect();

        if (tick() > updateStartTime + loadingMarginOfError && t.__proto__.globalHumanInteraction === false) // and the interval function 'OneFrame' to prevent the loading black screen
        {
            togglePlay(entries[0]?.isIntersecting, UI.playStyle.visible_clips_start_to_play_unmuted.checked);
        }
    }, { threshold: [0] });
    YscrollObserver.observe(iframe);
    //#endregion



    //🚧 🌿
    //#region unMute if referenced |OR| Pause and Avoid black screen loading bar
    const autoplayParent = iframe.closest('.rm-alias-tooltip__content') || //tooltip
        iframe.closest('.bp3-card') || //card
        iframe.closest('.myPortal'); //myPortal

    //simulate hover
    if (autoplayParent)
    {
        const simHover = new MouseEvent('mouseenter',
            {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });

        parent.dispatchEvent(simHover);

        t.__proto__.timeDisplayHumanInteraction = false;
    }
    else //Freeze
    {
        const OneFrame = setInterval(() =>
        {
            if (tick() > updateStartTime + loadingMarginOfError)
            {
                if (t.__proto__.globalHumanInteraction) // usees is listening, don't interrupt
                {
                    videoIsPlayingWithSound(true);
                }
                else if (inViewport(iframe) && t.__proto__.globalHumanInteraction === false)
                {
                    togglePlay(UI.playStyle.visible_clips_start_to_play_unmuted.checked);
                }

                clearInterval(OneFrame);
            }
        }, 200);
    }
    //#endregion


    // detect fullscreen mode
    iframe.addEventListener('fullscreenchange', () => currentFullscreenPlayer = t.h.id);

    //#region Utils
    function tick(target = t)
    {
        return target?.getCurrentTime();
    }
    function bounded(x)
    {
        return start < x && x < end;
    }


    function videoIsPlayingWithSound(boo = true)
    {
        isSoundingFine(boo);
        togglePlay(boo);
    }


    function togglePlay(bol, playing = true)
    {
        if (bol && playing)
        {
            t.__proto__.isPlaying = true;
            PlayIs(ytGifAttr.play.playing);
            t.playVideo();
        }
        else
        {
            t.__proto__.isPlaying = false;
            PlayIs(ytGifAttr.play.paused);
            t.pauseVideo();
        }
    }

    function isSoundingFine(boo = true)
    {
        if (boo)
        {
            SoundIs(ytGifAttr.sound.unMute);
            t.unMute();
        }
        else
        {
            SoundIs(ytGifAttr.sound.mute);
            t.mute();
        }
    }

    function anyValidInAndOutKey(e)
    {
        if (e.buttons == 4) return true;

        for (const name in UI.InAndOutKeys)
            if (e[name] && isTrue(UI.InAndOutKeys[name]))
                return true;

        return false;
    }


    function AnyPlayOnHover()
    {
        return UI.playStyle.play_on_mouse_over.checked || UI.playStyle.strict_current_play_on_mouse_over.checked
    }


    function CanUnmute()//NotMuteAnyHover
    {
        return !UI.muteStyle.muted_on_mouse_over.checked && !UI.muteStyle.muted_on_any_mouse_interaction.checked
    }

    function SoundIs(style, el = iframe)
    {
        StyleAttribute(ytGifAttr.sound, style, el);
    }

    function PlayIs(style, el = iframe)
    {
        StyleAttribute(ytGifAttr.play, style, el);
    }

    function StyleAttribute(subStyle, style, el)
    {
        for (const key in subStyle)
            el.removeAttribute(subStyle[key]);
        el.setAttribute(style, '');
    }

    //#endregion

}
//
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
//
//loops between 'start' and 'end' boundaries
function onStateChange(state)
{
    const t = state.target;
    const map = allVideoParameters.get(t.h.id);

    if (state.data === YT.PlayerState.ENDED)
    {
        t.seekTo(map?.start || 0);

        if (UI.permutations.smoll_vid_when_big_ends.checked && (currentFullscreenPlayer === t.h.id)) // let's not talk about that this took at least 30 mins. Don't. Ughhhh
        {
            if (document.fullscreenElement)
            {
                exitFullscreen();
            }
        }
    }


    if (state.data === YT.PlayerState.PLAYING)
    {
        t.__proto__.isPlaying = true;

        if (t.__proto__.timerID === null) // NON ContinuouslyUpdateTimeDisplay
        {
            t.__proto__.enter();
        }
    }


    if (state.data === YT.PlayerState.PAUSED)
    {
        t.__proto__.isPlaying = false;
        t.__proto__.ClearTimers();
    }
}

//#region Utilies
function inViewport(els)
{
    let matches = [],
        elCt = els.length;

    for (let i = 0; i < elCt; ++i)
    {
        let el = els[i],
            b = el.getBoundingClientRect(),
            c;

        if (b.width > 0 && b.height > 0 &&
            b.left + b.width > 0 && b.right - b.width < window.outerWidth &&
            b.top + b.height > 0 && b.bottom - b.width < window.outerHeight &&
            (c = window.getComputedStyle(el)) &&
            c.getPropertyValue('visibility') === 'visible' &&
            c.getPropertyValue('opacity') !== 'none')
        {
            matches.push(el);
        }
    }
    return matches;
}

function div(classList)
{
    let el = document.createElement('div');
    return emptyEl(classList, el);
}
function checkbox(classList)
{
    let el = document.createElement('input');
    return emptyEl(classList, el);
}
function radio(classList)
{
    let el = document.createElement('input');
    return emptyEl(classList, el);
}
function range(classList)
{
    let el = document.createElement('label');
    return emptyEl(classList, el);
}
function label(classList)
{
    let el = document.createElement('label');
    return emptyEl(classList, el);
}

function emptyEl(classList, el)
{
    if (classList)
        el.classList.add(classList);
    return el;
}

function exitFullscreen()
{
    if (document.exitFullscreen)
    {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen)
    {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen)
    {
        document.webkitExitFullscreen();
    }
}
function closestBlockID(el)
{
    return el?.closest('.rm-block__input')?.id
}
function allIframeIDprfx()
{
    return document.querySelectorAll(`[id*=${iframeIDprfx}]`);
}
function allIframeStyle(style)
{
    return document.querySelectorAll(`[${style}]`);
}

function htmlToElement(html)
{
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function cleanUpHTML(content)
{
    var dom = document.createElement('div');
    dom.innerHTML = content;
    var elems = dom.getElementsByTagName('*');
    for (var i = 0; i < elems.length; i++)
    {
        if (elems[i].innerHTML)
        {
            elems[i].innerHTML = elems[i].innerHTML.trim();
        }
    }
    return dom.innerHTML;
}
function isTrue(value)
{
    if (typeof (value) === 'string')
        value = value.trim().toLowerCase();

    switch (value)
    {
        case true:
        case 'true':
        case 1:
        case '1':
        case 'on':
        case 'yes':
            return true;
        default:
            return false;
    }
}


async function FetchText(url)
{
    const [response, err] = await tryingToFetch(url); // firt time fetching something... This is cool
    if (response)
        return await response.text();
}
async function tryingToFetch(url)
{
    try
    {
        const response = await fetch(url);
        if (!response.ok)
            throw new Error('Request failed.');
        return [response, null];
    }
    catch (error)
    {
        console.log(`Your custom link ${url} is corrupt. ;c`);
        return [null, error];
    };
}

function create_css_rule(css_rules = 'starndard css rules')
{
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = css_rules;
    document.getElementsByTagName('head')[0].appendChild(style);
}
function isValidCSSUnit(value)
{
    //  valid CSS unit types
    const CssUnitTypes = ['em', 'ex', 'ch', 'rem', 'vw', 'vh', 'vmin',
        'vmax', '%', 'cm', 'mm', 'in', 'px', 'pt', 'pc'];

    // create a set of regexps that will validate the CSS unit value
    const regexps = CssUnitTypes.map((unit) =>
    {
        // creates a regexp that matches '#unit' or '#.#unit' for every unit type
        return new RegExp(`^[0-9]+${unit}$|^[0-9]+\\.[0-9]+${unit}$`, 'i');
    });

    // attempt to find a regexp that tests true for the CSS value
    const isValid = regexps.find((regexp) => regexp.test(value)) !== undefined;

    return isValid;
}
//#endregion




/*

const selfCases = {
        play: togglePlay(true),
        mute: isSoundingFine(false),
    }

    const otherCases = {
        pause: (id) => recordedIDs.get(id)?.target?.togglePlay(false),
        mute: (id) => recordedIDs.get(id)?.target?.isSoundingFine(false)
    }

    const specialCases = {
        playSelf_pauseRest: {
            self_callback: togglePlay(true),
            others_callback: recordedIDs.get(id)?.target?.togglePlay(false)
        },
        playUnmuted_AND_pauseMuteRest: {
            self_callback: videoIsPlayingWithSound(true),
            others_callback: recordedIDs.get(id)?.target?.videoIsPlayingWithSound(false)
        },
        muteEitherWay: {
            self_callback: isSoundingFine(false),
            others_callback: recordedIDs.get(id)?.target?.isSoundingFine(false)
        }
    }

    const enterRadioCombinations = {
        strict_mute: {//AND
            strict_play: [specialCases.playUnmuted_AND_pauseMuteRest],
            play_mouse_enter: [otherCases.mute, selfCases.play],
            all_play_unmuted: [otherCases.mute],
        },
        mute_mouse_enter: {
            strict_play: [selfCases.mute, otherCases.pause],
            play_mouse_enter: [selfCases.mute, selfCases.play],
            all_play_unmuted: [selfCases.mute],
        },
        mute_either_way: {
            strict_play: [specialCases.muteEitherWay, specialCases.playSelf_pauseRest],
            play_mouse_enter: [specialCases.muteEitherWay, selfCases.play],
            all_play_unmuted: [specialCases.muteEitherWay],
        }
    }
    const leaveRadioCombinations = {
        strict_mute: {//AND
            strict_play: [specialCases.playUnmuted_AND_pauseMuteRest],
            play_mouse_enter: [otherCases.mute, selfCases.play],
            all_play_unmuted: [otherCases.mute],
        },
        mute_mouse_enter: {
            strict_play: [selfCases.mute, otherCases.pause],
            play_mouse_enter: [selfCases.mute, selfCases.play],
            all_play_unmuted: [selfCases.mute],
        },
        mute_either_way: {
            strict_play: [specialCases.muteEitherWay, specialCases.playSelf_pauseRest],
            play_mouse_enter: [specialCases.muteEitherWay, selfCases.play],
            all_play_unmuted: [specialCases.muteEitherWay],
        }
    }

    function leaveIterate(firstLevel = '', firstLevelKey = '')
    {
        for (const iterator of enterRadioCombinations[firstLevel][firstLevelKey])
        {
            iterator();
        }
    }

    function enterIterate(firstLevel = '', firstLevelKey = '')
    {
        for (const iterator of enterRadioCombinations[firstLevel][firstLevelKey])
        {
            iterator();
        }
    }

    function InAndOutHoverStatesDDMO(e)
    {
        if (e.type == 'mouseenter')
        {
            t.__proto__.globalHumanInteraction = true;

            if (UI.muteStyle.strict_mute_everything_except_current.checked)
            {
                if (UI.playStyle.strict_current_play_on_mouse_over.checked)
                {
                    enterIterate('strict_mute', 'strict_play');
                }
                else if (UI.playStyle.play_on_mouse_over.checked)
                {
                    enterIterate('strict_mute', 'play_mouse_enter');
                }
                else if (UI.playStyle.visible_clips_start_to_play_unmuted.checked)
                {
                    enterIterate('strict_mute', 'all_play_unmuted');
                }
            }
            if (UI.muteStyle.muted_on_mouse_over.checked)
            {
                if (UI.playStyle.strict_current_play_on_mouse_over.checked)
                {
                    enterIterate('strict_mute', 'strict_play');
                }
                else if (UI.playStyle.play_on_mouse_over.checked)
                {
                    enterIterate('mute_mouse_enter', 'play_mouse_enter');
                }
                else if (UI.playStyle.visible_clips_start_to_play_unmuted.checked)
                {
                    enterIterate('mute_mouse_enter', 'all_play_unmuted');
                }
            }
            if (UI.muteStyle.muted_on_any_mouse_interaction.checked)
            {
                if (UI.playStyle.strict_current_play_on_mouse_over.checked)
                {
                    enterIterate('mute_either_way', 'strict_play');
                }
                else if (UI.playStyle.play_on_mouse_over.checked)
                {
                    enterIterate('mute_either_way', 'play_mouse_enter');
                }
                else if (UI.playStyle.visible_clips_start_to_play_unmuted.checked)
                {
                    enterIterate('mute_either_way', 'all_play_unmuted');
                }
            }
        }
        else if (e.type == 'mouseleave')
        {
            t.__proto__.globalHumanInteraction = false;
            if (UI.muteStyle.strict_mute_everything_except_current.checked)
            {
                if (UI.playStyle.strict_current_play_on_mouse_over.checked)
                {
                    leaveIterate('strict_mute', 'strict_play');
                }
                else if (UI.playStyle.play_on_mouse_over.checked)
                {
                    leaveIterate('strict_mute', 'play_mouse_enter');
                }
                else if (UI.playStyle.visible_clips_start_to_play_unmuted.checked)
                {
                    leaveIterate('strict_mute', 'all_play_unmuted');
                }
            }
            if (UI.muteStyle.muted_on_mouse_over.checked)
            {
                if (UI.playStyle.strict_current_play_on_mouse_over.checked)
                {
                    leaveIterate('strict_mute', 'strict_play');
                }
                else if (UI.playStyle.play_on_mouse_over.checked)
                {
                    leaveIterate('mute_mouse_enter', 'play_mouse_enter');
                }
                else if (UI.playStyle.visible_clips_start_to_play_unmuted.checked)
                {
                    leaveIterate('mute_mouse_enter', 'all_play_unmuted');
                }
            }
            if (UI.muteStyle.muted_on_any_mouse_interaction.checked)
            {
                if (UI.playStyle.strict_current_play_on_mouse_over.checked)
                {
                    leaveIterate('mute_either_way', 'strict_play');
                }
                else if (UI.playStyle.play_on_mouse_over.checked)
                {
                    leaveIterate('mute_either_way', 'play_mouse_enter');
                }
                else if (UI.playStyle.visible_clips_start_to_play_unmuted.checked)
                {
                    leaveIterate('mute_either_way', 'all_play_unmuted');
                }
            }
        }
    }

*/