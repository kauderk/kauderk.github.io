// version 38 - semi-refactored
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
    iframe_buffer_label: '',
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
let initialCheck_awaitngBtn = undefined;
let userActiveChoice_awaitingBtn = undefined;
/*-----------------------------------*/
const YT_GIF_OBSERVERS_TEMP = {
    masterMutationObservers: [],
    masterIntersectionObservers: [],
    masterIntersectionObservers_buffer: [],
    masterIframeBuffer: [],
    creationCounter: -1, // crucial, because the api won't reload iframes with the same id
    CleanMasterObservers: function ()
    {
        const mutObjRes = cleanObserverArr(this.masterMutationObservers);
        this.masterMutationObservers = mutObjRes.observer;

        const insObjRes = cleanObserverArr(this.masterIntersectionObservers);
        this.masterIntersectionObservers = insObjRes.observer;

        const bufObjRes = cleanObserverArr(this.masterIntersectionObservers_buffer);
        this.masterIntersectionObservers_buffer = insObjRes.observer;

        console.log(`${mutObjRes.counter} mutation, ${insObjRes.counter} intersection and ${bufObjRes.counter} iframe buffer master observers cleaned`);

        function cleanObserverArr(observer)
        {//https://www.codegrepper.com/code-examples/javascript/how+to+do+a+reverse+loop+in+javascript#:~:text=www.techiedelight.com-,how%20to%20reverse%20loop%20in%20javascript,-javascript%20by%20Dark
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
    },
    CleanLoadedWrappers: function ()
    {
        const wrappers = document.querySelectorAll(`[${attrInfo.target}]`);

        for (let i = wrappers.length - 1; i >= 0; i--)
        {
            const wrapper = document.querySelector(UTILS.getUniqueSelectorSmart(wrappers[i]));
            CleanAndBrandNewWrapper(wrapper, attrInfo.creation.name, attrInfo.creation.cleaning); //wrapperParent -> nest new span
        }
    },
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

    volume: window.YT_GIF_DIRECT_SETTINGS.get('player_volume').sessionValue,
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
const UIDtoURLInstancesMapMap = new Map(); // since it store recursive maps, once per instance it's enough
/*-----------------------------------*/
const urlFolder = (f) => `https://kauderk.github.io/yt-gif-extension/resources/${f}`;
const self_urlFolder = (f) => `https://kauderk.github.io/yt-gif-extension/v0.2.0/${f}`;
const urlFolder_css = (f) => urlFolder(`css/${f}`);
const urlFolder_html = (f) => urlFolder(`html/${f}`);
const urlFolder_js = (f) => urlFolder(`js/${f}`);
const links = {
    css: {
        dropDownMenuStyle: urlFolder_css('drop-down-menu.css'),
        playerStyle: urlFolder_css('player.css'),
        themes: {
            dark_dropDownMenu: urlFolder_css('themes/dark-drop-down-menu.css'),
            light_dropDownMenu: urlFolder_css('themes/light-drop-down-menu.css'),
        }
    },
    html: {
        dropDownMenu: self_urlFolder('html/drop-down-menu.html'),
        playerControls: urlFolder_html('player-controls.html'),
        fetched: {
            playerControls: '',
        },
    },
    js: {
        utils: urlFolder_js('utils.js'),
        roamAlphaApi: urlFolder_js('utils-roam-alpha-api.js'),
        settingsPage: self_urlFolder('js/settings-page.js'),
        main: self_urlFolder('js/yt-gif-main.js'),
    },
    help: {
        github_isuues: `https://github.com/kauderk/kauderk.github.io/issues`,
    }
}
const cssData = {
    yt_gif: 'yt-gif',
    yt_gif_wrapper: 'yt-gif-wrapper',
    yg_wrapper_p: 'yt-gif-wrapper-parent',
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

    stt_allow: 'settings-not-allowed',

    ditem_allow: 'dropdown-item_not-allowed_input',

    p_controls: 'yt-gif-controls',

    ddn_tut_awaiting: 'ddm-tut-awaiting-input',

    id: {
        navigate_btn: '#navigate-to-yt-gif-settings-page',
    }
}
const attrData = {
    initialize_bg: 'initialize-bg',
    initialize_loop: 'initialize-loop',
    iframe_buffer: 'iframe_buffer', // ok "_" and "-" is causing confusion... fix this later
}
const attrInfo = {
    url: {
        path: 'data-video-url',
        index: 'data-video-index',
    },
    target: 'data-target',
    uid: 'data-uid',
    creation: {
        name: 'data-creation',
        forceAwaiting: 'force-awaiting',
        cleaning: 'cleaning',
        displaced: 'displaced',
        buffer: 'buffer',
    },
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
function pushMasterObserverWithTargetClass(classToObserve)
{
    window.YT_GIF_OBSERVERS.masterMutationObservers.push(ObserveIframesAndDelployYTPlayers(classToObserve));
}
function baseDeploymentObj()
{
    return {
        deploymentStyle: function () { return this.BinaryDomUI().checked },
        checkSubDeploymentStyle: function (bol) { this.BinaryDomUI().checked = bol },
        runMasterObservers: function () { pushMasterObserverWithTargetClass(this.classToObserve); },
    }
}
function baseDeploymentObj_both()
{
    const obj_both = {
        runMasterObservers: function ()
        {
            for (const classValue of this.classesToObserve)
                pushMasterObserverWithTargetClass(classValue);
        },
    }
    return Object.assign(baseDeploymentObj(), obj_both);
}
const rm_components = {
    video: {
        description: '{{[[video]]}}',
        classToObserve: 'rm-video-player__spacing-wrapper',
        BinaryDomUI: () => UI.deploymentStyle.deployment_style_video,
    },
    yt_gif: {
        description: '{{[[yt-gif]]}}',
        classToObserve: `rm-xparser-default-${cssData.yt_gif}`,
        BinaryDomUI: () => UI.deploymentStyle.deployment_style_yt_gif,
    },
    yt_gif_tut: {
        classToObserve: 'yt-gif-ddm-tutorial', /* TESTING */
    },
    state: {
        currentKey: '',
        initialKey: '',
    },
    currentTarget: function ()
    {
        const crr = this.state.currentKey;
        const tkey = (crr == 'both') ? 'yt_gif' : crr;
        return this[tkey].classToObserve;
    },
    assertCurrentKey: function (override_roam_video_component)
    {
        let newKey = null; // this can be shorter for sure, how though?
        if (UTILS.isTrue(override_roam_video_component)) //video
        {
            newKey = 'video';
        }
        else if (override_roam_video_component === 'both') // both
        {
            newKey = 'both';
        }
        else // yt-gif
        {
            newKey = 'yt_gif';
        }
        return this.state.currentKey = newKey;
    },
    validOverrideComponentSettingBlock: function (el)
    {
        const idPrfx = (key) => `deployment_style_${key}`;
        let replaceWith = null;
        switch (el.id)
        {
            case idPrfx('yt_gif'):
                replaceWith = 'false';
                break;
            case idPrfx('video'):
                replaceWith = 'true';
                break;
            case idPrfx('both'):
                replaceWith = 'both';
                break;
        }
        return replaceWith;
    },
    RunMasterObserverWithKey: function (key)
    {
        this.state.currentKey = key;
        this[key]['runMasterObservers'](); // THIS IS INSANE!!!
    },
    ChargeMasterObserversWithValidDeploymentStyle: function ()
    {
        const filterKeyProperty = 'deploymentStyle';
        const filtered = UTILS.FilterSubObjByKey(filterKeyProperty, this);

        for (const key in filtered)
        {
            if (UTILS.isTrue(this[key][filterKeyProperty]())) // THIS IS CRAZY
            {
                this.RunMasterObserverWithKey(key);
                return;
            }
        }
    }
}
Object.assign(rm_components.video, baseDeploymentObj());
Object.assign(rm_components.yt_gif, baseDeploymentObj());
rm_components.both = {
    description: `${rm_components.video.description} and ${rm_components.yt_gif.description}`,
    classesToObserve: [rm_components.video.classToObserve, rm_components.yt_gif.classToObserve],
    BinaryDomUI: () => UI.deploymentStyle.deployment_style_both,
}
Object.assign(rm_components.both, baseDeploymentObj_both());
/*-----------------------------------*/




if (
    typeof (UTILS) !== 'undefined' &&
    typeof (RAP) != 'undefined' &&
    typeof (YT) != 'undefined'
)
{
    Ready(); // LET'S GO! LET'S GO!
}
else
{
    console.warn(`The YT GIF Extension won't be installed, major scripts are missing... submit your issue here: ${links.help.github_isuues}`);
}




async function Ready()
{

    // 0. the objects "UI", "links", "attrData" and "cssData" are binded to all of these functions
    if (DDM_Els().length > 0)
    {
        try
        {
            window.YT_GIF_OBSERVERS.CleanMasterObservers();
            window.YT_GIF_OBSERVERS.CleanLoadedWrappers();
            window.YT_GIF_OBSERVERS.masterIframeBuffer = new Array();
        } catch (err)
        {
            console.warn(`YT GIF's Masters observers are not defined.`);
        }
        console.log('Reinstalling the YT GIF Extension');
    }



    // 1. set up looks
    //#region relevant variables
    const { css_theme, player_span } = Object.fromEntries(window.YT_GIF_DIRECT_SETTINGS);;
    const { themes, playerStyle, dropDownMenuStyle } = links.css;
    const { playerControls, dropDownMenu } = links.html;
    const { yt_gif } = cssData; // CssThemes_UCS
    //#endregion

    await smart_LoadCSS(dropDownMenuStyle, `${yt_gif}-dropDownMenuStyle`);
    await smart_LoadCSS(playerStyle, `${yt_gif}-playerStyle`);

    await smart_CssThemes_UCS(css_theme.sessionValue, themes, yt_gif); // UCS - user customizations
    await smart_CssPlayer_UCS(player_span.sessionValue);

    links.html.fetched.playerControls = await PlayerHtml_UCS(playerControls);

    await smart_Load_DDM_onTopbar(dropDownMenu); // DDM - drop down menu



    // 2. assign direct values to the main object | UI - user inputs
    DDM_to_UI_variables(); // filtering baseKey & prompts and transforming them from objs to values or dom els - it is not generic and only serves for the first indent level (from parent to child keys)
    SaveSettingsOnChanges(); // the seetings page script is responsable for everything, this are just events



    // 3. set up events
    //#region relevant variables
    const { ddm_icon, ddm_focus, ddm_info_message_selector, dropdown__hidden, awaitng_input_with_thumbnail } = cssData;
    const { timestamp_display_scroll_offset, end_loop_sound_volume, iframe_buffer_slider } = UI.range;
    const { rangeValue, loop_volume_displayed, iframe_buffer_label } = UI.label;
    const { awaiting_with_video_thumnail_as_bg } = UI.experience;
    const { iframe_buffer_stack, awaiting_for_mouseenter_to_initialize, try_to_load_on_intersection_beta } = UI.experience;
    const { dwp_message, stt_allow } = cssData;
    const { navigate_btn } = cssData.id;
    //#endregion

    DDM_IconFocusBlurEvents(ddm_icon, ddm_focus, ddm_info_message_selector);

    DDM_FlipBindedDataAttr_RTM([dropdown__hidden], attrData); // RTM runtime

    UpdateOnScroll_RTM(timestamp_display_scroll_offset, rangeValue);
    UpdateOnScroll_RTM(end_loop_sound_volume, loop_volume_displayed);
    UpdateOnScroll_RTM(iframe_buffer_slider, iframe_buffer_label);

    TogglePlayerThumbnails_DDM_RTM(awaiting_with_video_thumnail_as_bg, awaitng_input_with_thumbnail);

    navigateToSettingsPageInSidebar(navigate_btn, dwp_message, stt_allow);

    IframeBuffer_AND_AwaitngToInitialize_SYNERGY_RTM(iframe_buffer_stack, awaiting_for_mouseenter_to_initialize, iframe_buffer_slider, try_to_load_on_intersection_beta);



    // 4. run extension and events - set up
    //#region relevant variables
    const { override_roam_video_component } = UI.defaultValues;
    //#endregion

    await MasterObserver_UCS_RTM(); // listening for changes | change the behaviour RTM // BIG BOI FUNCTION

    rm_components.state.initialKey = rm_components.assertCurrentKey(override_roam_video_component);
    const { initialKey } = rm_components.state;
    rm_components[initialKey].checkSubDeploymentStyle(true); // start with some value
    rm_components.RunMasterObserverWithKey(initialKey);



    // 5. TESTING!
    SettingUpTutorials();



    console.log('YT GIF extension activated');



    //#region 1. looks - fetch css html
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
    function smart_CssPlayer_UCS(player_span)
    {
        if (UTILS.isValidCSSUnit(player_span)) 
        {
            document.documentElement.style.setProperty('--yt-gif-player-span', player_span);
            return;
        }
        return null;
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
    async function PlayerHtml_UCS(playerControls)
    {
        return await UTILS.FetchText(playerControls);
    }
    //#endregion


    //#region 2. filter UI user inputs variables
    function DDM_to_UI_variables()
    {
        // this took a solid hour. thak you thank you
        // also, how would this looks like with the array functions filter|map|fill? Hmmm
        for (const parentKey in UI)
        {
            const parentObj = UI[parentKey];
            if (parentObj.baseKey?.inputType == 'prompt')
            {
                delete UI[parentKey];
                continue;
            }

            for (const childKey in parentObj)
            {
                const child = parentObj[childKey];
                const directObjPpts = (child?.baseKey) ? child.baseKey : child;
                const sessionValue = directObjPpts.sessionValue;
                const domEl = document.getElementById(childKey); // ❗❗❗

                if (domEl)
                {
                    parentObj[childKey] = domEl;

                    switch (parentKey)
                    {
                        case 'range':
                            parentObj[childKey].value = Number(sessionValue);
                            break;
                        case 'label':
                            parentObj[childKey].innerHTML = sessionValue;
                            break;
                        default:
                            const binaryInput = parentObj[childKey];
                            binaryInput.checked = UTILS.isTrue(sessionValue);
                            UTILS.linkClickPreviousElement(binaryInput);
                    }
                }
                else
                {
                    if (directObjPpts.hasOwnProperty('baseValue'))
                    {
                        parentObj[childKey] = sessionValue || directObjPpts.baseValue;
                    }
                    else if (childKey == 'baseKey' || directObjPpts.inputType == "prompt")
                    {
                        delete parentObj[childKey];
                    }
                }
            }
        }
    }
    function SaveSettingsOnChanges()
    {
        for (const parentKey in UI)
        {
            let siblingKeys = [];
            const parentObj = UI[parentKey];

            for (const childKey in parentObj)
            {
                const child = parentObj[childKey];
                siblingKeys = UTILS.pushSame(siblingKeys, childKey);
                switch (parentKey)
                {
                    case 'label':
                    case 'InAndOutKeys':
                    case 'defaultPlayerValues':
                    case 'defaultValues':
                        continue;
                    case 'deploymentStyle': // special case...
                        child.addEventListener('change', function (e) { updateOverrideComponentSettingBlock(e, this, childKey, siblingKeys) }, true);
                        continue;
                    case 'range': // special case...
                        child.addEventListener('wheel', function (e) { changeOnWeeel(e, this, childKey) }, true);
                }
                child.addEventListener('change', function (e) { updateSettingsPageBlock(e, this, childKey, siblingKeys) }, true);
            }
        }
    }
    /* *************** */
    function updateSettingsPageBlock(e, el, keyObj, siblingKeys)
    {
        const { type, checked, value } = el;
        let replaceWith = (value).toString(); // range - checkbox - radio - label

        if (type == 'checkbox' || type == 'radio')
        {
            replaceWith = (checked).toString();
        }
        if (type == 'radio') // special case...
        {
            for (const key of siblingKeys)
            {
                window.YT_GIF_DIRECT_SETTINGS.get(key).UpdateSettingsBlockValue(''); // to false
            }
        }

        window.YT_GIF_DIRECT_SETTINGS.get(keyObj)?.UpdateSettingsBlockValue(replaceWith);
    }
    function changeOnWeeel(e, el, keyObj)
    {
        // How do I check values in the future? This looks expensive...
        el.dispatchEvent(new Event('change'));
    }
    function updateOverrideComponentSettingBlock(e, el, keyObj, siblingKeys)
    {
        const validOverride = rm_components.validOverrideComponentSettingBlock(el);
        if (validOverride)
        {
            rm_components.assertCurrentKey(validOverride);
            window.YT_GIF_DIRECT_SETTINGS.get('override_roam_video_component')?.UpdateSettingsBlockValue(validOverride);
        }
    }
    //#endregion


    //#region 3. events pre observers
    function DDM_IconFocusBlurEvents(ddm_icon, ddm_focus, ddm_info_message_selector)
    {
        // 1. ⚠️ special case
        const { icon, mainDDM } = GetMainYTGIFicon(ddm_icon);
        const classNames = [ddm_focus]; // used inside two local func

        icon.addEventListener('click', function (e) { GainFocus(e, this, mainDDM) }, true);
        icon.addEventListener('blur', function (e) { LostFocus(e, this, mainDDM) }, true);


        // 2. for all infoMessages in html
        const infoMessages = document.querySelectorAll(ddm_info_message_selector);
        let validFocusMessage = new Map();

        for (const i of infoMessages)
        {
            const possibleSubDdm = i.nextElementSibling;
            if (possibleSubDdm?.classList.contains('dropdown-content'))
            {
                spanNegativeTabIndex(i);
                validFocusMessage.set(i, possibleSubDdm);
            }
        }
        for (const [keyMessageEl, valueEltarget] of validFocusMessage.entries())
        {
            keyMessageEl.addEventListener("click", function (e) { GainFocus(e, this, valueEltarget) });
            keyMessageEl.addEventListener("blur", function (e) { LostFocus(e, this, valueEltarget) });
        }


        // event handlers
        function GainFocus(e, el, targetEl)
        {
            el.focus();
            UTILS.toggleClasses(true, classNames, targetEl);
        }
        function LostFocus(e, el, targetEl)
        {
            UTILS.toggleClasses(false, classNames, targetEl);
        }

    }
    function GetMainYTGIFicon(ddm_icon)
    {
        // 
        const mainMenu = document.querySelector('span.yt-gif-drop-down-menu-toolbar .dropdown');
        const mainDDM = document.querySelector('span.yt-gif-drop-down-menu-toolbar .dropdown > .dropdown-content');
        const icon = document.querySelector('.' + ddm_icon);
        spanNegativeTabIndex(icon);
        return { icon, mainDDM, mainMenu };
    }
    function spanNegativeTabIndex(el)
    {
        if (el.tagName)
        {
            el.setAttribute('tabindex', '-1'); // because they are "span"
        }
    }
    /* ************* */
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

            function toggleValidItemClasses()
            {
                for (const i of valid)
                {
                    UTILS.toggleClasses(!main.checked, toggleClassArr, i);
                }
            }
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
        UptLabel(scroll);

        // 📦
        scroll.addEventListener('click', (e) => UptLabel(e.currentTarget), true);
        scroll.addEventListener('wheel', (e) => UptLabel(SliderValue(e)), true);

        function SliderValue(e)
        {
            const elScroll = e.currentTarget;
            const dir = Math.sign(e.deltaY) * -1;
            const parsed = parseInt(elScroll.value, 10);
            elScroll.value = Number(dir + parsed);
            return elScroll;
        }
        function UptLabel(elScroll)
        {
            labelEl.innerHTML = elScroll.value; // don't worry about overflowing the counter, html range takes care of it
            elScroll.dispatchEvent(new Event('change'));
        }
    }

    function TogglePlayerThumbnails_DDM_RTM(awaiting_with_video_thumnail_as_bg, awaitng_input_with_thumbnail)
    {
        // BIND TO SETTINGS PAGE

        awaiting_with_video_thumnail_as_bg.addEventListener('change', handleIMGbgSwap);
        function handleIMGbgSwap(e)
        {
            const awaitingGifs = [...document.querySelectorAll(`.${awaitng_input_with_thumbnail}`)];
            for (const el of awaitingGifs)
            {
                if (awaiting_with_video_thumnail_as_bg.checked)
                {
                    UTILS.applyIMGbg(el, el.dataset.videoUrl);
                }
                else
                {
                    UTILS.removeIMGbg(el); // spaguetti
                }
            }
        }
    }
    async function navigateToSettingsPageInSidebar(settingsBtnID, dwp_message, stt_allow)
    {
        // ⚠️
        const SttPages = () => UTILS.innerElsContains('.rm-sidebar-outline .rm-title-display span', TARGET_PAGE);
        const anySidebarInstance = () => SttPages().length >= 1;

        const settingsBtnWrapper = document.querySelector(settingsBtnID);
        const settingsBtn = settingsBtnWrapper.querySelector(`.${dwp_message}[data-tooltip]`)

        const originalTooltip = settingsBtn.getAttribute('data-tooltip');
        const clause = `YT GIF Settings page instance already open within the Sidebar. It's pourpouse is to check values. Change them using this menu.`;


        settingsBtn.addEventListener('click', async function (e)
        {
            // ⚠️⚠️⚠️ how do you communicate with the other scripts? Interfaces? Events? WindowEvents?
            await RAP.setSideBarState(3);
            await RAP.sleep(50); // an observer is the safest option though

            if (!anySidebarInstance())
            {
                UTILS.toggleClasses(true, [stt_allow], settingsBtnWrapper);
                settingsBtn.setAttribute('data-tooltip', clause);
                await RAP.openBlockInSidebar(TARGET_UID); // back end execution... should it be here...? //https://stackoverflow.com/questions/12097381/communication-between-scripts-three-methods#:~:text=All%20JS%20scripts%20are%20run%20in%20the%20global%20scope.%20When%20the%20files%20are%20downloaded%20to%20the%20client%2C%20they%20are%20parsed%20in%20the%20global%20scope
            }

            // firs settings page instance
            await RAP.sleep(50);
            SttPages()?.[0]?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        });

        settingsBtn.addEventListener('mouseenter', ToogleSettingBtnVisualFeedback);

        const { icon, mainDDM } = GetMainYTGIFicon(ddm_icon);
        icon.addEventListener('blur', ToogleSettingBtnVisualFeedback, true);
        icon.addEventListener('mouseenter', ToogleSettingBtnVisualFeedback, true);
        icon.addEventListener('mouseleave', ToogleSettingBtnVisualFeedback, true);


        function ToogleSettingBtnVisualFeedback()
        {
            const open = anySidebarInstance();
            settingsBtn.setAttribute('data-tooltip', (open) ? clause : originalTooltip);
            UTILS.toggleClasses(open, [stt_allow], settingsBtnWrapper);
        }
    }
    function IframeBuffer_AND_AwaitngToInitialize_SYNERGY_RTM(iframe_buffer_stack, awaiting_for_mouseenter_to_initialize, iframe_buffer_slider, try_to_load_on_intersection_beta)
    {
        initialCheck_awaitngBtn = awaiting_for_mouseenter_to_initialize.checked;

        Initial_synergy_btns();

        awaiting_for_mouseenter_to_initialize.addEventListener('change', function (e)
        {
            const { checked, parentNode } = e.currentTarget;
            toggleBtn_VS(checked, TryingBtn_VisualFeedback);

            if (parentNode.matches(":hover"))
            {
                userActiveChoice_awaitingBtn = checked;
            }
        });
        try_to_load_on_intersection_beta.addEventListener('change', (e) =>
        {
            const { checked } = e.currentTarget;
            toggleBtn_VS(checked, AwaitingBtn_VisualFeedback);
        });


        iframe_buffer_stack.addEventListener('change', function (e)
        {
            if (e.currentTarget.checked)
            {
                ifStack_ShiftAllOlder_IframeBuffer();
            }
            else
            {
                smart_AwaitingBtn_Dispatch_ActiveCheck();
                AwaitingBtn_VisualFeedback(false, false);
            }
        });


        iframe_buffer_slider.addEventListener('click', () => ifStack_ShiftAllOlder_IframeBuffer());
        iframe_buffer_slider.addEventListener('wheel', () => ifStack_ShiftAllOlder_IframeBuffer());

        function Initial_synergy_btns()
        {
            // one or the other bud, i dunno what to tell you
            if (initialCheck_awaitngBtn)
            {
                toggleBtn_VS(true, TryingBtn_VisualFeedback);
            }
            else if (try_to_load_on_intersection_beta.checked)
            {
                toggleBtn_VS(true, AwaitingBtn_VisualFeedback);
            }
        }
    }
    //#endregion


    //#region 4. BIG BOI FUNCTION - change the funcionality of the extension
    async function MasterObserver_UCS_RTM()
    {
        const { suspend_yt_gif_deployment, deploy_yt_gifs } = UI.deploymentStyle;

        const checkMenu = suspend_yt_gif_deployment;


        const checkMenuParent = checkMenu.parentElement;
        const labelCheckMenu = checkMenu.previousElementSibling;
        //#region labelCheckMenu utils
        function islabel(str) { return labelCheckMenu.innerHTML == str; }
        function labelTxt(str) { return labelCheckMenu.innerHTML = str; }
        //#endregion


        const { dropdown__hidden, dropdown_deployment_style, dwp_message } = cssData;
        const subHiddenDDM = document.querySelector(`.${dropdown__hidden}.${dropdown_deployment_style}`);
        const subHiddenDDM_message = subHiddenDDM.querySelector(`.${dwp_message}`);


        const subMenuCheck = deploy_yt_gifs;
        const subMenuCheckParent = subMenuCheck.parentElement;
        //#region checkboxes utils
        const DeployCheckboxes = [checkMenu, subMenuCheck];
        function DeployCheckboxesDisabled(b) { DeployCheckboxes.forEach(check => check.disabled = b) }
        function DeployCheckboxesChecked(b) { DeployCheckboxes.forEach(check => check.checked = b) }
        //#endregion


        //animations css classes
        const { dwn_no_input, dropdown_fadeIt_bg_animation, dropdown_forbidden_input, dropdown_allright_input } = cssData;
        const noInputAnimation = [dwn_no_input]
        const baseAnimation = [dropdown_fadeIt_bg_animation, ...noInputAnimation];
        const redAnimationNoInputs = [...baseAnimation, dropdown_forbidden_input];
        const greeAnimationInputReady = [...baseAnimation, dropdown_allright_input];


        // start with default values
        const deployInfo = {
            suspend: `Suspend Observers`,
            deploy: `Deploy Observers`,
            discharging: `** Disconecting Observers **`,
            loading: `** Setting up Observers **`,
        }
        labelCheckMenu.innerHTML = deployInfo.suspend;



        // 1.
        checkMenu.addEventListener('change', handleAnimationsInputRestriction);
        // 2.
        subMenuCheck.addEventListener('change', handleSubmitOptional_rm_comp);



        // 1.1
        async function handleAnimationsInputRestriction(e)
        {
            if (checkMenu.checked)
            {
                if (islabel(deployInfo.suspend))// 1.1.1
                {
                    await redAnimationCombo(); //after the 10 seconds allow inputs again
                }
                else if (islabel(deployInfo.deploy)) // 1.1.2
                {
                    await greenAnimationCombo();
                }
            }
        }


        // 1.1.1
        async function redAnimationCombo()
        {
            labelTxt(deployInfo.discharging);
            isVisualFeedbackPlaying(false)
            window.YT_GIF_OBSERVERS.CleanMasterObservers();
            await restricInputsfor10SecMeanWhile(redAnimationNoInputs); //showing the red animation, because you are choosing to suspend
            labelTxt(deployInfo.deploy);
        }

        // 1.1.2
        async function greenAnimationCombo()
        {
            rm_components.ChargeMasterObserversWithValidDeploymentStyle()
            labelTxt(deployInfo.loading); //change label to suspend
            isVisualFeedbackPlaying(true)
            await restricInputsfor10SecMeanWhile(greeAnimationInputReady);
            labelTxt(deployInfo.suspend);
        }



        /* ****************** */
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
        /* ****************** */


        // 2.1
        async function handleSubmitOptional_rm_comp(e)
        {
            if (subMenuCheck.checked && (islabel(deployInfo.deploy)))
            {
                await greenAnimationCombo();
            }
        }
    }
    //#endregion


    //#region 5. Setting up tutorials
    function SettingUpTutorials()
    {
        const { icon, mainDDM, mainMenu } = GetMainYTGIFicon(ddm_icon);


        const mainDDMdisplay = (d) => mainDDM.style.display = d;
        const canCloseMenu = () => !mainDDM.classList.contains(ddm_focus) && !mainMenu.matches(':hover');
        const tryToCloseMenu = () => canCloseMenu() ? mainDDMdisplay('none') : null;
        const openMenu = () => mainDDMdisplay('flex');
        const iconIsPulsing = (bol) => UTILS.toggleClasses(bol, [cssData.dwn_pulse_anim], icon);


        // if the user entered/initizlied/played the tutorial,
        // the ddm won't be closed until it losses focus,
        // conventionally clicking anything but the ddm/ddm-children
        mainDDMdisplay('none');
        mainMenu.addEventListener('mouseenter', () => openMenu());
        mainMenu.addEventListener('mouseleave', () => tryToCloseMenu());
        icon.addEventListener('blur', () => tryToCloseMenu());


        let previousValue = mainDDM.style.display; // changes inside style_cb
        const config = { attributes: true };
        const observer = new MutationObserver(mainDDMstyle_cb); // when closed, clean tutorials -> wrappers
        observer.observe(mainDDM, config);


        const tutContArr = [document.querySelector("#yt-gif-tutorial-container--update")].filter(el => el != null) // trying to make it modular
        let atLeastOne = false;
        for (const tutCont of tutContArr)
        {
            DDM_onlyOneTut(tutCont);
            atLeastOne = true;
        }

        if (atLeastOne && UTILS.hasOneDayPassed_localStorage('yt_gif_icon_update_available'))
        {
            // one pulse per day -  to show that there are updates
            iconIsPulsing(true);
            setTimeout(() => iconIsPulsing(false), 3000);
        }


        function DDM_onlyOneTut(updateCont)
        {
            const updateCont_content = updateCont.querySelector('.dropdown-content');
            const updateTutParents = [updateCont_content, mainDDM];


            const { classToObserve } = rm_components.yt_gif_tut;
            const { forceAwaiting } = attrInfo.creation;
            let tutWrapperAwaiting = null;

            updateCont.addEventListener('mouseenter', deployTutorialVideo);
            icon.addEventListener('blur', () => toggleFocusOnDMMsparents(false));


            async function deployTutorialVideo(e)
            {
                if (e.currentTarget.querySelector('.yt-gif-wrapper')) // video already deployed
                    return;

                const tutWrapper = e.currentTarget.querySelector('[data-target]');

                tutWrapperAwaiting = await onYouTubePlayerAPIReady(tutWrapper, classToObserve, forceAwaiting, 'testing manual ty gif tutorial');

                tutWrapperAwaiting.addEventListener('mouseenter', () => icon.dispatchEvent(new Event('click')));
                tutWrapperAwaiting.addEventListener('mouseleave', () => toggleFocusOnDMMsparents(true));


                tutWrapperAwaiting.addEventListener('mouseenter', (e) => toggle_VisualFeedback(e, false));
                tutWrapperAwaiting.addEventListener('mouseleave', (e) => toggle_VisualFeedback(e, true));
            }

            function toggleFocusOnDMMsparents(toggle = true)
            {
                for (const el of updateTutParents)
                {
                    UTILS.toggleClasses(toggle, [ddm_focus], el);
                }

                if (toggle)
                {
                    icon.dispatchEvent(new Event('click'));
                }
            }

            function toggle_VisualFeedback(e, bol)
            {
                UTILS.toggleClasses(bol, [cssData.ddn_tut_awaiting], e.currentTarget);
            }
        }
        function mainDDMstyle_cb(mutationList)
        {//https://stackoverflow.com/questions/37168158/javascript-jquery-how-to-trigger-an-event-when-display-none-is-removed#:~:text=11-,Here%20we%20go,-var%20blocker%20%20%3D%20document
            // observers for computed styles... -it needs to be a thing... 🙃
            mutationList.forEach(function (record)
            {
                if (record.attributeName !== 'style')
                    return;

                const currentValue = record.target.style.display;
                const displayWas = (d) => previousValue === d && currentValue !== d;

                if (currentValue !== previousValue)
                {
                    if (displayWas('flex'))
                    {
                        // sometimes you just want to see the world burn
                        const cleanedWrappers = [...(mainDDM).querySelectorAll('iframe')]
                            .map(el => el.closest('[data-target]'))
                            .filter(el => el != null)
                            .forEach(el =>
                            {
                                el.removeAttribute('class'); // target classes
                                el = UTILS.RemoveAllChildren(el);
                            });
                    }

                    previousValue = record.target.style.display;
                }
            });
        }
    }
    //#endregion


    //#region local utils
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
    const visible = UTILS.inViewportElsHard(AvoidAllZoomChilds());
    for (const component of visible)
    {
        YTplayerReady_cb(component, 'first wave');
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


    function YTplayerReady_cb(component, message)
    {
        onYouTubePlayerAPIReady(component, targetClass, component.getAttribute(attrInfo.creation.name), message);
    }
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
                    YTplayerReady_cb(iterator, message);
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
async function onYouTubePlayerAPIReady(wrapper, targetClass, dataCreation, message = 'I dunno')
{
    if (message == 'testing manual ty gif tutorial')
    {
        console.log(message);
        //debugger;
    }
    if (!wrapper || !wrapper.parentNode) return;



    // 1. search and get urlIndex and uid
    const { url, accUrlIndex, uid, grandParentBlock } = await tempUidResultsObj(wrapper);

    // 1.1 don't add up false positives
    if (!url || accUrlIndex < 0 || !uid)
    {
        UIDtoURLInstancesMapMap.delete(uid);
        console.log(`YT GIF - Couldn't find ${accUrlIndex}th yt-gif component within the block ((${uid}))`);
        return;
    }
    const newId = iframeIDprfx + Number(++window.YT_GIF_OBSERVERS.creationCounter);



    // 2.1 OnPlayerReady video params point of reference
    allVideoParameters.set(newId, urlConfig(url));
    const configParams = allVideoParameters.get(newId);

    // 2.2 target's point of reference
    const record = JSON.parse(JSON.stringify(sesionIDs));
    sesionIDs.uid = uid;
    const blockID = grandParentBlock.id + properBlockIDSufix(url, accUrlIndex);
    if (blockID != null)
        recordedIDs.set(blockID, record);



    // 4. the div that the YTiframe will replace
    if (wrapper.tagName != 'DIV')
        wrapper = UTILS.ChangeElementType(wrapper, 'div');
    wrapper.parentElement.classList.add(`${cssData.yt_gif_wrapper}-parent`);
    wrapper.className = `${cssData.yt_gif_wrapper} dont-focus-block`;
    wrapper.setAttribute(attrInfo.target, targetClass);
    wrapper.setAttribute(attrInfo.creation.name, dataCreation);
    wrapper.setAttribute(attrInfo.url.path, url);
    wrapper.setAttribute(attrInfo.url.index, accUrlIndex);
    wrapper.innerHTML = '';
    wrapper.insertAdjacentHTML('afterbegin', links.html.fetched.playerControls);
    wrapper.querySelector('.yt-gif-player').id = newId;



    // 5. clean url map when removed from DOM
    const options = {
        el: grandParentBlock?.querySelector('span'),
        OnRemmovedFromDom_cb: () => UIDtoURLInstancesMapMap.delete(uid),
    }
    UTILS.ObserveRemovedEl_Smart(options); // Expensive? think so. Elegant? no, but works



    // 6. 
    if (dataCreation == attrInfo.creation.forceAwaiting || isValid_Awaiting_check())
    {
        return await DeployYT_IFRAME_OnInteraction();
    }
    else
    {
        return DeployYT_IFRAME();
    }



    // 1. uidResultsObj
    async function tempUidResultsObj(el)
    {
        const closestBlockID = (x) => x?.closest('.rm-block__input');
        const grandParentBlock = function () { return closestBlockID(this.el) };
        const grandParentPopOver = function () { return document.querySelector("div.bp3-popover-content > .rm-alias-tooltip__content") };
        const uidFromGrandParent = function () { return this.uid = this.grandParentBlock()?.id?.slice(-9) };
        const targetSelector = [[...rm_components.both.classesToObserve].map(x => '.' + x), '.yt-gif-wrapper', 'a.rm-alias.rm-alias--block'].join();
        const tempUrlObj = {
            urlComponents: function () { return [...this.grandParentBlock().querySelectorAll(this.targetSelector)] },
            getUrlIndex: function () { return this.urlComponents().indexOf(this.el) },
        }


        const uidResults = { /* a class makes the most sense here, but they're so similar, yet so different, and it only happens once at the time I hope... */
            'base-block': {
                uid: null, url: null, el,
                condition: uidFromGrandParent,
                targetSelector,
                grandParentBlock,
            },
            'popover': {
                uid: null, url: null, el: document.querySelector('.bp3-popover-target.bp3-popover-open > a.rm-alias.rm-alias--block'),
                condition: uidFromGrandParent,
                targetSelector,
                grandParentBlock: function () { return closestBlockID(document.querySelector('.bp3-popover-open')) },//grandParentPopOver,
            },
            'ddm-tutorial': {
                uid: 'irrelevant-uid', url: null, el,
                condition: function () { return this.url = this.el.getAttribute(attrInfo.url.path) },
                targetSelector: ['[data-video-url]'].join(),
                grandParentBlock: function () { return this.el.closest('.dwn-yt-gif-player-container') },
            },
        }
        Object.keys(uidResults).forEach(key => Object.assign(uidResults[key], tempUrlObj));
        const key = Object.keys(uidResults).find(x => uidResults[x].condition());
        if (!key) return {};


        const resObj = {
            uid: uidResults[key].uid,
            preUrlIndex: uidResults[key].getUrlIndex(),
            accUrlIndex: 0,
            url: uidResults[key].url,
            grandParentBlock: uidResults[key].grandParentBlock(),
        }


        if (key == 'ddm-tutorial')
        {
            return resObj;
        }


        if (key == 'popover')  
        {
            // needs it's own UID                                   // is it's parent's
            resObj.uid = extractFromMap_AtIndex(await getUrlMap_smart(uidResults[key].uid), resObj.preUrlIndex);
            uidResults['base-block'].grandParentBlock = grandParentPopOver; // once there (abstract enough to borrow functionalities)
            resObj.accUrlIndex += resObj.preUrlIndex;
            resObj.preUrlIndex = uidResults['base-block'].getUrlIndex(); // it also needs it's own urlIndex
        }


        resObj.url = extractFromMap_AtIndex(await getUrlMap_smart(resObj.uid), resObj.preUrlIndex);
        resObj.accUrlIndex += resObj.preUrlIndex;
        if (!resObj.url || !resObj.url.includes('http')) return {};
        return resObj;


        async function getUrlMap_smart(uid)
        {
            // since it store recursive maps, once per instance it's enough
            try
            {
                if (!uid) throw new Error('uid is null');
                if (!UIDtoURLInstancesMapMap.has(uid))
                    UIDtoURLInstancesMapMap.set(uid, await getUrlMap(uid)); // a map inside a map 🤯
                return UIDtoURLInstancesMapMap.get(uid);
            } catch (error)
            {
                console.log(error);
                return null;
            }
        }
        function extractFromMap_AtIndex(map, valueAtIndex, indexToCheck)
        {
            if (!map) debugger;
            let val = [...map.values()][valueAtIndex];
            if (!val) debugger;
            return val;
        }
        async function getUrlMap(tempUID)
        {
            let indentFunc = 0;
            let componentsInOrderMap = new Map();


            const orderObj = {
                order: -1,
                incrementIf: function (condition) { return condition ? Number(++this.order) : 'ﾠ' },
                condition: (x) => false,
            };
            const results = { /* the order does matter */
                'has components aliases': { tone: '#37d5d6' },
                'has components': { tone: '#36096d' },
                'has any aliases': { tone: '#734ae8' },
                'has any components': { tone: '#21d190' },

                'is component': { tone: '#20bf55' },
                'is alias': { tone: '#bfe299' },
                'is block referece': { tone: 'green' },
                //'is alias component': { tone: 'LightGreen' },
            };
            Object.keys(results).forEach(key => Object.assign(results[key], orderObj));


            const FirstObj = await TryToFindURL_Rec(tempUID);
            return componentsInOrderMap;


            async function TryToFindURL_Rec(uid, parentObj)
            {
                const objRes = await TryToFindURL(uid);


                results['has components aliases'].condition = () => parentObj?.innerAliasesUids?.includes(uid) && (!!objRes.urls?.[0]);
                results['has any aliases'].condition = () => objRes?.innerAliasesUids.length > 0;
                results['has components'].condition = () => objRes.components.length > 0;
                const hasKey = Object.keys(results).filter(x => x.includes('has')).find(x => results[x].condition());
                objRes.hasKey = hasKey;


                //console.log("%c" + cleanIndentedBlock(), `color:${results[hasKey]?.tone || 'black'}`);


                for (const i of objRes.urlsWithUids) // looping through RENDERED urls (components) and uids (references)
                {
                    results['is component'].condition = () => objRes?.urls.includes(i);
                    results['is alias'].condition = () => objRes?.innerAliasesUids.includes(i);
                    results['is block referece'].condition = () => objRes?.blockReferencesAlone.includes(i);


                    const isKey = Object.keys(results).filter(x => x.includes('is')).find(x => results[x].condition());
                    const parentKeysArentAlias = !parentObj?.isKey?.includes('alias') && !parentObj?.hasKey?.includes('alias');
                    const AtLeast = (arr) => arr.find(w => w === isKey);


                    if (
                        (parentKeysArentAlias && i != tempUID) // unrendered -> pass
                        || AtLeast(['is component']) // urls (components) -> go
                    )
                    {
                        if (AtLeast(['is alias', 'is component']))
                        {
                            componentsInOrderMap.set(assertUniqueKey_while(uid, indentFunc, isKey, hasKey), i);
                        }
                    }


                    if (isKey == 'is block referece')// it is rendered, so execute it's rec func
                    {
                        await ExecuteIndented_Rec(isKey, i);
                    }
                }

                return { uid, objRes, parentObj };


                async function ExecuteIndented_Rec(isKey, i)
                {
                    indentFunc += 1;
                    objRes.isKey = isKey;
                    const awaitingObj = await TryToFindURL_Rec(i, objRes);
                    indentFunc -= 1;
                }

                function assertUniqueKey_while(uid, indent, isKey, hasKey)
                {
                    // the order in which the components are rendered within the block
                    const keyAnyComponetInOrder = results['has any components'].incrementIf(UTILS.includesAtlest(['has components', 'has components aliases'], hasKey, null));
                    const keyInComponentOrder = results['has components'].incrementIf(hasKey === 'has components');
                    const keyInAliasComponentOrder = results['has components aliases'].incrementIf(hasKey === 'has components aliases');

                    const keyIsAlias = results['is alias'].incrementIf(isKey === 'is alias');
                    const keyIsComponent = results['is component'].incrementIf(isKey === 'is component');
                    const keyIsBlockRef = results['is block referece'].incrementIf(isKey === 'is block referece');

                    const baseKey = [indent, uid, hasKey, keyAnyComponetInOrder, keyInComponentOrder, keyInAliasComponentOrder, isKey, keyIsBlockRef, keyIsComponent, keyIsAlias];

                    let similarCount = 0; // keep track of similarities
                    const preKey = () => [similarCount, ...baseKey, 'ﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠ'].join(' - ');
                    let uniqueKey = preKey();


                    while (componentsInOrderMap.has(uniqueKey))
                    {
                        debugger;
                        similarCount += 1; // try to make it unique
                        uniqueKey = preKey();
                    }
                    similarCount = 0;

                    //return { uniqueKey, original: preKey(), isKey, hasKey };
                    return uniqueKey
                }

                function cleanIndentedBlock()
                {
                    const tab = '\t'.repeat(indentFunc);
                    const cleanLineBrakes = objRes.string.replace(/(\n)/gm, ". ");
                    const indentedBlock = tab + cleanLineBrakes.replace(/.{70}/g, '$&\n' + tab);
                    return indentedBlock;
                }
            }


            async function TryToFindURL(desiredUID)
            {
                const info = await RAP.getBlockInfoByUID(desiredUID);
                const rawText = info[0][0]?.string || "F";

                const urlRgx = /(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(.*?(?=\s|\}|\]|\)))/;
                const string = rawText.replace(/(`.*?`)/g, 'used_to_be_an_inline_code_block');

                // {{[[component]]: xxxyoutube-urlxxx }}
                const components = [...string.matchAll(/{{(\[\[)?((yt-gif|video))(\]\])?.*?(\}\}|\{\{)/gm)].map(x => x = x[0]) || [];
                // (((xxxuidxxx))) || ((xxxuidxxx))
                const innerUIDs = string.match(/(?<=\(\()([^(].*?[^)])(?=\)\))/gm) || [];
                // [xxxanything goesxxx](((xxxuidxxx)))
                const aliasesPlusUids = [...string.matchAll(/\[(.*?(?=\]))]\(\(\((.*?(?=\)))\)\)\)/gm)];

                // componets with uids // set in the order in which roam renders them
                const urlsWithUids = [...[...string.matchAll(/{{(\[\[)?((yt-gif|video))(\]\])?.*?(\}\}|\{\{)|(?<=\(\()([^(].*?[^)])(?=\)\))/gm)]
                    .map(x => x = x[0])]
                    .map(x => components.includes(x) ? x = x.match(urlRgx)?.[0] : x);
                // uid aliases alone
                const innerAliasesUids = [...aliasesPlusUids].map(x => x = x[2]) || []; // [xxnopexxx]('((xxxyesxxx))')

                // uid block references alone
                const blockReferencesAlone = innerUIDs?.filter(x => !innerAliasesUids.includes(x));



                let urls = [];
                for (const i of components)
                {
                    // xxxyoutube-urlxxx
                    urls = UTILS.pushSame(urls, i.match(urlRgx)?.[0]);
                }

                return { uid: desiredUID, components, urls, innerUIDs, urlsWithUids, aliasesPlusUids, innerAliasesUids, blockReferencesAlone, string, info };
            };
        }
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
        else { console.warn(`${newId}    Invalid youtube url detected for yt-gifs ${((uid))}`); }
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
//
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
//
async function onPlayerReady(event)
{
    const t = event.target;
    const key = t.h.id;

    const getParent = (i) => i.closest('.' + cssData.yt_gif_wrapper) || i.parentElement;
    const getBlockID = (iframe) => closestYTGIFparentID(iframe) + getWrapperUrlSufix(getParent(iframe))

    const iframe = document.getElementById(key) || t.getIframe();
    const parent = getParent(iframe);

    const map = allVideoParameters.get(key); //videoParams
    const start = map?.start || 0;
    const end = map?.end || t.getDuration();
    const clipSpan = end - start;
    const speed = map?.speed || 1;
    const entryVolume = validVolumeURL();
    const tickOffset = 1000 / speed;

    const blockID = getBlockID(iframe);
    const canBeCleanedByBuffer = UTILS.closestBlockID(iframe);
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
        // 🚧? because, this object/functionalities are only relevant when it's iframe destroyed ≡ or when the script goes full cricle... Hmmmm?
        const sesion = lastBlockIDParameters.get(blockID);
        RunWithPrevious_TimestampStyle(sesion, previousTimestamp);
        RunWithPrevious_VolumeStyle(sesion, previousVolume);
    }



    // 2. play style | pause style
    ToggleStyles_EventListeners(true);



    // 3. Mouse over the frame functionality
    parent.addEventListener('mouseenter', InAndOutHoverStatesDDMO);
    parent.addEventListener('mouseleave', InAndOutHoverStatesDDMO);



    // 4. scroll wheel - timestamp display feature
    timeDisplay.addEventListener('wheel', BoundWheelValueToSeek);
    timeDisplay.addEventListener('mouseenter', ContinuouslyUpdateTimeDisplay);
    timeDisplay.addEventListener('mouseleave', ClearTimers);



    // 5. fullscreenStyle
    iframe.addEventListener('fullscreenchange', fullscreenStyle_Handler);
    iframe.addEventListener('fullscreenchange', fullscreenAutoplaySynery_Handler);



    // 6. store relevant elements with event event listeners to clean them later
    const withEventListeners = [parent, parent.parentNode, timeDisplay, iframe]; // ready to be cleaned



    // 7. clean data and ready 'previous' paramaters for next sesion with IframeRemmovedFromDom_callback
    const options = {
        el: iframe,
        OnRemmovedFromDom_cb: IframeRemmovedFromDom_callback,
    }
    UTILS.ObserveRemovedEl_Smart(options); // Expensive? think so. Elegant? no, but works



    // 8. Performance Mode - Iframe Buffer & Initalize on interaction - synergy
    if (canBeCleanedByBuffer && parent) // sometimes the parent is already gone - while loading iframes
    {
        const parentCssPath = UTILS.getUniqueSelectorSmart(parent);
        PushNew_ShiftAllOlder_IframeBuffer(parentCssPath);
    }



    // 9. 'auto pause' when an iframe goes out the viewport... stop playing and mute
    const yConfig = { threshold: [0] };
    const ViewportObserver = new IntersectionObserver(PauseOffscreen_callback, yConfig);
    ViewportObserver.observe(iframe);



    // 10. well well well - pause if user doesn't intents to watch
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
        else if (start_timestamp.checked && isBounded(sesion.updateTime))
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
    function ToggleStyles_EventListeners(bol = false)
    {
        // hmmmm... Mainly because of CleanLoadedWrappers... UI is window.YT_GIF_OBSERVERS.UI | timestamps persist this way
        for (const p in UI.playStyle)
        {
            UI.playStyle[p] = Flip(UI.playStyle[p], playStyleDDMO);
        }
        for (const m in UI.muteStyle)
        {
            UI.muteStyle[m] = Flip(UI.muteStyle[m], muteStyleDDMO);
        }
        function Flip(binaryInput, styleDDMO = () => { })
        {
            if (binaryInput.tagName)
            {
                if (bol)
                    binaryInput.addEventListener('change', styleDDMO);
                else
                    binaryInput.removeEventListener('change', styleDDMO);
            }

            return binaryInput;
        }
    }
    /* ********** */
    function playStyleDDMO()
    {
        if (!UTILS.isElementVisible(iframe)) return; //play all VISIBLE Players, this will be called on all visible iframes

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
        if (!UTILS.isElementVisible(iframe)) return; //mute all VISIBLE Players, this will be called on all visible iframes

        if (UI.muteStyle.strict_mute_everything_except_current.checked || UI.muteStyle.muted_on_any_mouse_interaction.checked)
        {
            isSoundingFine(false);
        }
    }
    //#endregion


    //#region 3. hover over the frame - mute | pause
    function InAndOutHoverStatesDDMO(e)
    {
        //🌿
        if (e.type == 'mouseenter')
        {
            t.__proto__.globalHumanInteraction = true; // I'm afraid this event is slower to get attached than 200ms intervals... well 

            togglePlay(true);


            if (UI.muteStyle.strict_mute_everything_except_current.checked)
            {
                if (anyValidInAndOutKey(e))
                {
                    MuteEveryPlayer_Visibly();
                }
            }
            if (UI.playStyle.strict_play_current_on_mouse_over.checked)
            {
                PauseAllOthersPlaying_Visibly();
            }


            if (CanUnmute())
            {
                isSoundingFine();
            }
            else if (UI.muteStyle.muted_on_mouse_over.checked)
            {
                isSoundingFine(false);
            }
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
    /* ************************************************* */
    function MuteEveryPlayer_Visibly()
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
        };

        LoopTroughVisibleYTGIFs(config);
    }
    function PauseAllOthersPlaying_Visibly()
    {
        const config = {
            styleQuery: ytGifAttr.play.playing,
            others_callback: (id, el) =>
            {
                PlayIs(ytGifAttr.play.paused, el);
                recordedIDs.get(id)?.target?.pauseVideo();
            }
        };
        LoopTroughVisibleYTGIFs(config);
    }
    /* ********************** */
    function LoopTroughVisibleYTGIFs(config = { styleQuery, others_callback: () => { }, self_callback: () => { } })
    {
        const ytGifs = UTILS.inViewportElsHard(UTILS.allIframeStyle(config?.styleQuery));
        for (const i of ytGifs) // loop through all the iframes within the viewport, not just an instance
        {
            if (i != iframe)
            {
                config?.others_callback(getBlockID(i), i);
            }
            else if (config.self_callback)
            {
                config?.self_callback(getBlockID(i), i);
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


        function fmtMSS(seconds)
        {
            const format = val => `0${Math.floor(val)}`.slice(-2);
            const hours = seconds / 3600;
            const minutes = (seconds % 3600) / 60;
            const displayFormat = hours < 1 ? [minutes, seconds % 60] : [hours, minutes, seconds % 60];

            return displayFormat.map(format).join(':');
        }
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
        return isTimeDisplayHover() || isParentHover();
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
    function fullscreenAutoplaySynery_Handler(e)
    {
        if (document.fullscreenElement)
        {
            PauseAllOthersPlaying_Visibly();
        }
        else if (UI.playStyle.visible_clips_start_to_play_unmuted.checked)
        {
            UI.playStyle.visible_clips_start_to_play_unmuted.dispatchEvent(new Event('change'));
        }
    }
    //#endregion


    //#region 7. on destroyed - clean up and ready next session
    function IframeRemmovedFromDom_callback(observer)
    {
        // expensive for sure 🙋
        UTILS.RemoveElsEventListeners(withEventListeners);
        ToggleStyles_EventListeners(false);




        //🚧 UpdateNextSesionValues
        const media = JSON.parse(JSON.stringify(videoParams));
        media.src = getWrapperUrlSufix(parent);
        media.id = map.id;
        media.updateTime = isBounded(tick()) ? tick() : start;
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
        t.__proto__.enter = () => { };

        if (canBeCleanedByBuffer)
        {
            ifStack_ShiftAllOlder_IframeBuffer();
        }


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


    //#region 9. pause on off screen
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


    //#region 10. last - let me watch would you
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
                    if (t.__proto__.globalHumanInteraction) // user wants to listen, don't interrupt
                    {
                        videoIsPlayingWithSound(true);
                    }
                    else if (UTILS.isElementVisible(iframe) && !t.__proto__.globalHumanInteraction)
                    {
                        togglePlay(UI.playStyle.visible_clips_start_to_play_unmuted.checked); // pause?
                    }
                    else if (!isParentHover())
                    {
                        togglePlay(false); // pause
                    }

                    if (!isParentHover() && (t.getPlayerState() === 1)) // if mouse is outside parent and video is playing
                    {
                        togglePlay(false); // FREEZE!!!
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


    /* ****************************************************** */


    //#region target utils
    function seekToUpdatedTime(desiredTime)
    {
        updateStartTime = desiredTime;
        t.seekTo(updateStartTime);
    }
    function tick(target = t)
    {
        return target?.getCurrentTime();
    }
    //#endregion


    //#region validate - check values utils
    function isBounded(x)
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
    function CanUnmute()//NotMuteAnyHover
    {
        return !UI.muteStyle.muted_on_mouse_over.checked && !UI.muteStyle.muted_on_any_mouse_interaction.checked
    }
    //#endregion


    //#region play/pause utils
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
    //#endregion


    //#region hover/interactions utils
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
    //#endregion


    //#region play/mute attr styles utils
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
                PlayEndSound(soundSrc);
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


    function PlayEndSound(url)
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
    function validSoundURL()
    {
        const src = window.YT_GIF_DIRECT_SETTINGS.get('end_loop_sound_src').sessionValue;
        if (UTILS.isValidUrl(src))
        {
            return src
        }
        return null
    }
}




//#region Performance Mode Utils
function PushNew_ShiftAllOlder_IframeBuffer(parentCssPath)
{
    if (parentCssPath)
        window.YT_GIF_OBSERVERS.masterIframeBuffer = UTILS.pushSame(window.YT_GIF_OBSERVERS.masterIframeBuffer, parentCssPath);

    ifStack_ShiftAllOlder_IframeBuffer(); // modifies and returns masterIframeBuffer
}
function ifStack_ShiftAllOlder_IframeBuffer()
{
    if (!UI.experience.iframe_buffer_stack.checked)
    {
        return null;
    }


    // work in pregress | by shifting/removing the first entry, you clean the most irrelevent YT GIF, and give space to new ones (to load, thus autoplay on mouseenter) when intersecting the website
    let arr = window.YT_GIF_OBSERVERS.masterIframeBuffer;
    const cap = parseInt(UI.range.iframe_buffer_slider.value, 10);
    const { displaced, buffer } = attrInfo.creation;



    if (isValid_TryIntersection_EnabledCheck())
    {
        // 2.
        arr = FitBuffer_OffScreen(arr, cap, displaced);
    }
    else
    {
        // 2. while...
        const { shiftedArr, atLeastOne, lastOne } = FitBuffer(arr, cap, buffer);
        arr = shiftedArr;
        // 2.1 mix and match
        if (atLeastOne || cap <= arr.length)
        {
            AwaitingBtn_Dispatch_ActiveCheck(true);
            AwaitingBtn_VisualFeedback(true);
        }
        else if (!atLeastOne || cap > arr.length)
        {
            smart_AwaitingBtn_Dispatch_ActiveCheck();
            AwaitingBtn_VisualFeedback(false, false);
        }
    }

    // 3. pass by value
    return window.YT_GIF_OBSERVERS.masterIframeBuffer = arr;


    function FitBuffer(arr, cap, creation)
    {
        let atLeastOne = false;
        let lastOne = null;
        let stop = arr.length + 0;
        let ini = 0; // most defenetly the very first one in the array

        // 1. try to clean wrappers
        while (arr.length > cap)
        {
            if (stop < 0)
                throw new Error('index out of bounds');

            lastOne = arr[ini];
            const wrapper = document.querySelector(lastOne);

            // 2. if wrapper is not on screen, remove it
            if (wrapper)
            {
                const newCreation = UTILS.isElementVisible(wrapper) ? attrInfo.creation.forceAwaiting : creation;
                CleanAndBrandNewWrapper(wrapper, attrInfo.creation.name, newCreation);
            }
            else
            {
                ini++;
            }

            // 3. shift last one anyways
            arr.shift(lastOne);
            atLeastOne = true;

            stop--;
        }

        arr = [...new Set(arr)]; // remove duplicates
        arr = arr.filter(sel => document.querySelector(sel) != null); // remove any that are no longer in the DOM

        return { shiftedArr: arr, atLeastOne, lastOne };
    }
    function FitBuffer_OffScreen(arr, cap, creation)
    {
        // 0. work very much in progress....
        const anyLoaded = document.querySelectorAll('.yt-gif-wrapper');
        const options = { root: null, threshold: 0.1 }// set offset 0.1 means trigger if atleast 10% of element in viewport

        if (anyLoaded.length < cap)
            return arr;

        // 1. loop through all loaded iframes to see if they are off screen and if so, remove them
        for (let i = 0; i < anyLoaded.length; i++)
        {
            const observer = new window.IntersectionObserver(OffScreen_cb, options); // 1.1
            observer.observe(anyLoaded[i]);
            return arr;
        }

        return arr;


        function OffScreen_cb([entry], observer)
        {
            if (entry.isIntersecting)
                return arr;

            // 1.1 not in viewport, remove it
            const { shiftedArr } = FitBuffer(arr, cap, creation);
            arr = shiftedArr;

            observer.disconnect();

            return window.YT_GIF_OBSERVERS.masterIframeBuffer = arr; // this can happen in the future...
        }
    }

}
function CleanAndBrandNewWrapper(wrapper_p, attr_name = attrInfo.creation.name, attr_value = '')
{
    const targetClass = wrapper_p.getAttribute(`${attrInfo.target}`);
    const parentSel = UTILS.getUniqueSelectorSmart(wrapper_p.parentNode);

    wrapper_p.parentNode.removeChild(wrapper_p);
    const div = UTILS.div([targetClass]);
    UTILS.toggleAttribute(true, attr_name, div, attr_value);
    document.querySelector(parentSel).appendChild(div);
    return div;
}

//#region visual feedback - checked - disabled - dispatch
function smart_AwaitingBtn_Dispatch_ActiveCheck()
{
    let validCheck = undefined;
    if (typeof userActiveChoice_awaitingBtn !== 'undefined')
    {
        validCheck = userActiveChoice_awaitingBtn;
    }
    else if (typeof initialCheck_awaitngBtn !== 'undefined')
    {
        validCheck = initialCheck_awaitngBtn;
    }

    if (typeof validCheck !== 'undefined')
    {
        return AwaitingBtn_Dispatch_ActiveCheck(validCheck);
    }

    return undefined;
}
function AwaitingBtn_Dispatch_ActiveCheck(bol)
{
    const { awaiting_for_mouseenter_to_initialize } = UI.experience;
    awaiting_for_mouseenter_to_initialize.disabled = bol;
    awaiting_for_mouseenter_to_initialize.checked = bol;

    return awaiting_for_mouseenter_to_initialize;
}
/* *********************** */
function isValid_TryIntersection_EnabledCheck()
{
    const { try_to_load_on_intersection_beta } = UI.experience;
    return isValid_TryIntersection_check() && !try_to_load_on_intersection_beta.disabled;
}
function isValid_TryIntersection_check()
{
    const { try_to_load_on_intersection_beta } = UI.experience;
    return try_to_load_on_intersection_beta.checked;// && !try_to_load_on_intersection_beta.disabled;
}
function isValid_Awaiting_check()
{
    const { awaiting_for_mouseenter_to_initialize } = UI.experience;
    // kinda spaghetti, but they are pretty much entangled and only one of those can be true at a time
    return awaiting_for_mouseenter_to_initialize.checked && !isValid_TryIntersection_check();
}
/* *********************** */
function TryingBtn_VisualFeedback(bol, disabled = undefined)
{
    const { try_to_load_on_intersection_beta } = UI.experience;

    return btn_VS(bol, try_to_load_on_intersection_beta, disabled);
}
function AwaitingBtn_VisualFeedback(bol, disabled = undefined)
{
    const { awaiting_for_mouseenter_to_initialize } = UI.experience;

    const clause = "Full stack Iframe Buffer has priority";
    UTILS.toggleAttribute(bol, 'data-tooltip', awaiting_for_mouseenter_to_initialize, clause);

    return btn_VS(bol, awaiting_for_mouseenter_to_initialize, disabled);
}
/* *********** */
function toggleBtn_VS(checked, VisualFeedback_cb = () => { }) 
{
    if (checked)
    {
        VisualFeedback_cb(true, true);
    }
    else
    {
        VisualFeedback_cb(false, false);
    }
}
function btn_VS(bol, exp_btn, disabled)
{
    const { ditem_allow } = cssData;

    UTILS.toggleClasses(bol, [ditem_allow], exp_btn.parentNode);

    if (typeof disabled !== 'undefined')
    {
        exp_btn.disabled = disabled; // spaghetti? Yes. Confusing. Kinda. But it works, as the btn names (semantics) suggest, maybe that's my problem.
    }

    return exp_btn;
}
//#endregion

//#endregion




//#region clossesYTGIFParent Utils
function closestYTGIFparentID(el)
{
    return (el?.closest('.rm-block__input') || el.closest('.dwn-yt-gif-player-container'))?.id
}
function getWrapperUrlSufix(wrapper)
{
    const url = wrapper.getAttribute(attrInfo.url.path);
    const urlIndex = wrapper.getAttribute(attrInfo.url.index);
    const urlSufix = properBlockIDSufix(url, urlIndex);
    return urlSufix;
}
function properBlockIDSufix(url, urlIndex)
{
    return '_' + [url, urlIndex].join('_');
}
//#endregion




/*

user requested ☐ ☑



I want to add ☐ ☑
    an inline editor for ajusting the litle miscalculations in the clips ☐
        a litle bit earlier, a litle bit after...
        and inplement the changes, when the user the user enter the real edit block mode
            🙋

    replace with awaiting for input/thumbnails
        when the frame gets lost while scrolling
        offer a margin of error / slider / how far away
            though the same functionallity can be achieved
            using the buffer, if you set it to 1 max

    the ability to let only one frame to keep playing with sound
        while exiting the frame
        the usage of two InAndOutKeys will do the trick


added
    visible_clips_start_to_play_unmuted synergy with fullscreenStyle ☑ ☑
        each does what they're suposed be doing
            when entering fullscreen mode
                pause everything but itself
            when exeting - if visible_clips_start_to_play_unmuted is eneabled
                fire the "change" event to adjust the settings once again

    bind event and update settings_page obj ☑ ☑
        and update the actual block on the actual page ☑ ☑

    delete useless src sound tags - player html ☑ ☑

    fixed settings buttn clases ☑ ☑

    create scroll iframe buffer amount in experience ☑ ☑

    re add yt icon on orientation change on mobile ☑ ☑
        limit the size to 24 px max - square ☑ ☑

    yt iframe customizable ui language ☑ ☑
        add yt_api customizable settings ✘

TODO ☐ ☑



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

    https://freesound.org/data/previews/35/35631_18799-lq.mp3 - roam research pomodoro * ding! *

    pause or mute when video plays with while using the inAndOutKeys ☐


Discarted
    shortcuts for any btn ✘
    all hoverable actions, after 500ms the item it's checked // and this feature own btn ofcourse ✘

    Refactoring mode, don't load the yt gif, in fact don't create the btn
        just show the user the raw text, so they don't have to go and re enter the block
            well... the don't load part is already implemented with the "deploymentStyle"
            Now-- the part of showin the text only... Hmmm...
                that would have to be a "yt-gif" component only...

    10 head big monkey brain roam idea boiiii ☐
        paste text form the yt gif browser extension to roam, if the exact same string
        already exist in the DB, a promt message will
            I see... but that's too intrusive though, even If I know exactly what's going on...
                it's the same as navegateToUIpage on a brand new installation.


Bugs
    hover a frame
        > mouse leave with sound
            > focus on another window
            > go back to roam & and mouse enter a new frame,
                both videos play unmuted even with
                strict_mute_everything_except_current enabled ☐
        work around
            > mouse enter a new frame holding middle mouse
            > mutes the previous, but the previous video still plays unmuted
             even though play_on_mouse_over enebled ☐


    sometimes and specially after CleanLoadedWrappers
        they begin to play after loadingMarginOfError...
            It's extremely rare, but it happens
            Which means it's so hard to catch why and where it happens
            Is very annoying

    the weird recursive func doesn't work on block refereces - uids ((0UN_kefSF))
        plus the persistent timestamp doen't work as expected


Fixed
     videoParams ☑ ☑
        default volume is mistaken as string ☑ ☑
            it should be an integer


bugs that fixed themselves
    initizlizing any video
        it's volume is 100 always - lol, it works as expected right now

*/