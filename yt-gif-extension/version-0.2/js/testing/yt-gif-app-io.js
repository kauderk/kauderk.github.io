// version 36 - semi-refactored
/**
 * @summary USER INPUTS
 * @type Object
 * @description WILL NOT CONTAIN NESTED OBJECTS, it will read 'strings' as guides then acustom to them, all inside the Ready() function.
 * It's property types will change.
 * - nested object >>> sesionValue
*/
const UI = JSON.parse(JSON.stringify(window.YT_GIF_SETTINGS_PAGE));
const UTILS = window.kauderk.util;
/*-----------------------------------*/
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
UI.referenced = {
    block_timestamp: '',
    block_volume: '',
}
/*-----------------------------------*/
const iframeIDprfx = 'player_';
let currentFullscreenPlayer = null;
/*-----------------------------------*/
const YT_GIF_OBSERVERS_TEMP = {
    masterMutationObservers: [],
    masterIntersectionObservers: [],
    creationCounter: -1, // crucial, bc the api won't reload iframes with the same id
    CleanMasterObservers: function ()
    {
        const mutObjRes = cleanObserverArr(this.masterMutationObservers);
        this.masterMutationObservers = mutObjRes.observer;

        const insObjRes = cleanObserverArr(this.masterIntersectionObservers);
        this.masterIntersectionObservers = insObjRes.observer;

        console.log(`${mutObjRes.counter} mutation and ${insObjRes.counter} intersection master observers cleaned`);

        function cleanObserverArr(observer)
        {
            let counter = 0;
            for (let i = observer.length - 1; i >= 0; i--)
            {
                observer[i].disconnect();
                observer.splice(i, 1);
                counter++;
            }
            return {
                observer,
                counter
            }
        }
    }
}
window.YT_GIF_OBSERVERS = (!window.YT_GIF_OBSERVERS) ? YT_GIF_OBSERVERS_TEMP : window.YT_GIF_OBSERVERS;
/*-----------------------------------*/
const allVideoParameters = new Map();
const lastBlockIDParameters = new Map();
const videoParams = {
    src: 'https://www.youtube.com/embed/---------?',
    id: '---------',

    start: 0,
    updateTime: 0,
    timeURLmapHistory: [],

    end: 0,

    speed: 1,

    volume: window.YT_GIF_SETTINGS_PAGE.defaultValues.video_volume.sessionValue,
    updateVolume: 30, // 'this' will be set afterwards
    volumeURLmapHistory: [],
};
videoParams.updateVolume = videoParams.volume;
//
const recordedIDs = new Map();
const sesionIDs = {
    target: null,
    uid: '---------'
}
/*-----------------------------------*/
function URLFolder(f)
{
    return `https://kauderk.github.io/code-snippets/yt-gif-extension/${f}`
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
        dropDownMenuStyle: URLFolderCSS('drop-down-menu.css'),
        playerStyle: URLFolderCSS('player.css'),
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
    },
    help: {
        github_isuues: `https://github.com/kauderk/kauderk.github.io/issues`,
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


    ddm_icon: 'ty-gif-icon',


    dwn_no_input: 'dropdown_not-allowed_input',
    dropdown_fadeIt_bg_animation: 'dropdown_fadeIt-bg_animation',
    dropdown_forbidden_input: 'dropdown_forbidden-input',
    dropdown_allright_input: 'dropdown_allright-input',

    dropdown__hidden: 'dropdown--hidden',
    dropdown_deployment_style: 'dropdown_deployment-style',
    dwp_message: 'dropdown-info-message',
    ddm_info_message_selector: `.dropdown .dropdown-info-message`,

    dwn_pulse_anim: 'drodown_item-pulse-animation',

    ddm_exist: 'yt-gif-drop-down-menu-toolbar',

    ddm_focus: 'dropdown-focus',
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


if (
    typeof (UTILS) !== 'undefined' &&
    typeof (YT) != 'undefined'
)
{
    Ready(); // LET'S GO! LET'S GO!
}
else
{
    console.log(`The YT GIF Extension won't be installed, major scripts are missing... submit you issue here: ${links.help.github_isuues}`);
}

async function Ready()
{
    // the objects "UI", "links", "attrData" and "cssData" are binded to all of these functions
    if (DDM_Els().length > 0)
    {
        try
        {
            window.YT_GIF_OBSERVERS.CleanMasterObservers(); // I was planing on using "code snippets" but the observer api doesn't work there... man...
        } catch (err)
        {
            console.log('The Masters observers are not defined.');
        }
        console.log('Reinstalling the YT GIF Extension');
    }



    // 1. set up looks
    //#region relevant variables
    const { css_theme, player_span, end_loop_sound_src } = window.YT_GIF_SETTINGS_PAGE.defaultValues;
    const { themes, playerStyle, dropDownMenuStyle } = links.css;
    const { playerControls, dropDownMenu } = links.html;
    const { yt_gif } = cssData; // CssThemes_UCS
    //#endregion

    await smart_LoadCSS(dropDownMenuStyle, `${yt_gif}-dropDownMenuStyle`);
    await smart_LoadCSS(playerStyle, `${yt_gif}-playerStyle`);

    await smart_CssThemes_UCS(css_theme.baseValue, themes, yt_gif); // UCS - user customizations
    await smart_CssPlayer_UCS(player_span.baseValue, cssData);

    links.html.fetched.playerControls = await PlayerHtml_UCS(playerControls, end_loop_sound_src.baseValue);

    await smart_Load_DDM_onTopbar(dropDownMenu); // DDM - drop down menu



    // 2. assign direct values to the main object
    DDM_to_UI_variables_AND_listen_for_update_Block_Settings();



    // 3. set up events pre observers
    //#region relevant variables
    const { ddm_icon, ddm_focus, ddm_info_message_selector, dropdown__hidden } = cssData;
    const { timestamp_display_scroll_offset, end_loop_sound_volume } = UI.range;
    const { rangeValue, loop_volume_displayed } = UI.label;
    //#endregion

    DDM_IconFocusBlurEvents(ddm_icon, ddm_focus, ddm_info_message_selector);

    DDM_FlipBindedDataAttr_RTM([dropdown__hidden], attrData); // RTM runtime

    UpdateOnScroll_RTM(timestamp_display_scroll_offset, rangeValue);
    UpdateOnScroll_RTM(end_loop_sound_volume, loop_volume_displayed);



    // 4. run extension and events after set up
    //#region relevant variables
    const { override_roam_video_component } = UI.defaultValues;
    const { awaiting_with_video_thumnail_as_bg } = UI.experience;
    const { awaitng_input_with_thumbnail } = cssData;
    let { key } = rm_components.current;
    //#endregion

    key = KeyToObserve_UCS(override_roam_video_component);

    await MasterObserver_UCS_RTM(); // listening for changes // BIG BOI FUNCTION

    TogglePlayerThumbnails_DDM_RTM(awaiting_with_video_thumnail_as_bg, awaitng_input_with_thumbnail);

    RunMasterObserverWithKey(key);

    console.log('YT GIF extension activated');


    //#region 1. hidden functions
    async function smart_LoadCSS(cssURL, id) // 'cssURL' is the stylesheet's URL, i.e. /css/styles.css
    {
        if (!(await UTILS.isValidFetch(cssURL))) 
        {
            return;
        }

        return new Promise(function (resolve, reject)
        {
            const stylesAlready = document.querySelectorAll(`[id='${id}']`);
            if (stylesAlready?.length > 0) // well well well - we don't like duplicates
            {
                SytleSheetExistAlready(cssURL);
                for (const el of stylesAlready)
                {
                    el.parentElement.removeChild(el);
                }
            }
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = UTILS.NoCash(cssURL);
            link.id = id;
            document.head.appendChild(link);

            link.onload = () => resolve();
        });
    }
    async function smart_CssThemes_UCS(currentTheme, CSSThemes, prefixID)
    {
        const themToLoad = (currentTheme === 'dark') ?
            'dark_dropDownMenu' : 'light_dropDownMenu';

        await smart_LoadCSS(CSSThemes[themToLoad], `${prefixID}-main-theme`);
    }
    function smart_CssPlayer_UCS(player_span, cssData)
    {
        const { yt_gif_wrapper, yt_gif_iframe_wrapper, ty_gif_custom_player_span, yt_gif } = cssData;

        if (!UTILS.isValidCSSUnit(player_span)) 
        {
            return null;
        }

        const css_rule = `.${yt_gif_wrapper}, .${yt_gif_iframe_wrapper} {
                    width: ${player_span};
                }`;

        const id = `${ty_gif_custom_player_span}-${player_span}`

        smart_Create_css_rule(css_rule, id); // i could've used a css variable. fuck! jaja

        //#region util
        function smart_Create_css_rule(css_rules = 'starndard css rules', id = `${yt_gif}-custom`)
        {
            if (document.querySelector(`[id='${id}']`))
            {
                SytleSheetExistAlready(id);
            }
            else
            {
                const style = document.createElement('style'); // could be it's own function
                style.id = id;
                style.setAttribute('type', 'text/css');
                style.innerHTML = css_rules;
                document.getElementsByTagName('head')[0].appendChild(style);
            }
        }
        //#endregion

    }
    function SytleSheetExistAlready(id)
    {
        console.log(`The stylesheet ${id} already exist.`);
    }
    async function smart_Load_DDM_onTopbar(dropDownMenu)
    {
        //⚠️
        const rm_moreIcon = document.querySelector('.bp3-icon-more').closest('.rm-topbar .rm-topbar__spacer-sm + .bp3-popover-wrapper');
        const htmlText = await UTILS.FetchText(dropDownMenu);
        const previousList = DDM_Els();
        if (previousList?.length > 0)
        {
            for (const el of previousList)
            {
                el.parentElement.removeChild(el);
            }
            UTILS.RemoveElsEventListeners(previousList);
        }

        rm_moreIcon.insertAdjacentHTML('afterend', htmlText);
    }
    async function PlayerHtml_UCS()
    {
        let htmlText = await UTILS.FetchText(links.html.playerControls);
        const soundSrc = validSoundURL();
        if (soundSrc)
        {
            htmlText = htmlText.replace(/(?<=<source src=\")(?=")/gm, soundSrc);
        }
        return htmlText
    }
    //#endregion


    //#region 2. hidden functions
    function DDM_to_UI_variables_AND_listen_for_update_Block_Settings()
    {
        // this took a solid hour. thak you thank you
        // also, how would this looks like with the array functions? Hmmm
        for (const parentKey in UI)
        {
            const parentObj = UI[parentKey];
            let siblingKeys = [];
            for (const childKey in parentObj)
            {
                const sessionValue = parentObj[childKey].sessionValue;

                const domEl = document.getElementById(childKey); // ❗❗❗

                if (domEl)
                {
                    parentObj[childKey] = domEl;

                    switch (parentKey)
                    { // ❗
                        case 'range':
                            parentObj[childKey].value = Number(sessionValue);
                            parentObj[childKey].addEventListener('wheel', function (e) { changeOnWeeel(e, this, childKey) }, true);
                            break;
                        case 'label':
                            parentObj[childKey].innerHTML = sessionValue;
                            break;
                        default:
                            const binaryInput = parentObj[childKey];
                            binaryInput.checked = UTILS.isTrue(sessionValue);
                            UTILS.linkClickPreviousElement(binaryInput);
                    }
                    if (parentKey != 'label')
                    {
                        siblingKeys = UTILS.pushSame(siblingKeys, childKey);
                        parentObj[childKey].addEventListener('change', function (e) { updateSettingsPageBlock(e, this, childKey, siblingKeys) }, true);
                    }
                    function updateSettingsPageBlock(e, el, keyObj, siblingKeys)
                    {
                        // ⚠ 🤔
                        let replaceWith = (el.value).toString(); // range

                        if (el.type == 'checkbox' || el.type == 'radio')
                        {
                            replaceWith = (el.checked).toString();
                        }
                        if (el.type == 'radio') // special case...
                        {
                            for (const key of siblingKeys)
                            {
                                window.YT_GIF_DIRECT_SETTINGS.get(key).UpdateSettingsBlockValue('');
                            }
                        }

                        window.YT_GIF_DIRECT_SETTINGS.get(keyObj).UpdateSettingsBlockValue(replaceWith);
                    }
                    function changeOnWeeel(e, el, keyObj)
                    {
                        // How do I check values in the future? This looks expensive...
                        el.dispatchEvent(new Event('change'));
                    }
                }
                else
                {
                    if (childKey == 'baseKey' || parentObj[childKey].hasOwnProperty('domEl'))
                    { // ❗

                        if (childKey == 'ctrlKey' || childKey == 'altKey' || childKey == 'shiftKey')
                        { // ❗❗❗
                            parentObj[childKey] = parentObj[childKey].baseValue;
                            console.warn(`FIXME add ${childKey} to the DDM... avoiding deletion`);
                        }
                        else
                        {
                            delete parentObj[childKey];
                        }
                    }
                    else if (parentObj[childKey].hasOwnProperty('baseValue'))
                    { // ❗
                        parentObj[childKey] = parentObj[childKey].baseValue;
                    }
                    continue; //don't mess up any other variable
                }

            }
        }
    }
    //#endregion


    //#region 3. hidden functions
    function DDM_IconFocusBlurEvents(ddm_icon, ddm_focus, ddm_info_message_selector)
    {
        // 1. special case
        //⚠️
        const mainDDM = document.querySelector('span.yt-gif-drop-down-menu-toolbar .dropdown > .dropdown-content');
        const icon = document.querySelector('.' + ddm_icon);
        spanNegativeTabIndex(icon);

        const classNames = [ddm_focus]; // used inside two local func

        icon.addEventListener('click', function (e) { GainFocus(e, this, mainDDM) }, true);
        icon.addEventListener('blur', function (e) { LoosedFocus(e, this, mainDDM) }, true);


        // 2. for all infoMessages in html
        const infoMessages = document.querySelectorAll(ddm_info_message_selector);
        let validFocusMessage = new Map();

        for (const i of infoMessages)
        {
            const possibleSubDdm = i.nextElementSibling;
            if (possibleSubDdm.classList.contains('dropdown-content'))
            {
                spanNegativeTabIndex(i);
                validFocusMessage.set(i, possibleSubDdm);
            }
        }
        for (const [keyMessageEl, valueEltarget] of validFocusMessage.entries())
        {
            keyMessageEl.addEventListener("click", function (e) { GainFocus(e, this, valueEltarget) });
            keyMessageEl.addEventListener("blur", function (e) { LoosedFocus(e, this, valueEltarget) });
        }


        //#region event handlers
        function GainFocus(e, el, targetEl)
        {
            el.focus();
            UTILS.toggleClasses(true, classNames, targetEl);
        }
        function LoosedFocus(e, el, targetEl)
        {
            UTILS.toggleClasses(false, classNames, targetEl);
        }
        function spanNegativeTabIndex(el)
        {
            if (el.tagName)
            {
                el.setAttribute('tabindex', '-1'); // because they are "span"
            }
        }
        //#endregion
    }
    function DDM_FlipBindedDataAttr_RTM(toggleClassArr = [], attrData)
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
                    UTILS.toggleClasses(!main.checked, toggleClassArr, i);
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
    function UpdateOnScroll_RTM(scroll, labelEl)
    {
        // 📦
        scroll.addEventListener('change', UpdateLabelWithEvent, true);
        scroll.addEventListener('wheel', ValueOnWheel, true);
        function ValueOnWheel(e)
        {
            const elScroll = e.currentTarget;
            const dir = Math.sign(e.deltaY) * -1;
            const parsed = parseInt(elScroll.value, 10);
            elScroll.value = Number(dir + parsed);

            UpdateLabelWithEvent(e);
        }
        function UpdateLabelWithEvent(e)
        {
            UptLabel(e.currentTarget);
            // BIND TO SETTINGS PAGE
        }
        function UptLabel(elScroll)
        {
            labelEl.innerHTML = elScroll.value; // don't worry about overflowing the counter, html range takes care of it
        }

        UptLabel(scroll);
    }
    //#endregion


    //#region 4. hidden functions
    function KeyToObserve_UCS(override_roam_video_component)
    {
        // this can be shorter for sure, how though?
        if (UTILS.isTrue(override_roam_video_component)) //video
        {
            return 'video';
        }
        else if (override_roam_video_component === 'both') // both
        {
            return 'both';
        }
        else // yt-gif
        {
            return 'yt_gif';
        }
    }
    function TogglePlayerThumbnails_DDM_RTM(awaiting_with_video_thumnail_as_bg, awaitng_input_with_thumbnail)
    {
        // BIND TO SETTINGS PAGE

        awaiting_with_video_thumnail_as_bg.addEventListener('change', handleIMGbgSwap);
        function handleIMGbgSwap(e)
        {
            const awaitingGifs = [...document.querySelectorAll(`.${awaitng_input_with_thumbnail}`)];
            for (const i of awaitingGifs)
            {
                if (awaiting_with_video_thumnail_as_bg.checked)
                {
                    UTILS.applyIMGbg(i, i.dataset.videoUrl);
                }
                else
                {
                    UTILS.removeIMGbg(i); // spaguetti
                }
            }
        }
    }
    function RunMasterObserverWithKey(key)
    {
        const options = {
            video: () =>
            { //video_MasterObserver
                window.YT_GIF_OBSERVERS.masterMutationObservers.push(ObserveIframesAndDelployYTPlayers(rm_components.video.classToObserve));
            },
            yt_gif: () =>
            { //yt_gif_MasterObserver
                window.YT_GIF_OBSERVERS.masterMutationObservers.push(ObserveIframesAndDelployYTPlayers(rm_components.yt_gif.classToObserve));
            },
            both: () =>
            { //both_MasterObserver
                for (const classValue of rm_components.both.classesToObserve)
                {
                    window.YT_GIF_OBSERVERS.masterMutationObservers.push(ObserveIframesAndDelployYTPlayers(classValue));
                }
            },
        }
        rm_components.current.key = key;

        options[key](); // THIS IS INSANE!!!
    }
    //#endregion


    //#region BIG BOI FUNCTION
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
                window.YT_GIF_OBSERVERS.CleanMasterObservers();
                await restricInputsfor10SecMeanWhile(redAnimationNoInputs); //showing the red animation, because you are choosing to suspend
                labelTxt(deployInfo.deploy);
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
                if (UTILS.isTrue(deploymentRadioStates[key]())) // THIS IS CRAZY
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
                UTILS.toggleClasses(bol, hiddenClass, subHiddenDDM);
            }
            function isSubDDMpulsing(bol)
            {
                const pulseAnim = [cssData.dwn_pulse_anim]; // spagguetti
                UTILS.toggleClasses(bol, pulseAnim, subHiddenDDM_message); // spagguetti
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
            UTILS.toggleClasses(bol, animation, checkMenuParent);
            UTILS.toggleClasses(bol, noInputAnimation, subMenuCheckParent);
        }
        //#endregion


        //#endregion
    }
    //#endregion


    //#region uitils
    function DDM_Els()
    {
        const { ddm_exist } = cssData
        return document.querySelectorAll('.' + ddm_exist);
    }
    //#endregion

}

function ObserveIframesAndDelployYTPlayers(targetClass)
{
    // 1. set up all visible YT GIFs
    const visible = UTILS.inViewport(AvoidAllZoomChilds());
    for (const component of visible)
    {
        onYouTubePlayerAPIReady(component, 'first wave');
    }

    // 2. IntersectionObserver attached, to deploy when visible
    const hidden = AvoidAllZoomChilds();
    for (const component of hidden)
    {
        // I'm quite impressed with this... I mean...
        window.YT_GIF_OBSERVERS.masterIntersectionObservers.push(ObserveIntersectToSetUpPlayer(component, 'second wave'));
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
                window.YT_GIF_OBSERVERS.masterIntersectionObservers.push(ObserveIntersectToSetUpPlayer(node, 'valid entries MutationObserver'));
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
        UTILS.closestBlockID(wrapper)?.slice(-9) ||
        UTILS.closestBlockID(document.querySelector('.bp3-popover-open'))?.slice(-9);

    if (!uid) return; // don't add up false positives
    const newId = iframeIDprfx + Number(++window.YT_GIF_OBSERVERS.creationCounter);



    // 2. the div that the YTiframe will replace
    if (wrapper.tagName != 'DIV')
    {
        wrapper = UTILS.ChangeElementType(wrapper, 'div');
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
    const record = JSON.parse(JSON.stringify(sesionIDs)); //Object.create(sesionIDs);
    sesionIDs.uid = uid;
    const blockID = UTILS.closestBlockID(wrapper);
    if (blockID != null)
        recordedIDs.set(blockID, record);



    //console.count(message);
    //🌿
    if (UI.experience.awaiting_for_mouseenter_to_initialize.checked)
    {
        const awaitingAnimation = [cssData.awiting_player_pulse_anim, cssData.awaitng_player_user_input];
        const awaitingAnimationThumbnail = [...awaitingAnimation, cssData.awaitng_input_with_thumbnail];

        let mainAnimation = awaitingAnimationThumbnail
        wrapper.setAttribute(attrInfo.videoUrl, url);

        if (UI.experience.awaiting_with_video_thumnail_as_bg.checked)
        {
            UTILS.applyIMGbg(wrapper, url);
        }
        else
        {
            mainAnimation = awaitingAnimation;
        }

        UTILS.toggleClasses(true, mainAnimation, wrapper);
        wrapper.addEventListener('mouseenter', CreateYTPlayer);

        //#region handler
        function CreateYTPlayer(e)
        {
            UTILS.toggleClasses(false, mainAnimation, wrapper);
            UTILS.removeIMGbg(wrapper);
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
        const media = JSON.parse(JSON.stringify(videoParams));
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
async function onPlayerReady(event)
{
    const t = event.target;
    const iframe = document.querySelector('#' + t.h.id) || t.getIframe();
    const parent = iframe.closest('.' + cssData.yt_gif_wrapper) || iframe.parentElement;

    const key = t.h.id;
    const map = allVideoParameters.get(key); //videoParams
    const start = map?.start || 0;
    const end = map?.end || t.getDuration();
    const clipSpan = end - start;
    const speed = map?.speed || 1;
    const entryVolume = validVolumeURL();
    const tickOffset = 1000 / speed;

    const blockID = UTILS.closestBlockID(iframe);
    const rocording = recordedIDs.get(blockID);
    // 🚧?
    if (rocording != null)
        rocording.target = t;

    const loadingMarginOfError = 1; //seconds
    let updateStartTime = start;


    // javascript is crazy
    t.__proto__.changedVolumeOnce = false;
    t.__proto__.readyToChangeVolumeOnce = readyToChangeVolumeOnce;
    t.__proto__.newVol = entryVolume;

    t.__proto__.timers = [];
    t.__proto__.timerID;
    t.__proto__.ClearTimers = ClearTimers;
    t.__proto__.enter = ContinuouslyUpdateTimeDisplay;
    t.__proto__.globalHumanInteraction = undefined;


    iframe.removeAttribute('title');
    t.setVolume(entryVolume);
    t.setPlaybackRate(speed);


    const timeDisplay = parent.querySelector('div.' + cssData.yt_gif_timestamp);

    // 1. previous parameters if available
    const { previousTimestamp, previousVolume } = UI; // still inner objects
    if (lastBlockIDParameters.has(blockID))
    {
        // 🚧? because, this object/functionalities are only relevant when a frame destroyed ≡ or when the script goes full cricle... Hmmmm?
        const sesion = lastBlockIDParameters.get(blockID);
        RunWithPrevious_TimestampStyle(sesion, previousTimestamp);
        RunWithPrevious_VolumeStyle(sesion, previousVolume);
    }



    // Used inside many functions 
    const { playStyle, muteStyle } = UI;

    // 2. play style | pause style
    //#region variables used inside the 'change' callbacks - play/mute Styles
    const { visible_clips_start_to_play_unmuted } = playStyle;
    const { strict_mute_everything_except_current, muted_on_any_mouse_interaction } = muteStyle;
    //#endregion
    for (const p in playStyle)
    {
        playStyle[p].addEventListener('change', playStyleDDMO);
    }
    for (const m in muteStyle)
    {
        muteStyle[m].addEventListener('change', muteStyleDDMO);
    }



    // 3. Mouse over the frame functionality
    parent.addEventListener('mouseenter', InAndOutHoverStatesDDMO);
    parent.addEventListener('mouseleave', InAndOutHoverStatesDDMO);



    // 4. scroll wheel - timestamp display feature
    timeDisplay.addEventListener('wheel', BoundWheelValueToSeek);
    timeDisplay.addEventListener('mouseenter', ContinuouslyUpdateTimeDisplay);
    timeDisplay.addEventListener('mouseleave', ClearTimers);



    // 5. fullscreenStyle
    iframe.addEventListener('fullscreenchange', fullscreenStyle_Handler);



    // 6. store relevant elements with event event listeners to clean them later
    const withEventListeners = [parent, parent.parentNode, timeDisplay, iframe]; // ready to be cleaned



    // 7. clean data and ready 'previous' paramaters for next sesion with IframeRemmovedFromDom_callback
    const config = { subtree: true, childList: true };
    const RemovedObserver = new MutationObserver(IframeMutationRemoval_callback); // will fire IframeRemmovedFromDom_callback... the acutal logic
    RemovedObserver.observe(document.body, config);



    // 8. 'auto pause' when an iframe goes out the viewport... stop playing and mute
    const yConfig = { threshold: [0] };
    const ViewportObserver = new IntersectionObserver(PauseOffscreen_callback, yConfig);
    ViewportObserver.observe(iframe);



    // 9. well well well - pause if user doesn't intents to watch
    HumanInteraction_AutopalyFreeze(); // this being the last one, does matter


    //#region 1. previous parameters
    function RunWithPrevious_VolumeStyle(sesion, { strict_start_volume, start_volume, fixed_start_volume })
    {
        if (strict_start_volume.checked)
        {
            const vl_Hist = sesion.volumeURLmapHistory;
            if (vl_Hist[vl_Hist.length - 1] != entryVolume) // new entry is valid ≡ user updated "&vl="
            {
                vl_Hist.push(entryVolume);
                t.__proto__.newVol = entryVolume;
            }
            else // updateVolume has priority then
            {
                t.__proto__.newVol = sesion.updateVolume;
            }
        }
        else if (start_volume.checked)
        {
            t.__proto__.newVol = sesion.updateVolume;
        }
        else if (fixed_start_volume.checked)
        {
            t.__proto__.newVol = validVolumeURL();
        }
    }

    function RunWithPrevious_TimestampStyle(sesion, { strict_start_timestamp, start_timestamp, fixed_start_timestamp })
    {
        if (strict_start_timestamp.checked)
        {
            const timeHist = sesion.timeURLmapHistory;
            if (timeHist[timeHist.length - 1] != start) // new entry is valid ≡ user updated "?t="
            {
                timeHist.push(start);
                seekToUpdatedTime(start);
            }
            else
            {
                seekToUpdatedTime(sesion.updateTime);
            }
        }
        else if (start_timestamp.checked && bounded(sesion.updateTime))
        {
            seekToUpdatedTime(sesion.updateTime);
        }
        else if (fixed_start_timestamp.checked)
        {
            // don't seek you are already there, it's just semantics and a null option
        }
    }
    //#endregion


    //#region 2. play/mute styles
    function playStyleDDMO()
    {
        if (!UTILS.inViewport(iframe)) return; //play all VISIBLE Players, this will be called on all visible iframes

        if (visible_clips_start_to_play_unmuted.checked)
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
        if (!UTILS.inViewport(iframe)) return; //mute all VISIBLE Players, this will be called on all visible iframes

        if (strict_mute_everything_except_current.checked || muted_on_any_mouse_interaction.checked)
        {
            isSoundingFine(false);
        }
    }
    //#endregion


    //#region 3. hover over the frame
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
                const ytGifs = UTILS.inViewport(UTILS.allIframeStyle(config?.styleQuery));
                for (const i of ytGifs)
                {
                    const blockID = UTILS.closestBlockID(i);
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
            t.__proto__.newVol = t.getVolume(); // spaguetti isSoundingFine unMute
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
    //#endregion


    //#region 4. Controls - timedisplay
    // timeDisplay
    function ContinuouslyUpdateTimeDisplay()
    {
        //🙋 this is too uggly
        if (document.querySelector('#' + key) == null)
        {
            t.__proto__.enter = () => { };
            t.destroy();
            return;
        }

        if (!isThereAnyTimeDisplayInteraction()) return;

        UpdateTimeDisplay();

        t.__proto__.timerID = window.setInterval(() =>
        {
            if (isThereAnyTimeDisplayInteraction()) // absolutely necessary because the interval can trigger after the user left the frame
                UpdateTimeDisplay();
        }, tickOffset);
        t.__proto__.timers.push(t.__proto__.timerID);
    }
    function UpdateTimeDisplay()
    {
        const sec = Math.abs(clipSpan - (end - tick()));

        //timeDisplay.innerHTML = '00:00/00:00'
        if (UI.display.clip_life_span_format.checked) 
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
    // scroll wheel
    function BoundWheelValueToSeek(e)
    {
        videoIsPlayingWithSound(false);

        let dir = tick() + (Math.sign(e.deltaY) * Math.round(UI.range.timestamp_display_scroll_offset.value) * -1);

        if (UI.display.clip_life_span_format.checked)
        {
            if (dir <= start)
                dir = end - 1; //can go beyond that

            if (dir >= end)
                dir = start; //can go beyond that
        }

        t.seekTo(dir);

        UpdateTimeDisplay();

        setTimeout(() =>
        {
            if (isThereAnyTimeDisplayInteraction())
            {
                videoIsPlayingWithSound();
            }
        }, tickOffset); //nice delay to show feedback
    }

    //utils timeDisplay
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
    function isThereAnyTimeDisplayInteraction()
    {
        return isTimeDisplayHover() && isParentHover();
    }
    //#endregion


    //#region 5. fullscreen
    function fullscreenStyle_Handler(params)
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
    }
    //#endregion


    //#region 7. on destroyed
    function IframeMutationRemoval_callback(mutationsList, observer)
    {
        mutationsList.forEach(function (mutation)
        {
            const nodes = Array.from(mutation.removedNodes);
            const directMatch = nodes.indexOf(iframe) > -1
            const parentMatch = nodes.some(parentEl => parentEl.contains(iframe));

            if (directMatch)
            {
                observer.disconnect();
                console.log(`node ${iframe} was directly removed!`);
            }
            else if (parentMatch)
            {
                IframeRemmovedFromDom_callback(observer);
            }
        });
    };
    function IframeRemmovedFromDom_callback(observer)
    {
        // expensive for sure 🙋
        UTILS.RemoveElsEventListeners(withEventListeners);
        for (const p in playStyle)
        {
            playStyle[p].removeEventListener('change', playStyleDDMO); // all valid, toggle play state
        }
        for (const m in muteStyle)
        {
            muteStyle[m].removeEventListener('change', muteStyleDDMO); // all valid, toggle play state
        }




        //🚧 UpdateNextSesionValues
        const media = JSON.parse(JSON.stringify(videoParams));
        media.updateTime = bounded(tick()) ? tick() : start;
        media.updateVolume = isValidVolNumber(t.__proto__.newVol) ? t.__proto__.newVol : validUpdateVolume();
        if (media.timeURLmapHistory.length == 0) // kinda spaguetti, but it's super necesary - This will not ignore the first block editing - stack change
        {
            media.timeURLmapHistory.push(start);
        }
        if (blockID != null)
        {
            lastBlockIDParameters.set(blockID, media);
        }




        // clean... video maps
        ClearTimers();
        recordedIDs.delete(blockID);
        allVideoParameters.delete(key);
        observer.disconnect();
        t.__proto__.enter = () => { };




        // either save the target
        const targetExist = document.querySelector('#' + key) == iframe;
        if (targetExist)
        {
            return console.log(`${key} is displaced, not removed, thus is not destroyed.`);
        }

        // or destroy it
        const afterT = setTimeout(() => destroyTarget(afterT), 1000);
        function destroyTarget()
        {
            if (!targetExist)
            {
                t.destroy();
                console.count('Destroyed! ' + key);
            }
        }
    }
    //#endregion


    //#region 8. pause off screen
    function PauseOffscreen_callback(entries)
    {
        if (!entries[0])
        {
            ViewportObserver.disconnect();
        }

        if (tick() > updateStartTime + loadingMarginOfError && !t.__proto__.globalHumanInteraction) // and the interval function 'OneFrame' to prevent the loading black screen
        {
            if (UI.playStyle.visible_clips_start_to_play_unmuted.checked)
            {
                togglePlay(entries[0]?.isIntersecting);
            }
            else
            {
                togglePlay(false);
            }
        }
    }
    //#endregion


    //#region 9. last
    function HumanInteraction_AutopalyFreeze()
    {
        const autoplayParent = iframe.closest('.rm-alias-tooltip__content') || //tooltip
            iframe.closest('.bp3-card') || //card
            iframe.closest('.myPortal'); //myPortal

        if (autoplayParent) //simulate hover
        {
            const simHover = new MouseEvent('mouseenter',
                {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });

            parent.dispatchEvent(simHover);
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
                    else if (UTILS.inViewport(iframe) && !t.__proto__.globalHumanInteraction)
                    {
                        togglePlay(UI.playStyle.visible_clips_start_to_play_unmuted.checked); // pause
                    }

                    clearInterval(OneFrame);
                }
            }, 200);
        }
    }
    //#endregion


    //#region closure to change volume on load
    function readyToChangeVolumeOnce()
    {
        if (!t.__proto__.changedVolumeOnce)
        {
            t.__proto__.changedVolumeOnce = true;
            t.setVolume(t.__proto__.newVol);
        }
    }
    //#endregion


    //#region local utils
    function seekToUpdatedTime(desiredTime)
    {
        updateStartTime = desiredTime;
        t.seekTo(updateStartTime);
    }
    function tick(target = t)
    {
        const crrTime = target?.getCurrentTime();
        return crrTime;
    }
    function bounded(x)
    {
        return start < x && x < end;
    }
    function validUpdateVolume()
    {
        const newVl = map?.updateVolume;
        if (typeof newVl == 'number')
            return newVl;

        return videoParams.volume || 40;
    }
    function validVolumeURL()
    {
        const newVl = map?.volume;
        if (typeof newVl == 'number')
            return newVl;

        return videoParams.volume || 40;
    }
    function isValidVolNumber(vol)
    {
        if (typeof vol == 'number')
            return true;

        return false;
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
            t.setVolume(t.__proto__.newVol); // spaguetti InAndOutHoverStatesDDMO mouseleave
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
            if (e[name] && UTILS.isTrue(UI.InAndOutKeys[name]))
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
    function isTimeDisplayHover()
    {
        return timeDisplay.matches(":hover");
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
//loops between 'start' and 'end' boundaries
function onStateChange(state)
{
    const t = state.target;
    const map = allVideoParameters.get(t.h.id);

    if (state.data === YT.PlayerState.ENDED)
    {
        t.seekTo(map?.start || 0);

        const soundSrc = validSoundURL();
        if (soundSrc)
        {
            if (UI.experience.sound_when_video_loops.checked)
            {
                play(soundSrc);
                //#region util
                function play(url)
                {
                    return new Promise(function (resolve, reject)
                    { // return a promise
                        var audio = new Audio();                     // create audio wo/ src
                        audio.preload = "auto";                      // intend to play through
                        audio.volume = UTILS.mapRange(UI.range.end_loop_sound_volume.value, 0, 100, 0, 1.0);
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
                UTILS.exitFullscreen();
                currentFullscreenPlayer = '';
            }
        }
    }


    if (state.data === YT.PlayerState.PLAYING)
    {
        t.__proto__.readyToChangeVolumeOnce(); //man...

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


//#region Utils
function validSoundURL()
{
    const src = window.YT_GIF_SETTINGS_PAGE.defaultValues.end_loop_sound_src.sessionValue;
    if (UTILS.isValidUrl(src))
    {
        return src
    }
    return null
}
//#endregion


/*

user requested ☐ ☑
    yt iframe customizable ui language ☐


I want to add ☐ ☑
    Refactoring mode, don't load the yt gif, in fact don't create the btn
        just show the user the raw text, so they don't have to go and re enter the block

    10 head big monkey brain roam idea boiiii ☐
        paste text form the yt gif browser extension to roam, if the exact same string
        already exist in the DB, a promt message will

    an inline editor for ajusting the litle miscalculations in the clips ☐
        a litle bit earlier, a litle bit after...
        and inplement the changes, when the user the user enter the real edit block mode


TODO ☐ ☑
    bind event and update settings_page obj ☐
        and update the actual block on the actual page

features on hold btn at the bottom ☑ ☑
    focus & blus for sub ddm ☑ ☑
    an util class ☑ ☑
    click the item checks the btn ☑ ☑
    radios : mute pause when document is inactive ☑ ✘

    use only one audio?? ☑ ☑ url so is customizable by nature
    loop sound adjusment with slider hidden inside sub menu | ohhhh bind main checkbox to hidde it's "for"
    deploy on mouse enter ☑ ☑
    scrolwheel is broke, fix ☑ ☑

    to apply volume on end loop audio ☑ ☑
    http vs https ☑ ☑
    coding train shifman mouse inside div, top, left ✘ ☑ ☑

    bind thumbnail input element hiddeness to initialize checkbox ☑ . what? jaja

    play a sound to indicate the current gif makes loop ☑ ☑
    https://freesound.org/people/candy299p/sounds/250091/          * film ejected *
    https://freesound.org/data/previews/250/250091_4586102-lq.mp3

    https://freesound.org/people/nckn/sounds/256113/               * param ram *
    https://freesound.org/data/previews/256/256113_3263906-lq.mp3

    https://freesound.org/data/previews/35/35631_18799-lq.mp3 - roam research podoro ding -


Discarted
    shortcuts for any btn ✘
    all hoverable actions, after 500ms the item it's checked // and this feature own btn ofcourse ✘
    add yt_api customizable settings ✘


Bugs
    hover a frame > mouse leave with sound > focus on another window > go back to roam & and mouse enter a new frame, both videos play unmuted even with strict_mute_everything_except_current enabled ☐
        work around > mouse enter a new frame holding middle mouse > mutes the previous, but the previous video still plays unmuted even though play_on_mouse_over enebled ☐

    initizlizing any video
        it's volume is 100 always

    videoParams
        default volume is mistaken as string
            it should be an integer

*/