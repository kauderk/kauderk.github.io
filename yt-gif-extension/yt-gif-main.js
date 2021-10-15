// version 29 - semi-refactored
// Load the IFrame Player API.
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/player_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);




/*-----------------------------------*/
/* USER SETTINGS  */
const UI = window.YTGIF;
/* user doesn't need to see this */
UI.label = {
    rangeValue: '',
    loop_volume_displayed: '',
}
UI.deploymentStyle = {
    //menu
    suspend_yt_gif_deployment: '',

    // radio hidden submenu
    deployment_style_yt_gif: '1',
    deployment_style_video: '',
    deployment_style_both: '',

    // hidden submenu
    deploy_yt_gifs: '',
}
/*-----------------------------------*/
const iframeIDprfx = 'player_';
let creationCounter = -1;
let currentFullscreenPlayer = '';
let MasterMutationObservers = [];
let MasterIntersectionObservers = [];
/*-----------------------------------*/
const allVideoParameters = new Map();
const lastBlockIDParameters = new Map();
const videoParams = {
    src: 'https://www.youtube.com/embed/---------?',
    id: '---------',
    start: 0,
    end: 0,
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
function URLFolderCSS(f)
{
    return URLFolder(`css/${f}`)
};
function URLFolderHTML(f)
{
    return URLFolder(`html/${f}`)
};
function URLFolderJS(f)
{
    return URLFolder(`js/${f}`)
};
const links = {
    css: {
        dropDownMenu: URLFolderCSS('drop-down-menu.css'),
        player: URLFolderCSS('player.css'),
        themes: {
            dark_dropDownMenu: URLFolderCSS('themes/dark-drop-down-menu.css'),
            light_dropDownMenu: URLFolderCSS('themes/light-drop-down-menu.css'),
        }
    },
    html: {
        dropDownMenu: URLFolderHTML('drop-down-menu.html'),
        playerControls: URLFolderHTML('player-controls.html'),
        fetched: {
            playerControls: '',
        },
    },
    js: {
        main: URLFolder('yt-gif-main.js')
    }
}
const cssData = {
    yt_gif: 'yt-gif',
    yt_gif_wrapper: 'yt-gif-wrapper',
    yt_gif_iframe_wrapper: 'yt-gif-iframe-wrapper',
    yt_gif_timestamp: 'yt-gif-timestamp',
    yt_gif_audio: 'yt-gif-audio',
    yt_gif_custom_player_span_first_usage: 'ty-gif-custom-player-span-first-usage',


    awiting_player_pulse_anim: 'yt-gif-awaiting-palyer--pulse-animation',
    awaitng_player_user_input: 'yt-gif-awaiting-for-user-input',
    awaitng_input_with_thumbnail: 'yt-gif-awaiting-for-user-input-with-thumbnail',


    dwn_no_input: 'dropdown_not-allowed_input',
    dropdown_fadeIt_bg_animation: 'dropdown_fadeIt-bg_animation',
    dropdown_forbidden_input: 'dropdown_forbidden-input',
    dropdown_allright_input: 'dropdown_allright-input',

    dropdown__hidden: 'dropdown--hidden',
    dropdown_deployment_style: 'dropdown_deployment-style',
    dwp_message: 'dropdown-info-message',

    dwn_pulse_anim: 'drodown_item-pulse-animation',
}
const attrData = {
    initialize_bg: 'initialize-bg',
    initialize_loop: 'initialize-loop',
}
const attrInfo = {
    videoUrl: 'data-video-url',
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
const rm_components_base = {
    video: {
        description: '{{[[video]]}}',
        classToObserve: 'rm-video-player__spacing-wrapper'
    },
    yt_gif: {
        description: '{{[[yt-gif]]}}',
        classToObserve: `rm-xparser-default-${cssData.yt_gif}`
    },
    current: {
        key: ''
    },
}
const rm_components = rm_components_base;
rm_components.both = {
    description: `${rm_components.video} and ${rm_components.yt_gif}`,
    classesToObserve: [rm_components.video.classToObserve, rm_components.yt_gif.classToObserve]
}
/*-----------------------------------*/




// wait for APIs to exist
const almostReady = setInterval(() =>
{
    if ((typeof (YT) == 'undefined'))
    {
        return;
    }
    clearInterval(almostReady);
    Ready(); // load dropdown menu and deploy iframes

}, 500);

async function Ready()
{
    // the objects "UI", "links" and "cssData" are binded to all of these functions
    // 1.
    await LoadCSS(links.css.dropDownMenu);
    await LoadCSS(links.css.player);

    await CssThemes_UCS(); // UCS - user customizations
    await CssPlayer_UCS();

    links.html.fetched.playerControls = await PlayerHtml_UCS();

    await Load_DDM_onTopbar(); // DDM - drop down menu


    // 2.
    DDM_to_UI_variables();

    //Flip DDM item Visibility Based On Linked Input Value
    DDM_FlipBindedDataAttr_RTM([`${cssData.dropdown__hidden}`]); // RTM runtime

    UpdateOnScroll_RTM('timestamp_display_scroll_offset', UI.label.rangeValue);
    UpdateOnScroll_RTM('end_loop_sound_volume', UI.label.loop_volume_displayed);


    // 3.
    rm_components.current.key = KeyToObserve_UCS();

    await MasterObserver_UCS_RTM(); // listening for changes

    TogglePlayerThumbnails_DDM_RTM();

    RunMasterObserverWithKey(rm_components.current.key);

    console.log('YT GIF extension activated');

    //#region hidden functions
    async function CssThemes_UCS()
    {
        if (UI.default.css_theme === 'dark')
        {
            await LoadCSS(links.css.themes.dark_dropDownMenu);
        }
        else // light
        {
            await LoadCSS(links.css.themes.light_dropDownMenu);
        }
    }

    function CssPlayer_UCS()
    {
        if (isValidCSSUnit(UI.default.player_span))
        {
            const css_rule = `.${cssData.yt_gif_wrapper}, .${cssData.yt_gif_iframe_wrapper} {
                width: ${UI.default.player_span};
            }`;

            const id = `${cssData.ty_gif_custom_player_span}-${UI.default.player_span}`

            create_css_rule(css_rule, id);

            //#region util
            function create_css_rule(css_rules = 'starndard css rules', id = `${cssData.yt_gif}-custom`)
            {
                const style = document.createElement('style'); // could be it's own function
                style.id = id;
                style.setAttribute('type', 'text/css');
                style.innerHTML = css_rules;
                document.getElementsByTagName('head')[0].appendChild(style);
            }
            //#endregion
        }
    }

    async function PlayerHtml_UCS()
    {
        let htmlText = await FetchText(links.html.playerControls);
        if (UI.default.end_loop_sound_src != '')
        {
            htmlText = htmlText.replace(/(?<=<source src=\")(?=")/gm, UI.default.end_loop_sound_src);
        }
        return htmlText
    }

    async function Load_DDM_onTopbar()
    {
        const rm_moreIcon = document.querySelector('.bp3-icon-more').closest('.rm-topbar .rm-topbar__spacer-sm + .bp3-popover-wrapper');
        const htmlText = await FetchText(links.html.dropDownMenu);
        rm_moreIcon.insertAdjacentHTML('afterend', htmlText);
    }


    function DDM_to_UI_variables()
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
                    case 'deploymentStyle':
                    case 'experience':
                    case 'inactiveStyle':
                    case 'fullscreenStyle':
                    case 'muteStyle':
                    case 'playStyle':
                        const binaryInput = UI[parentKey][childKey];
                        binaryInput.checked = isTrue(userValue);
                        linkClickPreviousElement(binaryInput);
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

    function KeyToObserve_UCS()
    {
        let currentKey; // this can be shorter for sure, how though?
        if (isTrue(UI.default.override_roam_video_component)) //video
        {
            currentKey = 'video';
        }
        else if (UI.default.override_roam_video_component === 'both') // both
        {
            currentKey = 'both';
        }
        else // yt-gif
        {
            currentKey = 'yt_gif';
        }
        return currentKey;
    }

    //
    function RunMasterObserverWithKey(key)
    {
        const options = {
            video: () => video_MasterObserver(),
            yt_gif: () => yt_gif_MasterObserver(),
            both: () => both_MasterObserver(),
        }
        rm_components.current.key = key;

        options[key]();
        //#region local utils
        function both_MasterObserver()
        {
            for (const classValue of rm_components.both.classesToObserve)
            {
                MasterMutationObservers.push(ObserveIframesAndDelployYTPlayers(classValue));
            }
        }

        function video_MasterObserver()
        {
            MasterMutationObservers.push(ObserveIframesAndDelployYTPlayers(rm_components.video.classToObserve));
        }

        function yt_gif_MasterObserver()
        {
            MasterMutationObservers.push(ObserveIframesAndDelployYTPlayers(rm_components.yt_gif.classToObserve));
        }
        //#endregion
    }
    //

    function DDM_FlipBindedDataAttr_RTM(hiddenClass = [])
    {
        for (const key in attrData)
        {
            const value = attrData[key];
            const main = document.querySelector(data_MAIN_with(value));
            const all = [...document.querySelectorAll(data_bind_with(value, '*'))];
            const valid = all.filter(el => el != main);

            toggleValidItemClasses();
            main.addEventListener('change', toggleValidItemClasses);

            //#region local utils
            function toggleValidItemClasses()
            {
                for (const i of valid)
                {
                    toggleClasses(!main.checked, hiddenClass, i);
                }
            }
            //#endregion
        }

        //#region local utils
        function data_MAIN_with(value, selector = '')
        {
            return `[data-main${selector}='${value}']`;
        }
        function data_bind_with(value, selector = '')
        {
            return `[data-bind${selector}='${value}']`;
        }

        //#endregion
    }

    function TogglePlayerThumbnails_DDM_RTM()
    {
        const withThumbnails = UI.experience.awaiting_with_video_thumnail_as_bg;
        withThumbnails.addEventListener('change', handleIMGbgSwap);
        function handleIMGbgSwap(e)
        {
            const awaitingGifs = [...document.querySelectorAll(`.${cssData.awaitng_input_with_thumbnail}`)];
            for (const i of awaitingGifs)
            {
                if (withThumbnails.checked)
                {
                    applyIMGbg(i, i.dataset.videoUrl);
                }
                else
                {
                    removeIMGbg(i); // spaguetti
                }
            }
        }
    }

    async function MasterObserver_UCS_RTM()
    {
        const checkMenu = UI.deploymentStyle.suspend_yt_gif_deployment;

        const checkMenuParent = checkMenu.parentElement;
        const labelCheckMenu = checkMenu.previousElementSibling;
        //#region labelCheckMenu utils
        function islabel(str) { return labelCheckMenu.innerHTML == str; }
        function labelTxt(str) { return labelCheckMenu.innerHTML = str; }
        //#endregion

        const subHiddenDDM = document.querySelector(`.${cssData.dropdown__hidden}.${cssData.dropdown_deployment_style}`);
        const subHiddenDDM_message = subHiddenDDM.querySelector(`.${cssData.dwp_message}`);

        const subMenuCheck = UI.deploymentStyle.deploy_yt_gifs;
        const subMenuCheckParent = subMenuCheck.parentElement;

        //#region checkboxes utils
        const DeployCheckboxes = [checkMenu, subMenuCheck];
        function DeployCheckboxesDisabled(b) { DeployCheckboxes.forEach(check => check.disabled = b) }
        function DeployCheckboxesChecked(b) { DeployCheckboxes.forEach(check => check.checked = b) }
        //#endregion


        //animations css classes
        const noInputAnimation = [cssData.dwn_no_input]
        const baseAnimation = [cssData.dropdown_fadeIt_bg_animation, cssData.dwn_no_input];
        const redAnimationNoInputs = [...baseAnimation, cssData.dropdown_forbidden_input];
        const greeAnimationInputReady = [...baseAnimation, cssData.dropdown_allright_input];




        const deployInfo = {
            suspend: `Suspend Observers`,
            deploy: `Deploy Observers`,
            discharging: `** Disconecting Observers **`,
            loading: `** Setting up Observers **`,
        }



        labelCheckMenu.innerHTML = deployInfo.suspend;

        checkMenu.addEventListener('change', handleAnimationsInputRestriction);
        subMenuCheck.addEventListener('change', handleSubmitOptional_rm_comp);


        //#region event handelers
        async function handleAnimationsInputRestriction(e)
        {
            if (checkMenu.checked)
            {
                if (islabel(deployInfo.suspend))
                {
                    await redAnimationCombo(); //after the 10 seconds allow inputs again
                }
                else if (islabel(deployInfo.deploy))
                {
                    await greenAnimationCombo();
                }
            }
            //#region local util
            async function redAnimationCombo()
            {
                labelTxt(deployInfo.discharging);
                isVisualFeedbackPlaying(false)
                CleanMasterObservers();
                await restricInputsfor10SecMeanWhile(redAnimationNoInputs); //showing the red animation, because you are choosing to suspend
                labelTxt(deployInfo.deploy);

                //#region local utils
                function CleanMasterObservers()
                {
                    let mutCnt = 0, inscCnt = 0;
                    for (let i = MasterMutationObservers.length - 1; i >= 0; i--)
                    {
                        MasterMutationObservers[i].disconnect();
                        MasterMutationObservers.splice(i, 1);
                        mutCnt++; // i don't understand why this ins't counting
                    }
                    for (let i = MasterIntersectionObservers.length - 1; i >= 0; i--)
                    {
                        MasterIntersectionObservers[i].disconnect();
                        MasterIntersectionObservers.splice(i, 1);
                        inscCnt++;
                    }

                    console.log(`${mutCnt} mutation and ${inscCnt} intersection master observers cleaned`);
                }
                //#endregion
            }
            //#endregion
        }


        async function handleSubmitOptional_rm_comp(e)
        {
            if (subMenuCheck.checked && (islabel(deployInfo.deploy)))
            {
                await greenAnimationCombo();
            }
        }


        //#region utils
        function ChargeMasterObservers()
        {
            const deploymentRadioStates = {
                video: () => UI.deploymentStyle.deployment_style_video.checked,
                yt_gif: () => UI.deploymentStyle.deployment_style_yt_gif.checked,
                both: () => UI.deploymentStyle.deployment_style_both.checked,
            }

            for (const key in deploymentRadioStates)
            {
                if (isTrue(deploymentRadioStates[key]())) // THIS IS CRAZY
                {
                    RunMasterObserverWithKey(key)
                    return;
                }
            }
        }
        async function greenAnimationCombo()
        {
            ChargeMasterObservers();
            labelTxt(deployInfo.loading); //change label to suspend
            isVisualFeedbackPlaying(true)
            await restricInputsfor10SecMeanWhile(greeAnimationInputReady);
            labelTxt(deployInfo.suspend);
        }
        function isVisualFeedbackPlaying(bol)
        {
            isSubMenuHidden(bol);
            isSubDDMpulsing(!bol);
            //#region local utils
            function isSubMenuHidden(bol)
            {
                const hiddenClass = [`${cssData.dropdown__hidden}`]
                toggleClasses(bol, hiddenClass, subHiddenDDM);
            }
            function isSubDDMpulsing(bol)
            {
                const pulseAnim = [cssData.dwn_pulse_anim]; // spagguetti
                toggleClasses(bol, pulseAnim, subHiddenDDM_message); // spagguetti
            }
            //#endregion
        }
        function restricInputsfor10SecMeanWhile(animation, duration = 10000)
        {
            return new Promise(function (resolve, reject)
            {
                DeployCheckboxesDisabled(true);
                DeployCheckboxesChecked(false);
                DeployCheckboxesToggleAnims(true, animation);

                setTimeout(() =>
                {
                    DeployCheckboxesDisabled(false);
                    DeployCheckboxesChecked(false);
                    DeployCheckboxesToggleAnims(false, animation);
                    resolve();

                }, duration);
            });
        }

        function DeployCheckboxesToggleAnims(bol, animation)
        {
            toggleClasses(bol, animation, checkMenuParent);
            toggleClasses(bol, noInputAnimation, subMenuCheckParent);
        }
        //#endregion


        //#endregion
    }

    //#endregion


    //#region uitils
    async function LoadCSS(cssURL) // 'cssURL' is the stylesheet's URL, i.e. /css/styles.css
    {
        if (await !isValidFetch(cssURL)) return;

        return new Promise(function (resolve, reject)
        {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = NoCash(cssURL);
            document.head.appendChild(link);

            link.onload = () => resolve();
        });
    }

    function UpdateOnScroll_RTM(key, labelEl)
    {
        function UpdateLabel()
        {
            labelEl.innerHTML = UI.range[key].value;
        }

        UI.range[key].addEventListener('change', () => UpdateLabel());
        UI.range[key].addEventListener('wheel', (e) =>
        {
            const dir = Math.sign(e.deltaY) * -1;
            const parsed = parseInt(UI.range[key].value, 10);
            UI.range[key].value = Number(dir + parsed);

            UpdateLabel();
        });

        UpdateLabel();
    }

    //#endregion
}

function ObserveIframesAndDelployYTPlayers(targetClass)
{
    // 1. set up all visible YT GIFs
    const visible = inViewport(AvoidAllZoomChilds());
    for (const component of visible)
    {
        onYouTubePlayerAPIReady(component, 'first wave');
    }

    // 2. IntersectionObserver attache, to deploy when visible
    const hidden = AvoidAllZoomChilds();
    for (const component of hidden)
    {
        // I'm quite impressed with this... I mean...
        MasterIntersectionObservers.push(ObserveIntersectToSetUpPlayer(component, 'second wave'));
    }

    // 3. ready to observe and deploy iframes
    const targetNode = document.querySelector('body');
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(mutation_callback);
    observer.observe(targetNode, config);

    return observer

    //#region observer utils
    function ObserveIntersectToSetUpPlayer(iterator, message = 'YscrollObserver')
    {
        const yobs = new IntersectionObserver(Intersection_callback, { threshold: [0] });

        function Intersection_callback(entries)
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
    // ObserveIntersectToSetUpPlaye when cssClass is added to the DOM
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
            if (isNotZoomPath(node))
            {
                MasterIntersectionObservers.push(ObserveIntersectToSetUpPlayer(node, 'valid entries MutationObserver'));
            }
        }
    };
    //#endregion

    //#region local utils
    function AvoidAllZoomChilds()
    {
        const components = Array.from(document.querySelectorAll('.' + targetClass));
        //valids
        return components.filter(el => isNotZoomPath(el));
    }
    function isNotZoomPath(el)
    {
        return !el.closest("[class*='rm-zoom']");
    }
    //#endregion
}







/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
//
async function onYouTubePlayerAPIReady(wrapper, message = 'I dunno')
{
    if (!wrapper) return;

    // 1. last 9 letter form the closest blockID
    const uid = wrapper.closest('span[data-uid]')?.getAttribute('data-uid') ||
        closestBlockID(wrapper)?.slice(-9) ||
        closestBlockID(document.querySelector('.bp3-popover-open'))?.slice(-9);

    if (!uid) return; // don't add up false positives
    const newId = iframeIDprfx + Number(++creationCounter);



    // 2. the div that the YTiframe will replace
    if (wrapper.tagName != 'DIV')
    {
        wrapper = ChangeElementType(wrapper, 'div');
    }
    wrapper.parentElement.classList.add(`${cssData.yt_gif_wrapper}-parent`);
    wrapper.className = `${cssData.yt_gif_wrapper} dont-focus-block`;
    wrapper.innerHTML = '';
    let htmlText = links.html.fetched.playerControls;
    htmlText = htmlText.replace(/(?<=<audio id=\").*(?=")/gm, `${cssData.yt_gif_audio}-${uid}`);
    wrapper.insertAdjacentHTML('afterbegin', htmlText);
    wrapper.querySelector('.yt-gif-player').id = newId;



    // 3. weird recursive function... guys...
    const url = await InputBlockVideoParams(uid);
    allVideoParameters.set(newId, urlConfig(url));



    // 4. to record a target's point of reference
    const record = Object.create(sesionIDs);
    sesionIDs.uid = uid;
    const blockID = closestBlockID(wrapper);
    if (blockID != null)
        recordedIDs.set(blockID, record);



    //console.count(message);
    if (UI.experience.awaiting_for_mouseenter_to_initialize.checked)
    {
        const awaitingAnimation = [cssData.awiting_player_pulse_anim, cssData.awaitng_player_user_input];
        const awaitingAnimationThumbnail = [...awaitingAnimation, cssData.awaitng_input_with_thumbnail];

        let mainAnimation = awaitingAnimationThumbnail
        wrapper.setAttribute(attrInfo.videoUrl, url);

        if (UI.experience.awaiting_with_video_thumnail_as_bg.checked)
        {
            applyIMGbg(wrapper, url);
        }
        else
        {
            mainAnimation = awaitingAnimation;
        }

        toggleClasses(true, mainAnimation, wrapper);
        wrapper.addEventListener('mouseenter', CreateYTPlayer);

        //#region handler
        function CreateYTPlayer(e)
        {
            toggleClasses(false, mainAnimation, wrapper);
            removeIMGbg(wrapper);
            wrapper.removeEventListener('mouseenter', CreateYTPlayer);

            // 5. ACTUAL CREATION OF THE EMBEDED YOUTUBE VIDEO PLAYER (target)
            return new window.YT.Player(newId, playerConfig());
        }
        //#endregion handler
    }
    else
    {
        // 5. ACTUAL CREATION OF THE EMBEDED YOUTUBE VIDEO PLAYER (target)
        return new window.YT.Player(newId, playerConfig());
    }
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
            // const info42 = await window.roam42.common.getBlockInfoByUID(desiredUID);
            const info = await window.roamAlphaAPI.q(`[:find (pull ?b [:block/string]):where [?b :block/uid "${desiredUID}"]]`);
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
            media.id = YouTubeGetID(url);

            media.start = ExtractFromURL('int', /(t=|start=)(?:\d+)/g);
            media.end = ExtractFromURL('int', /(end=)(?:\d+)/g);

            media.speed = ExtractFromURL('float', /(s=|speed=)([-+]?\d*\.\d+|\d+)/g);

            media.volume = ExtractFromURL('int', /(vl=|volume=)(?:\d+)/g);

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
    const volume = validVolume();
    const tickOffset = 1000 / speed;
    //
    const blockID = closestBlockID(iframe);
    const rocording = recordedIDs.get(blockID);
    // 🚧?
    if (rocording != null)
        rocording.target = t;

    //autostop 🚧
    const loadingMarginOfError = 1; //seconds
    let updateStartTime = start;

    // javascript is crazy
    t.__proto__.timers = [];
    t.__proto__.timerID;
    t.__proto__.ClearTimers = ClearTimers;
    t.__proto__.enter = ContinuouslyUpdateTimeDisplay;
    t.__proto__.globalHumanInteraction = undefined;
    t.__proto__.timeDisplayHumanInteraction = false;


    iframe.removeAttribute('title');
    t.setVolume(volume);
    t.setPlaybackRate(speed);


    const timeDisplay = parent.querySelector('div.' + cssData.yt_gif_timestamp);

    //#region Loading values 🌿
    // load last sesion values
    if (lastBlockIDParameters.has(blockID))
    {
        const sesion = lastBlockIDParameters.get(blockID);

        if (UI.permutations.start_form_previous_timestamp?.checked && bounded(sesion.updateTime))
            seekToUpdatedTime(sesion.updateTime);

        t.setVolume(sesion.volume);
    }
    // load referenced values
    else
    {
        //Future Brand new adition to 'lastBlockIDParameters' map
        if (UI.permutations.referenced_start_timestamp.checked)
        {
            const ytGifs = allIframeIDprfx();
            for (const i of ytGifs)
            {
                if (i === iframe) continue; //ignore itself

                if (i?.src?.slice(0, -11) == iframe?.src?.slice(0, -11))
                { //removes at least 'widgetid=··' so they reconize each other

                    const desiredBlockID = blockID || document.querySelector('body > span[blockID]')?.getAttribute('blockID') || closestBlockID(i);

                    const desiredTarget = recordedIDs.get(desiredBlockID)?.target || t;
                    const desiredTime = tick(desiredTarget) || start;
                    const desiredVolume = desiredTarget?.getVolume() || validVolume();

                    seekToUpdatedTime(desiredTime)

                    if ((typeof (desiredTarget.__proto__.globalHumanInteraction) != 'undefined'))
                    {
                        t.setVolume(desiredVolume);
                    }
                    const saveMessage = stringWithNoEmail(desiredBlockID);
                    console.count(`${key} referenced from ${saveMessage}`);
                    break;
                    //#region local util
                    function stringWithNoEmail(myString)
                    {
                        if (myString.search(/([^.@\s]+)(\.[^.@\s]+)*@([^.@\s]+\.)+([^.@\s]+)/) !== -1)
                        {
                            // There is an email! Remove it...
                            myString = myString.replace(/([^.@\s]+)(\.[^.@\s]+)*@([^.@\s]+\.)+([^.@\s]+)/, "");
                        }
                        return myString
                    }
                    //#endregion
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
            if (UI.playStyle.strict_play_current_on_mouse_over.checked)
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

            //ﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠ//the same as: if it's true, then the other posibilities are false
            if (anyValidInAndOutKey(e) && !UI.muteStyle.muted_on_any_mouse_interaction.checked)
            {
                videoIsPlayingWithSound();
            }
            else
            {
                //ﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠ// playing
                togglePlay(!AnyPlayOnHover() && (t.getPlayerState() === 1));

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
    }

    function muteStyleDDMO()
    {
        if (!inViewport(iframe)) return; //mute all VISIBLE Players, this will be called on all visible iframes

        if (UI.muteStyle.strict_mute_everything_except_current.checked || UI.muteStyle.muted_on_any_mouse_interaction.checked)
        {
            isSoundingFine(false);
        }
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

        let dir = tick() + (Math.sign(e.deltaY) * Math.round(UI.range.timestamp_display_scroll_offset.value) * -1);
        if (UI.permutations.clip_life_span_format.checked)
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

    //#region detect fullscreen mode
    iframe.addEventListener('fullscreenchange', () =>
    {
        currentFullscreenPlayer = t.h.id;

        if (!document.fullscreenElement && isParentHover()) //https://stackoverflow.com/questions/36767196/check-if-mouse-is-inside-div#:~:text=if%20(element.parentNode.matches(%22%3Ahover%22))%20%7B
        {
            if (UI.fullscreenStyle.mute_on_exit_fullscreenchange.checked)
            {
                isSoundingFine(false);
            }
            if (UI.fullscreenStyle.pause_on_exit_fullscreenchange.checked)
            {
                togglePlay(false);
            }
        }
    });
    //#endregion


    const withEventListeners = [parent, parent.parentNode, timeDisplay, iframe];

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

        if (tick() > updateStartTime + loadingMarginOfError && !t.__proto__.globalHumanInteraction) // and the interval function 'OneFrame' to prevent the loading black screen
        {
            if (UI.playStyle.visible_clips_start_to_play_unmuted.checked)
                togglePlay(entries[0]?.isIntersecting);
            else
                togglePlay(false);
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
    else if (isParentHover()) // human wants to hear and watch
    {
        videoIsPlayingWithSound(true);
    }
    else //Freeze
    {
        const OneFrame = setInterval(() =>
        {
            if (tick() > updateStartTime + loadingMarginOfError)
            {
                // or if mouse is inside parent
                if (t.__proto__.globalHumanInteraction) // usees is listening, don't interrupt
                {
                    videoIsPlayingWithSound(true);
                }
                else if (inViewport(iframe) && !t.__proto__.globalHumanInteraction)
                {
                    togglePlay(UI.playStyle.visible_clips_start_to_play_unmuted.checked); // pause
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
    function validVolume()
    {
        return map?.volume || videoParams.volume || 40;
    }


    function videoIsPlayingWithSound(boo = true)
    {
        isSoundingFine(boo);
        togglePlay(boo);
    }


    function togglePlay(bol, el = iframe)
    {
        if (bol)
        {
            PlayIs(ytGifAttr.play.playing, el);
            t.playVideo();
        }
        else
        {
            PlayIs(ytGifAttr.play.paused);
            t.pauseVideo();
        }
    }

    function isSoundingFine(boo = true, el = iframe)
    {
        if (boo)
        {
            SoundIs(ytGifAttr.sound.unMute, el);
            t.unMute();
        }
        else
        {
            SoundIs(ytGifAttr.sound.mute, el);
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
        return UI.playStyle.play_on_mouse_over.checked || UI.playStyle.strict_play_current_on_mouse_over.checked
    }

    function isParentHover()
    {
        return parent.matches(":hover");
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

// UI InactiveStyles .... man...
//visibilityChange




//
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
//loops between 'start' and 'end' boundaries
function onStateChange(state)
{
    const t = state.target;
    const map = allVideoParameters.get(t.h.id);

    if (state.data === YT.PlayerState.ENDED)
    {
        t.seekTo(map?.start || 0);

        if (isValidUrl(UI.default.end_loop_sound_src))
        {
            if (UI.experience.sound_when_video_loops.checked)
            {
                play(UI.default.end_loop_sound_src);
                //#region util
                function play(url)
                {
                    return new Promise(function (resolve, reject)
                    { // return a promise
                        var audio = new Audio();                     // create audio wo/ src
                        audio.preload = "auto";                      // intend to play through
                        audio.volume = mapRange(UI.range.end_loop_sound_volume.value, 0, 100, 0, 1.0);
                        audio.autoplay = true;                       // autoplay when loaded
                        audio.onerror = reject;                      // on error, reject
                        audio.onended = resolve;                     // when done, resolve

                        audio.src = url
                    });
                }
                //#endregion
            }
        }

        if (UI.fullscreenStyle.smoll_vid_when_big_ends.checked && (currentFullscreenPlayer === t.h.id)) // let's not talk about that this took at least 30 mins. Don't. Ughhhh
        {
            if (document.fullscreenElement)
            {
                exitFullscreen();
                currentFullscreenPlayer = '';
            }
        }
    }


    if (state.data === YT.PlayerState.PLAYING)
    {
        if (t.__proto__.timerID === null) // NON ContinuouslyUpdateTimeDisplay
        {
            t.__proto__.enter();
        }
    }


    if (state.data === YT.PlayerState.PAUSED)
    {
        t.__proto__.ClearTimers();
    }
}




//#region Utilies
function linkClickPreviousElement(el)
{
    el.previousElementSibling.setAttribute('for', el.id); // link clicks
}

function applyIMGbg(wrapper, url)
{
    wrapper.style.backgroundImage = `url(${get_youtube_thumbnail(url)})`;
}
function removeIMGbg(wrapper)
{
    wrapper.style.backgroundImage = 'none';
}


function NoCash(url)
{
    return url + "?" + new Date().getTime()
}


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
function toggleClasses(bol, classNames, el)
{
    if (bol)
    {
        el.classList.add(...classNames);
    }
    else
    {
        el.classList.remove(...classNames);
    }
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
function isValidUrl(value)
{
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}


async function FetchText(url)
{
    const [response, err] = await isValidFetch(NoCash(url)); // firt time fetching something... This is cool
    if (response)
        return await response.text();
}
async function isValidFetch(url)
{
    try
    {
        const response = await fetch(url, { cache: "no-store" });
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
function get_youtube_thumbnail(url, quality)
{
    //https://stackoverflow.com/questions/18681788/how-to-get-a-youtube-thumbnail-from-a-youtube-iframe
    if (url)
    {
        var video_id, thumbnail, result;
        if (result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/))
        {
            video_id = result.pop();
        }
        else if (result = url.match(/youtu.be\/(.{11})/))
        {
            video_id = result.pop();
        }

        if (video_id)
        {
            if (typeof quality == "undefined")
            {
                quality = 'high';
            }

            var quality_key = 'maxresdefault'; // Max quality
            if (quality == 'low')
            {
                quality_key = 'sddefault';
            } else if (quality == 'medium')
            {
                quality_key = 'mqdefault';
            } else if (quality == 'high')
            {
                quality_key = 'hqdefault';
            }

            var thumbnail = "https://img.youtube.com/vi/" + video_id + "/" + quality_key + ".jpg";
            return thumbnail;
        }
    }
    return false;
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

function ChangeElementType(element, newtype)
{
    let newelement = document.createElement(newtype);

    // move children
    while (element.firstChild) newelement.appendChild(element.firstChild);

    // copy attributes
    for (var i = 0, a = element.attributes, l = a.length; i < l; i++)
    {
        newelement.attributes[a[i].name] = a[i].value;
    }

    // event handlers on children will be kept. Unfortunately, there is
    // no easy way to transfer event handlers on the element itself,
    // this would require a full management system for events, which is
    // beyond the scope of this answer. If you figure it out, do it here.

    element.parentNode.replaceChild(newelement, element);
    return newelement;
}

function LoopTroughVisibleYTGIFsGlobal(config = { styleQuery: ytGifAttr, self: iframe, others_callback: () => { }, self_callback: () => { } })
{
    const ytGifs = inViewport(allIframeStyle(config?.styleQuery));
    for (const i of ytGifs)
    {
        const blockID = closestBlockID(i);
        if (i != self)
        {
            config?.others_callback(blockID, i);
        }
        else if (config.BlockID_self_callback)
        {
            config?.self_callback(blockID, i);
        }
    }
}

function targetIsSoundingFine(id, bol = true)
{
    return recordedIDs.get(id)?.target?.isSoundingFine(bol);
}
function targetNotTogglePlay(id, bol = false)
{
    return recordedIDs.get(id)?.target?.togglePlay(bol);
}

// linearly maps value from the range (a..b) to (c..d)
function mapRange(value, a, b, c, d)
{
    // first map value from (a..b) to (0..1)
    value = (value - a) / (b - a);
    // then map it from (0..1) to (c..d) and return it
    return c + value * (d - c);
}


//#endregion

//#region 0 refences
function handleMyMouseMove(e)
{
    //https://stackoverflow.com/questions/5730433/keep-mouse-inside-a-div
    e = e || window.event;
    var mouseX = e.clientX;
    var mouseY = e.clientY;
    if (mousepressed)
    {
        divChild.style.left = mouseX + "px";
        divChild.style.top = mouseY + "px";
    }
}
function element_mouse_is_inside(elementToBeChecked, mouseEvent, with_margin, offset_object)
{
    if (!with_margin)
    {
        with_margin = false;
    }
    if (typeof offset_object !== 'object')
    {
        offset_object = {};
    }
    var elm_offset = elementToBeChecked.offset();
    var element_width = elementToBeChecked.width();
    element_width += parseInt(elementToBeChecked.css("padding-left").replace("px", ""));
    element_width += parseInt(elementToBeChecked.css("padding-right").replace("px", ""));
    var element_height = elementToBeChecked.height();
    element_height += parseInt(elementToBeChecked.css("padding-top").replace("px", ""));
    element_height += parseInt(elementToBeChecked.css("padding-bottom").replace("px", ""));
    if (with_margin)
    {
        element_width += parseInt(elementToBeChecked.css("margin-left").replace("px", ""));
        element_width += parseInt(elementToBeChecked.css("margin-right").replace("px", ""));
        element_height += parseInt(elementToBeChecked.css("margin-top").replace("px", ""));
        element_height += parseInt(elementToBeChecked.css("margin-bottom").replace("px", ""));
    }

    elm_offset.rightBorder = elm_offset.left + element_width;
    elm_offset.bottomBorder = elm_offset.top + element_height;

    if (offset_object.hasOwnProperty("top"))
    {
        elm_offset.top += parseInt(offset_object.top);
    }
    if (offset_object.hasOwnProperty("left"))
    {
        elm_offset.left += parseInt(offset_object.left);
    }
    if (offset_object.hasOwnProperty("bottom"))
    {
        elm_offset.bottomBorder += parseInt(offset_object.bottom);
    }
    if (offset_object.hasOwnProperty("right"))
    {
        elm_offset.rightBorder += parseInt(offset_object.right);
    }
    var mouseX = mouseEvent.pageX;
    var mouseY = mouseEvent.pageY;

    if ((mouseX > elm_offset.left && mouseX < elm_offset.rightBorder)
        && (mouseY > elm_offset.top && mouseY < elm_offset.bottomBorder))
    {
        return true;
    }
    else
    {
        return false;
    }
}
function element_mouse_is_inside_mod(elementToBeChecked, mouseEvent, with_margin, offset_object)
{
    if (!with_margin)
    {
        with_margin = false;
    }
    if (typeof offset_object !== 'object')
    {
        offset_object = {};
    }
    debugger;
    const elm_offset = elementToBeChecked.offsetTop;

    let element_width = elementToBeChecked.offsetWidth;
    // element_width += parseInt(elementToBeChecked.style.paddingLeft.replace("px", ""));
    // element_width += parseInt(elementToBeChecked.style.paddingRight.replace("px", ""));

    debugger;
    let element_height = elementToBeChecked.offsetHeight;
    // element_height += parseInt(elementToBeChecked.style.paddingTop.replace("px", ""));
    // element_height += parseInt(elementToBeChecked.style.paddingBottom.replace("px", ""));


    if (with_margin)
    {
        element_width += parseInt(elementToBeChecked.marginLeft.replace("px", ""));
        element_width += parseInt(elementToBeChecked.marginRight.replace("px", ""));
        element_height += parseInt(elementToBeChecked.marginTop.replace("px", ""));
        element_height += parseInt(elementToBeChecked.marginBottom.replace("px", ""));
        debugger;
    }


    // elm_offset.rightBorder = elm_offset.offsetLeft + element_width;
    // elm_offset.bottomBorder = elm_offset.offsetTop + element_height;

    debugger;

    if (offset_object.hasOwnProperty("top"))
    {
        elm_offset.top += parseInt(offset_object.top);
    }
    if (offset_object.hasOwnProperty("left"))
    {
        elm_offset.left += parseInt(offset_object.left);
    }
    if (offset_object.hasOwnProperty("bottom"))
    {
        elm_offset.bottomBorder += parseInt(offset_object.bottom);
    }
    if (offset_object.hasOwnProperty("right"))
    {
        elm_offset.rightBorder += parseInt(offset_object.right);
    }
    debugger;

    mouseEvent = mouseEvent || window;
    const mouseX = mouseEvent?.pageX || mouseEvent?.clientX;
    const mouseY = mouseEvent?.pageY || mouseEvent?.clientY;
    debugger;


    if ((mouseX > elm_offset.left && mouseX < elm_offset.rightBorder)
        && (mouseY > elm_offset.top && mouseY < elm_offset.bottomBorder))
    {
        debugger;
        return true;
    }
    else
    {
        debugger;
        return false;
    }
}
function is_mouse_inside(el, e)
{
    const px = e.clientX;
    const x = el.width();
    const py = 0;
    const y = e.clientY;
    const horizontal = px > x && px < x
    if (px > x)
    {

    }
}
//#endregion




// I want to add ☐ ☑
// radios : mute pause when document is inactive ☑ ✘
// click the item checks the btn ☑ ☑

// use only one audio?? ☑ ☑ url so is customizable by nature
// loop sound adjusment with slider hidden inside sub menu | ohhhh bind main checkbox to hidde it's "for"
// deploy on mouse enter ☑ ☑
// scrolwheel is broke, fix ☑ ☑

// to apply volume on end loop audio ☑ ☑
// http vs https ☑ ☑
// coding train shifman mouse inside div, top, left ✘ ☑ ☑

// bind thumbnail input element hiddeness to initialize checkbox

// play a sound to indicate the current gif makes loop ☑ ☑
// https://freesound.org/people/candy299p/sounds/250091/          * film ejected *
// https://freesound.org/data/previews/250/250091_4586102-lq.mp3

// https://freesound.org/people/nckn/sounds/256113/               * param ram *
// https://freesound.org/data/previews/256/256113_3263906-lq.mp3

// https://freesound.org/data/previews/35/35631_18799-lq.mp3 - roam research podoro ding -


// Discarted
// shortcuts for any btn ✘
// all hoverable actions, after 500ms the item it's checked // and this feature own btn ofcourse ✘
// add yt_api customizable settings ✘


// Bugs to fix
// hover a frame > mouse leave with sound > focus on another window > go back to roam & and mouse enter a new frame, both videos play unmuted even with strict_mute_everything_except_current enabled ☐
// work around > mouse enter a new frame holding middle mouse > mutes the previous, but the previous video still plays unmuted even though play_on_mouse_over enebled ☐
