//verion 22 - semi-refactored
// Load the IFrame Player API.
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

/*-----------------------------------*/
/* USER SETTINGS  */
const UI = window.YTGIF;
/*-----------------------------------*/
const iframeIDprfx = "player_";
let creationCounter = -1;
/*-----------------------------------*/
const allVideoParameters = new Map();
const lastBlockIDParameters = new Map();
const videoParams = {
    src: "https://www.youtube.com/embed/---------?",
    id: "---------",
    start: 000,
    end: 000,
    speed: 1,
    updateTime: 0,
    volume: 40
};
//
const recordedIDs = new Map();
const sesionIDs = {
    target: null,
    uid: "---------"
}
/*-----------------------------------*/
const links = {
    css: {
        dropDownMenu: 'https://kauderk.github.io/yt-gif-extension/drop-down-menu.css',
        player: 'https://kauderk.github.io/yt-gif-extension/player.css',
    },
    html: {
        dropDownMenu: 'https://kauderk.github.io/yt-gif-extension/drop-down-menu.html'
    }
}
/*-----------------------------------*/
const styleIs = {
    sound: {
        mute: "yt-mute",
        unMute: "yt-unmute"
    },
    play: {
        playing: "yt-playing",
        paused: "yt-paused"
    },
    extra: {
        readyToEnable: "readyToEnable"
    }
}
/*-----------------------------------*/


// wait for APIs to exist, load dropdown menu and deploy iframes
const almostReady = setInterval(() =>
{
    if ((typeof window.roam42?.common == 'undefined'))
    {
        //this is ugly - 
        console.count("activating YT GIF extension | common");
        return;
    }
    if ((typeof (YT) == 'undefined'))
    {
        console.count("activating YT libraries | common");
        console.count("this is ugly | YT");
        return;
    }

    clearInterval(almostReady);
    GettingReady();

}, 500);

async function GettingReady()
{
    const m = await LoadCSS(links.css.dropDownMenu);
    const p = await LoadCSS(links.css.player);
    const s = await isHTML_AND_InputsSetUP();

    ObserveIframesAndDelployYTPlayers();

    //#region uitils
    function LoadCSS(cssURL) // 'cssURL' is the stylesheet's URL, i.e. /css/styles.css
    {
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

async function isHTML_AND_InputsSetUP()
{
    // 1. charge the drop down menu html
    const topbarEl = document.querySelector("#app > div > div.roam-app > div.flex-h-box > div.roam-main > div.rm-files-dropzone > div > span:nth-child(8)")

    const response = await fetch(links.html.dropDownMenu); // firt time fetching something... This is cool
    const text = await response.text();

    topbarEl.insertAdjacentHTML("afterend", text);


    // 2. assign the User Interface Inputs to their variables - this took a solid hour. thak you thank you
    for (const property in UI)
    {
        for (let key in UI[property])
        {
            const userValue = UI[property][key];
            const domEl = document.getElementById(key);
            //don't mess up any other variable
            if (domEl) UI[property][key] = domEl;

            switch (property)
            {
                case "permutations":
                case "muteStyle":
                case "playStyle":
                    UI[property][key].checked = isTrue(userValue);
                    break;
                case "range":
                    UI[property][key].value = Number(userValue);
                    break;
                case "label":
                    UI[property][key].innerHTML = userValue;
                    break;
            }
        }
    }


    // 3. One time - the timestamp scroll offset updates on changes
    UI.range.wheelOffset.addEventListener("change", () => UpdateRangeValue());
    UI.range.wheelOffset.addEventListener("wheel", (e) =>
    {
        let dir = Math.sign(e.deltaY) * -1;
        let parsed = parseInt(UI.range.wheelOffset.value, 10);
        UI.range.wheelOffset.value = Number(dir + parsed);
        UpdateRangeValue();
    });
    UpdateRangeValue();

    //#region utils
    function UpdateRangeValue()
    {
        UI.label.rangeValue.innerHTML = UI.range.wheelOffset.value;
    }
    //#endregion
}

function ObserveIframesAndDelployYTPlayers()
{
    const cssClass = 'rm-video-player__container';

    // 1. set up all visible YT GIFs
    const visible = inViewport(document.querySelectorAll('.' + cssClass));
    for (const i of visible)
    {
        onYouTubePlayerAPIReady(i, 'first wave');
    }

    // 2. IntersectionObserver attached to deploy when visible
    const hidden = document.querySelectorAll('.' + cssClass);
    for (const i of hidden)
    {
        ObserveIntersectToSetUpPlayer(i, "second wave"); // I'm quite impressed with this... I mean...
    }

    // 3. ready to observe and deploy iframes
    const targetNode = document.getElementById('app');
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(mutation_callback);

    observer.observe(targetNode, config);

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

                if (node.classList.contains(cssClass))
                {
                    found.push(node);
                }
                else if (node.firstElementChild)
                {
                    // javascript is crazy and i don't get how or what this is doing... man...
                    found.push(...node.getElementsByClassName(cssClass));
                }
            }
        }
        for (const node of found)
        {
            ObserveIntersectToSetUpPlayer(node, "valid entries MutationObserver");
        }
    };
    //#endregion
}



/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
//
async function onYouTubePlayerAPIReady(playerWrap, message = "I don't know")
{
    if (!playerWrap) return; //console.count(message);

    // 1. last 9 letter form the closest blockID
    const uid = playerWrap.closest("span[data-uid]")?.getAttribute("data-uid") ||
        closestBlockID(playerWrap).slice(-9) ||
        closestBlockID(document.querySelector(".bp3-popover-open")).slice(-9);

    const newId = iframeIDprfx + Number(++creationCounter);


    // 2. the div that the YTiframe will replace
    playerWrap.className = 'YTwrapper dont-focus-block';
    playerWrap.innerHTML = "";
    playerWrap.insertAdjacentHTML("afterbegin", `<div id="${newId}"></div>
    <div class="YT-controls">
        <div class="theaterModeDiv"></div>
        <div class="YT-clip-time">00:00/00:00</div>
    </div>`);


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
        const aliasText = document.querySelector(".bp3-popover-open .rm-alias--block")?.textContent;
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
            const startSeconds = ExtractFromURL("int", start);
            //
            const end = /(end=)(?:\d+)/g;
            const endSeconds = ExtractFromURL("int", end);

            // get playback speed
            const speed = /(s=|speed=)([-+]?\d*\.\d+|\d+)/g;
            const speedFloat = ExtractFromURL("float", speed);

            // get volume
            const volume = /(vl=)(?:\d+)/g;
            const volumeInt = ExtractFromURL("int", volume);

            media.src = url;
            media.type = "youtube";
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
                    case "int":
                        valueCallback = (desiredValue, pass) =>
                        {
                            desiredValue = pass[0].match(/\d+/g).map(Number);
                            desiredValue = parseInt(desiredValue);
                            return desiredValue;
                        }
                        break;
                    case "float":
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
        else { alert("No valid media id detected"); }
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
    const iframe = document.querySelector("#" + t.h.id) || t.getIframe();
    const parent = iframe.parentElement;
    //
    const key = t.h.id;
    const map = allVideoParameters.get(key); //videoParams
    const start = map?.start || 0;
    const end = map?.end || t.getDuration();
    const clipSpan = end - start;
    const speed = map?.speed || 1;
    const volume = map?.volume || videoParams.volume;
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
    let globalHumanInteraction = false;







    t.setVolume(volume);
    iframe.removeAttribute("title");
    t.setPlaybackRate(speed);

    //huh
    const timeDisplay = parent.querySelector("div.YT-clip-time");

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
        //Future Brand new adition to "lastBlockIDParameters" map
        if (UI.permutations.referenced_start_timestamp.checked)
        {
            let players = document.querySelectorAll(`[id*=${iframeIDprfx}]`);
            for (let i = 0; i < players.length; i++)
            {
                if (players[i] === iframe) continue; //ignore itself

                if (players[i]?.src?.slice(0, -11) == iframe?.src?.slice(0, -11))
                { //removes at least "widgetid=··" so they reconize each other

                    const desiredBlockID = blockID || document.querySelector("body > span[blockID]")?.getAttribute("blockID") || closestBlockID(players[i]);

                    const desiredTarget = recordedIDs.get(desiredBlockID)?.target || t;
                    const desiredTime = tick(desiredTarget) || start;
                    const desiredVolume = desiredTarget?.getVolume();

                    seekToUpdatedTime(desiredTime)

                    console.count(`loaded referenced values to ${key} from ${desiredBlockID}`);
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



    //#region Event Handelers | DDMO stands for "Drop Down Menu Option"
    function InAndOutHoverStatesDDMO(e)
    {
        //🌿
        if (e.type == "mouseenter")
        {
            globalHumanInteraction = true; // I'm afraid this event is slower to get attached than 200ms intervals... well 

            togglePlay(true);



            // kinda spaguetti code🚧 
            if (UI.muteStyle.strict_mute_everything_except_current.checked)
            {
                if ((e.buttons == 4 || anyValidInAndOutKey(e)))
                {
                    const muteWithBlock = (id) => recordedIDs.get(id)?.target?.mute();

                    const config = {
                        styleQuery: styleIs.sound.unMute,
                        self_callback: (id) => muteWithBlock(id),
                        notSelf_callback: (id, el) =>
                        {
                            muteWithBlock(id)
                            SoundIs(styleIs.sound.mute, el);
                            recordedIDs.get(id)?.target?.mute();
                        }
                    }
                    LoopTroughVisibleYTGIFs(config);
                }
            }
            if (UI.playStyle.strict_current_play_on_mouse_over.checked)
            {
                const config = {
                    styleQuery: styleIs.play.playing,
                    notSelf_callback: (id, el) =>
                    {
                        PlayIs(styleIs.play.paused, el);
                        recordedIDs.get(id)?.target?.pauseVideo()
                    }
                }
                LoopTroughVisibleYTGIFs(config);
            }
            // ...but how else...? 🚧



            if (CanUnmute())
            {
                SoundIs(styleIs.sound.unMute);
                t.unMute();
            }

            //#region local utils
            function LoopTroughVisibleYTGIFs(config = { styleQuery, BlockID_notSelf_callback, BlockID_self_callback })
            {
                const ytGifs = inViewport(allIframeStyle(styleQuery));
                for (const i of ytGifs)
                {
                    const blockID = closestBlockID(i);
                    if (i != iframe)
                    {
                        config.BlockID_notSelf_callback(blockID, i);
                    }
                    else if (config.BlockID_self_callback)
                    {
                        config.BlockID_self_callback(blockID, i);
                    }
                }
            }
            //#endregion
        }
        else if (e.type == "mouseleave")
        {
            globalHumanInteraction = false;

            //weird
            if (!UI.muteStyle.muted_on_any_mouse_interaction.checked)
            {
                togglePlay(!AnyPlayOnHover() && t.__proto__.isPlaying);
            }

            if (e.buttons == 4 || anyValidInAndOutKey(e))
            {
                videoIsPlayingWithSound();
            }
            else
            {
                SoundIs(styleIs.sound.mute);
                t.mute();
            }
        }
    }
    function playStyleDDMO()
    {
        //play all VISIBLE Players
        if (!inViewport(iframe)) return;

        if (UI.playStyle.visible_clips_start_to_play_unmuted.checked)
            togglePlay(UI.playStyle.visible_clips_start_to_play_unmuted.checked);
        if (AnyPlayOnHover())
            togglePlay(!AnyPlayOnHover());
    }
    //#endregion


    // #region EventListeners | from DDMO
    for (const checkbox in UI.playStyle)
    {
        UI.playStyle[checkbox].addEventListener("change", playStyleDDMO); // all valid, toggle play state
    }
    //toggle visuals or sound on hover
    parent.addEventListener("mouseenter", InAndOutHoverStatesDDMO);
    parent.addEventListener("mouseleave", InAndOutHoverStatesDDMO);
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
        if (document.querySelector("#" + key) == null)
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

        //timeDisplay.innerHTML = "00:00/00:00"
        if (UI.permutations.clip_life_span_format.checked) 
        {
            timeDisplay.innerHTML = `${fmtMSS(sec)}/${fmtMSS(clipSpan)}`; //"sec":"clip end"
        }
        else
        {
            timeDisplay.innerHTML = `${fmtMSS(tick())}/${fmtMSS(end)}`; //"update":"end"
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
    timeDisplay.addEventListener("wheel", BoundWheelValueToSeek);
    timeDisplay.addEventListener("mouseenter", HumanInteractionHandeler);
    timeDisplay.addEventListener("mouseenter", ContinuouslyUpdateTimeDisplay);
    timeDisplay.addEventListener("mouseleave", ResetTrackingValues);
    // #endregion 



    const withEventListeners = [parent, parent.parentNode, timeDisplay, ...Object.values(UI.playStyle)];


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
                const targetExist = document.querySelector("#" + key) == iframe;
                if (targetExist)
                    return console.log(`${key} is displaced, not removed, thus is not destroyed.`);

                //or destroy it after 1000ms
                setTimeout(() =>
                {
                    //this is too uggly
                    if (!targetExist)
                    {
                        t.destroy();
                        console.count("Destroyed! " + key);
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

        if (tick() > updateStartTime + loadingMarginOfError && globalHumanInteraction === false) // and the interval function "OneFrame" to prevent the loading black screen
        {
            togglePlay(entries[0]?.isIntersecting, UI.playStyle.visible_clips_start_to_play_unmuted.checked);
        }
    }, { threshold: [0] });
    YscrollObserver.observe(iframe);
    //#endregion



    //🚧 🌿
    //#region unMute if referenced |OR| Pause and Avoid black screen loading bar
    const autoplayParent = iframe.closest(".rm-alias-tooltip__content") || //tooltip
        iframe.closest(".bp3-card") || //card
        iframe.closest(".myPortal"); //myPortal

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
                if (globalHumanInteraction) // usees is listening, don't interrupt
                {
                    videoIsPlayingWithSound(true);
                }
                else if (inViewport(iframe) && globalHumanInteraction === false)
                {
                    togglePlay(UI.playStyle.visible_clips_start_to_play_unmuted.checked);
                }

                clearInterval(OneFrame);
            }
        }, 200);
    }
    //#endregion

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
        if (boo)
        {
            SoundIs(styleIs.sound.unMute);
            t.unMute();
        }
        else
        {
            SoundIs(styleIs.sound.mute);
            t.mute();
        }
        togglePlay(boo);
    }


    function togglePlay(bol, playing = true)
    {
        if (bol && playing)
        {
            t.__proto__.isPlaying = true;
            PlayIs(styleIs.play.playing);
            t.playVideo();
        }
        else
        {
            t.__proto__.isPlaying = false;
            PlayIs(styleIs.play.paused);
            t.pauseVideo();
        }
    }


    function anyValidInAndOutKey(e)
    {
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
        StyleAttribute(styleIs.sound, style, el);
    }

    function PlayIs(style, el = iframe)
    {
        StyleAttribute(styleIs.play, style, el);
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
//loops between "start" and "end" boundaries
function onStateChange(state)
{
    const t = state.target;
    const map = allVideoParameters.get(t.h.id);

    if (state.data === YT.PlayerState.ENDED)
    {
        t.seekTo(map?.start || 0);

        if (UI.permutations.smoll_vid_when_big_ends.checked)
        {
            exitFullscreen();
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
    //if (window.innerHeight == screen.height) return false;
    if (!document.fullscreenElement) return false;
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
    return el?.closest(".rm-block__input")?.id
}
function allIframeIDprfx()
{
    return document.querySelectorAll(`[id*=${iframeIDprfx}]`);
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
    var dom = document.createElement("div");
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
        case "true":
        case 1:
        case "1":
        case "on":
        case "yes":
            return true;
        default:
            return false;
    }
}
//#endregion

