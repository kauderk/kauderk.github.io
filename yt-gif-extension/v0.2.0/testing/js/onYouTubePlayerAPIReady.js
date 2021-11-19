async function onYouTubePlayerAPIReady(wrapper, targetClass, dataCreation, message = 'I dunno')
{
    if (message == 'testing manual ty gif tutorial')
    {
        console.log(message);
        //debugger;
    }
    if (!wrapper) return;



    // 1. last 9 letter form the closest blockID
    const uid = UTILS.closestBlockID(wrapper)?.slice(-9) ||
        wrapper.closest(`[${attrInfo.uid}]`)?.getAttribute(attrInfo.uid) || //🤔
        UTILS.closestBlockID(document.querySelector('.bp3-popover-open'))?.slice(-9);

    if (!uid) return; // don't add up false positives
    const newId = iframeIDprfx + Number(++window.YT_GIF_OBSERVERS.creationCounter);



    // 2. extract data and store them in maps
    const urlIndex = getValidUrlIndex_mainUidBlocksMap();
    const url = wrapper.getAttribute(attrInfo.url.path) || //🤔
        await InputBlockVideoParams(uid, urlIndex);

    // 2.1 OnPlayerReady video params point of reference
    allVideoParameters.set(newId, urlConfig(url));
    const configParams = allVideoParameters.get(newId);

    // 2.2 target's point of reference
    const record = JSON.parse(JSON.stringify(sesionIDs));
    sesionIDs.uid = uid;
    const blockID = getProperYTGIFParentID(wrapper, wrapper) //🤔
    if (blockID != null)
        recordedIDs.set(blockID, record);



    // 3. delete block's mainUidBlocksMap entry when removed form DOM
    const options = {
        el: wrapper,
        OnRemmovedFromDom_cb: (o) => mainUidBlocks.delete(uid),
    }
    RemoevedElement(options); // not elegant but works



    // 4. the div that the YTiframe will replace
    if (wrapper.tagName != 'DIV')
        wrapper = UTILS.ChangeElementType(wrapper, 'div');
    wrapper.parentElement.classList.add(`${cssData.yt_gif_wrapper}-parent`);
    wrapper.className = `${cssData.yt_gif_wrapper} dont-focus-block`;
    wrapper.setAttribute(attrInfo.target, targetClass);
    wrapper.setAttribute(attrInfo.creation.name, dataCreation);
    wrapper.setAttribute(attrInfo.url.path, url);
    wrapper.setAttribute(attrInfo.url.index, urlIndex || 0);
    wrapper.innerHTML = '';
    wrapper.insertAdjacentHTML('afterbegin', links.html.fetched.playerControls);
    wrapper.querySelector('.yt-gif-player').id = newId;



    // 5. 
    if (dataCreation == attrInfo.creation.forceAwaiting || isValid_Awaiting_check())
    {
        return await DeployYT_IFRAME_OnInteraction();
    }
    else
    {
        return DeployYT_IFRAME();
    }



    // 2. extract data
    function getValidUrlIndex_mainUidBlocksMap()
    {
        // read first instance of rm-block__input's components, because on every observer call AND on each function pass - they get replaced by iframe wrappers
        // because there could be more than one yt-gif component in one block
        if (!mainUidBlocks.has(uid)) // 🤔
        {
            mainUidBlocks.set(uid, [...document.querySelector('#' + closestYTGIFparentID(wrapper)).querySelectorAll('.rm-xparser-default-yt-gif')]);
        }
        const urlIndex = mainUidBlocks.get(uid).indexOf(wrapper);
        return urlIndex;
    }

    // 3. get relevant url
    async function InputBlockVideoParams(tempUID, indexOfComponent)
    {
        let indentFunc = 0;
        let componentsInOrderMap = new Map();

        const orderObj = {
            order: -1,
            incrementIf: function (condition) { return condition ? Number(++this.order) : 'ﾠ' }
        };
        const results = {
            'component alias': {
                tone: 'purple',
            },
            'has any aliases': {
                tone: 'blue'
            },
            'component': {
                tone: 'green',
            },
            'any': {
                condition: () => true,
                tone: 'black',
            },
            'any component': {
            },
        }

        // filter result keys that include 'component' word and assign it a orderObj
        Object.keys(results).filter(key => key.includes('component'))
            .forEach(key => Object.assign(results[key], orderObj));


        const FirstObj = await TryToFindURL_Rec(tempUID);
        console.log(componentsInOrderMap);
        console.log('\n'.repeat(6)); // debugging

        // loop through componentsInOrderMap keys
        for (let [key, value] of componentsInOrderMap.entries())
        {
            const deconstructKey = key.split(' ');
            if (deconstructKey[4] == indexOfComponent)
            {
                return value;
            }
        }
        debugger;




        async function TryToFindURL_Rec(uid, parentObj)
        {
            const objRes = await TryToFindURL(uid);

            results['component alias'].condition = () => parentObj?.innerAliasesUids?.includes(uid) && (!!objRes.urls?.[0]);
            results['has any aliases'].condition = () => objRes?.innerAliasesUids.length > 0;
            results['component'].condition = () => objRes.components.length > 0;
            const key = Object.keys(results).find(x => results[x].condition());


            console.log("%c" + cleanIndentedBlock(), `color:${results[key].tone}`);


            for (const i of objRes.urlsWithUids)
            {
                if (objRes.urls.includes(i)) // either component or component alias // set in the order in which roam renders them
                {
                    componentsInOrderMap.set(assertUniqueKey_while(uid), i || 'no component url');
                }

                if (objRes.innerUIDs.includes(i))
                {
                    indentFunc += 1;
                    const awaitingObj = await TryToFindURL_Rec(i, objRes);
                    indentFunc -= 1;
                }
            }

            return { uid, objRes, parentObj };

            function assertUniqueKey_while(uid)
            {
                // the order in which the components are rendered within the block
                const keyAnyComponetInOrder = results['any component'].incrementIf(kauderk.util.includesAtlest(['component', 'component alias'], key, null));
                const keyInComponentOrder = results['component'].incrementIf(key === 'component');
                const keyInAliasComponentOrder = results['component alias'].incrementIf(key === 'component alias');

                const baseKey = [indentFunc, uid, keyAnyComponetInOrder, keyInComponentOrder, keyInAliasComponentOrder, key];

                let similarCount = 0; // keep track of similarities
                const preKey = () => [similarCount, ...baseKey].join(' ') + 'ﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠ';
                let uniqueKey = preKey();

                while (componentsInOrderMap.has(uniqueKey))
                {
                    similarCount += 1; // try to make it unique
                    uniqueKey = preKey();
                }

                return uniqueKey;
            }

            function cleanIndentedBlock()
            {
                const tab = '\t'.repeat(indentFunc);
                const cleanLineBrakes = objRes.rawText.replace(/(\n)/gm, ". ");
                const indentedBlock = tab + cleanLineBrakes.replace(/.{70}/g, '$&\n' + tab);
                return indentedBlock;
            }
        }


        async function TryToFindURL(desiredUID)
        {
            const info = await kauderk.rap.getBlockInfoByUID(desiredUID);
            const rawText = info[0][0]?.string || "F";

            // {{[[component]]: xxxyoutube-urlxxx }}
            const components = [...rawText.matchAll(/{{(\[\[)?((yt-gif|video))(\]\])?.*?(\}\}|\{\{)/gm)].map(x => x = x[0]) || [];
            // (((xxxuidxxx))) || ((xxxuidxxx))
            const innerUIDs = rawText.match(/(?<=\(\()([^(].*?[^)])(?=\)\))/gm) || [];
            // [xxxanything goesxxx](((xxxuidxxx)))
            const aliasesPlusUids = [...rawText.matchAll(/\[(.*?(?=\]))]\(\(\((.*?(?=\)))\)\)\)/gm)];

            // aliases alone
            const innerAliasesUids = [...aliasesPlusUids].map(x => x = x[2]) || []; // [xxnopexxx]('((xxxyesxxx))')

            // block references alone
            const blockReferencesAlone = innerUIDs?.filter(x => !innerAliasesUids.includes(x));

            // componets with block references exlude aliases // set in the order in which roam renders them
            const urlsWithUids = [...[...rawText.matchAll(/{{(\[\[)?((yt-gif|video))(\]\])?.*?(\}\}|\{\{)|(?<=\(\()([^(].*?[^)])(?=\)\))/gm)]
                .map(x => x = x[0])]
                .map(x => components.includes(x) ? x = x.match(/(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(.*?(?=\s|\}|\]|\)))/)?.[0] : x);


            let urls = [];
            for (const i of components)
            {
                // xxxyoutube-urlxxx
                urls = kauderk.util.pushSame(urls, i.match(/(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(.*?(?=\s|\}|\]|\)))/)?.[0]);
            }

            return { uid: desiredUID, components, urls, innerUIDs, urlsWithUids, aliasesPlusUids, innerAliasesUids, blockReferencesAlone, rawText, info };
        };
    }
    // 3.1 extract params
    function urlConfig(url)
    {
        let success = false;
        const media = JSON.parse(JSON.stringify(videoParams));
        if (url.match('https://(www.)?youtube|youtu\.be'))
        {
            media.id = YouTubeGetID(url);

            media.start = ExtractFromURL('int', /(t=|start=)(?:\d+)/g);
            media.end = ExtractFromURL('int', /(end=)(?:\d+)/g);

            media.speed = ExtractFromURL('float', /(s=|speed=)([-+]?\d*\.\d+|\d+)/g);

            media.volume = ExtractFromURL('int', /(vl=|volume=)(?:\d+)/g);

            media.hl = new RegExp(/(hl=)((?:\w+))/, 'gm').exec(url)?.[2];
            media.cc = new RegExp(/(cc=|cc_lang_pref=)((?:\w+))/, 'gm').exec(url)?.[2];

            media.src = url;
            media.type = 'youtube';

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
            function YouTubeGetID(url)
            {//https://stackoverflow.com/questions/28735459/how-to-validate-youtube-url-in-client-side-in-text-box#:~:text=function%20matchYoutubeUrl(url)%20%7B
                url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
                return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
            }
            //#endregion
        }

        if (success) { return media; }
        else { alert('No valid media id detected'); }
        return false;
    }

    // 5.0
    async function DeployYT_IFRAME_OnInteraction()
    {
        const mainAnimation = setUpWrapperAwaitingAnimation();
        wrapper.addEventListener('mouseenter', CreateYTPlayer);
        return wrapper;
        function CreateYTPlayer(e)
        {
            UTILS.toggleClasses(false, mainAnimation, wrapper);
            UTILS.removeIMGbg(wrapper);
            wrapper.removeEventListener('mouseenter', CreateYTPlayer);
            return DeployYT_IFRAME();
        }
        function setUpWrapperAwaitingAnimation()
        {
            const { awiting_player_pulse_anim, awaitng_player_user_input, awaitng_input_with_thumbnail } = cssData;
            const awaitingAnimation = [awiting_player_pulse_anim, awaitng_player_user_input];
            const awaitingAnimationThumbnail = [...awaitingAnimation, awaitng_input_with_thumbnail];

            let mainAnimation = awaitingAnimationThumbnail;
            //wrapper.setAttribute(attrInfo.videoUrl, url);

            if (UI.experience.awaiting_with_video_thumnail_as_bg.checked)
            {
                UTILS.applyIMGbg(wrapper, url);
            }
            else
            {
                mainAnimation = awaitingAnimation;
            }

            UTILS.toggleClasses(true, mainAnimation, wrapper);
            return mainAnimation;
        }
    }


    // last - customize the iframe - api
    function playerConfig(configParams)
    {
        // in progress
        const { player_interface_language, player_captions_language, player_captions_on_load } = Object.fromEntries(window.YT_GIF_DIRECT_SETTINGS); // https://stackoverflow.com/questions/49569682/destructuring-a-map#:~:text=let%20%7B%20b%2C%20d%20%7D%20%3D%20Object.fromEntries(m)

        const playerVars = {
            autoplay: 1, 		// Auto-play the video on load
            controls: 1, 		// Show pause/play buttons in player
            mute: 1,
            start: configParams?.start,
            end: configParams?.end,

            hl: configParams?.hl || player_interface_language.sessionValue,           // Display interface language   // https://developers.google.com/youtube/player_parameters#:~:text=Sets%20the%20player%27s%20interface%20language.%20The%20parameter%20value%20is%20an%20ISO%20639-1%20two-letter%20language%20code%20or%20a%20fully%20specified%20locale.%20For%20example%2C%20fr%20and%20fr-ca%20are%20both%20valid%20values.%20Other%20language%20input%20codes%2C%20such%20as%20IETF%20language%20tags%20(BCP%2047)%20might%20also%20be%20handled%20properly.
            cc_lang_pref: configParams?.cc || player_captions_language.sessionValue, 	// Display closed captions      // https://developers.google.com/youtube/player_parameters#:~:text=This%20parameter%20specifies%20the%20default%20language%20that%20the%20player%20will%20use%20to%20display%20captions.%20Set%20the%20parameter%27s%20value%20to%20an%20ISO%20639-1%20two-letter%20language%20code.

            cc_load_policy: (UTILS.isTrue(player_captions_on_load.sessionValue)) ? 1 : 3,  // Hide closed captions - broken feature by design
            iv_load_policy: 3,  // Hide the Video Annotations

            vq: 'hd1080',

            autohide: 1, 		// Hide video controls when playing
            showinfo: 0, 		// Hide the video title
            modestbranding: 1,  // Hide the Youtube Logo

            fs: 1,              // Hide the full screen button
            rel: 0,

            version: 3,
            feature: 'oembed',
            enablejsapi: 1,
            origin: 'https://roamresearch.com',
        };

        return params = {
            height: '100%',
            width: '100%',
            videoId: configParams?.id,
            playerVars: playerVars,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onStateChange
            }
        };
    }
    function DeployYT_IFRAME()
    {
        return new window.YT.Player(newId, playerConfig(configParams));
    }
}