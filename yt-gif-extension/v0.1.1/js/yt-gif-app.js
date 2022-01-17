// restricting features ⛔ -> YT_GIF_SETTINGS_PAGE
// restoring/modifying features 🧼
// version 39 - semi-refactored
/**
 * @summary USER INPUTS
 * @type Object
 * @description WILL NOT CONTAIN NESTED OBJECTS, it will read 'strings' as guides then acustom to them, all inside the Ready() function.
 * It's property types will change.
 * - nested object >>> sesionValue
*/
const UI = JSON.parse(JSON.stringify(window.YTGIF));//JSON.parse(JSON.stringify(window.YT_GIF_SETTINGS_PAGE));
const UTILS = window.kauderk.util;
const RAP = window.kauderk.rap; // 🧼
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
UI.dropdownMenu = { // 🧼
    ddm_css_theme_input: '',
}
UI.playerSettings = { // 🧼
    play_style: 'strict',
    play_last_active_player_off_intersection: '1',
    mute_style: 'strict',
    url_boundaries: 'strict',
    url_volume: 'strict',
}
/*-----------------------------------*/
const iframeIDprfx = 'player_';
let currentFullscreenPlayer = null;
/*-----------------------------------*/
const YT_GIF_OBSERVERS_TEMP = {
    masterMutationObservers: [],
    masterIntersectionObservers: [],
    masterIntersectionObservers_buffer: [],
    masterIframeBuffer: [],
    //slashMenuObserver: null,
    timestampObserver: null,
    keyupEventHanlder: () => { },
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
    dmm_html: null,
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

    volume: UI.default.video_volume, // 🧼
    updateVolume: UI.default.video_volume, // 🧼
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
const YTGIF_Config = {
    componentPage: 'yt-gif|video',
    targetStringRgx: /https\:\/\/(www\.)?(youtu(be.com\/watch|.be\/))?(.*?(?=\s|$|\}|\]|\)))/,
    guardClause: (url) => typeof url === 'string' && url.match('https://(www.)?youtube|youtu\.be'),
}
const UIDtoURLInstancesMapMap = new Map(); // since it store recursive maps, once per instance it's enough
/*-----------------------------------*/
const urlFolder = (f) => `https://kauderk.github.io/yt-gif-extension/resources/${f}`;
const self_urlFolder = (f) => `https://kauderk.github.io/yt-gif-extension/v0.2.0/testing2/${f}`;
const urlFolder_css = (f) => urlFolder(`css/${f}`);
const urlFolder_html = (f) => urlFolder(`html/${f}`);
const urlFolder_js = (f) => urlFolder(`js/${f}`);
const links = {
    css: {
        dropDownMenuStyle: urlFolder_css('drop-down-menu.css'),
        playerStyle: urlFolder_css('player.css'),
        themes: {
            dark: urlFolder_css('themes/dark-drop-down-menu.css'),
            light: urlFolder_css('themes/light-drop-down-menu.css'),
            get: function (i) { return this.toogle(!UTILS.isTrue(i)) },
            toogle: function (t) { return UTILS.isTrue(t) ? this.dark : this.light },
        }
    },
    html: {
        dropDownMenu: self_urlFolder('html/drop-down-menu.html'),
        playerControls: self_urlFolder('html/player-controls.html'),
        urlBtn: self_urlFolder('html/url-btn.html'),
        fetched: {
            playerControls: '',
            urlBtn: '',
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
        toogle_theme: '#yt-gif-ddm-theme',
        ddm_main_theme: '#yt-gif-ddm-main-theme',
    }
}
const attrData = {
    // [data-main] -> [data-bind]
    'initialize-bg': '',
    'initialize-loop': '',
    'iframe-buffer': '',
    'timestamp-experience': '',
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
        page: 'video',
        classToObserve: 'rm-video-player__spacing-wrapper',
        BinaryDomUI: () => UI.deploymentStyle.deployment_style_video,
    },
    yt_gif: {
        description: '{{[[yt-gif]]}}',
        page: 'yt-gif',
        classToObserve: `rm-xparser-default-${cssData.yt_gif}`,
        BinaryDomUI: () => UI.deploymentStyle.deployment_style_yt_gif,
    },
    yt_gif_tut: {
        classToObserve: 'yt-gif-ddm-tutorial', /* TESTING */
    },
    state: {
        currentKey: '',
        initialKey: '',
        currentClassesToObserver: [],
    },
    currentTarget: function ()
    {
        const crr = this.state.currentKey;
        const tkey = (crr == 'both') ? 'yt_gif' : crr;
        //currentClassesToObserver = (crr == 'both') ? this[tkey].classToObserve;
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

        // 🍝 // 🍝 // 🍝
        this.state.currentClassesToObserver = (newKey == 'both') ? this[newKey].classesToObserve : [this[newKey].classToObserve];
        YTGIF_Config.componentPage = (newKey == 'both') ? 'yt-gif|video' : this[newKey].page;

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
    const { css_theme, player_span } = UI.default; // 🧼
    const { themes, playerStyle, dropDownMenuStyle } = links.css;
    const { playerControls, dropDownMenu } = links.html;
    const { yt_gif } = cssData; // CssThemes_UCS
    const { ddm_main_theme: ddm_main_theme_id } = cssData.id;
    //#endregion

    await smart_LoadCSS(dropDownMenuStyle, `${yt_gif}-dropDownMenuStyle`);
    await smart_LoadCSS(playerStyle, `${yt_gif}-playerStyle`);

    // ⛔ sessionValues 
    await smart_LoadCSS(themes.toogle(css_theme == 'dark'), `${yt_gif}-css-theme`); // UCS - user customizations
    await smart_CssPlayer_UCS(player_span);

    links.html.fetched.playerControls = await PlayerHtml_UCS(playerControls);

    await smart_Load_DDM_onTopbar(dropDownMenu); // DDM - drop down menu



    // 2. assign direct values to the main object | UI - user inputs
    DDM_to_UI_variables(); // filtering baseKey & prompts and transforming them from objs to values or dom els - it is not generic and only serves for the first indent level (from parent to child keys)
    // ⛔ SaveSettingsOnChanges(); // the seetings page script is responsable for everything, these are just events
    RESTRICT_FEATURES(); // ⛔ // 🧼 // ⛔ // 🧼 // ⛔ // 🧼 // ⛔ // 🧼


    // 3. set up events
    //#region relevant variables
    const { ddm_icon, ddm_focus, ddm_info_message_selector, dropdown__hidden, awaitng_input_with_thumbnail } = cssData;
    // const { timestamp_display_scroll_offset, end_loop_sound_volume, iframe_buffer_slider } = UI.range;
    // const { rangeValue, loop_volume_displayed, iframe_buffer_label } = UI.label;
    const { awaiting_with_video_thumnail_as_bg } = UI.experience;
    // const { iframe_buffer_stack, awaiting_for_user_input_to_initialize, try_to_load_on_intersection_beta } = UI.experience;
    // const { ddm_css_theme_input } = UI.dropdownMenu;
    //#endregion

    DDM_IconFocusBlurEvents(ddm_icon, ddm_focus, ddm_info_message_selector);

    DDM_FlipBindedDataAttr_RTM([dropdown__hidden], attrData); // RTM runtime

    // ⛔ UpdateOnScroll_RTM(timestamp_display_scroll_offset, rangeValue);
    // ⛔ UpdateOnScroll_RTM(end_loop_sound_volume, loop_volume_displayed);
    // ⛔ UpdateOnScroll_RTM(iframe_buffer_slider, iframe_buffer_label);

    TogglePlayerThumbnails_DDM_RTM(awaiting_with_video_thumnail_as_bg, awaitng_input_with_thumbnail);

    // ⛔ navigateToSettingsPageInSidebar();
    // ⛔ ToggleTheme_DDM_RTM(ddm_css_theme_input, themes, ddm_css_theme_stt, ddm_main_theme_id);

    // ⛔ IframeBuffer_AND_AwaitngToInitialize_SYNERGY_RTM(iframe_buffer_stack, awaiting_for_user_input_to_initialize, iframe_buffer_slider, try_to_load_on_intersection_beta);



    // 4. run extension and events - set up
    //#region relevant variables
    const { override_roam_video_component } = UI.default; // 🧼
    //#endregion

    await MasterObserver_UCS_RTM(); // listening for changes | change the behaviour RTM // BIG BOI FUNCTION

    rm_components.state.initialKey = rm_components.assertCurrentKey(override_roam_video_component);
    const { initialKey } = rm_components.state;
    rm_components[initialKey].checkSubDeploymentStyle(true); // start with some value
    rm_components.RunMasterObserverWithKey(initialKey);



    // 5. Setting up tutorials
    const { icon, mainDDM, mainMenu } = GetMainYTGIFicon(ddm_icon);

    // if the user entered/initizlied/played the tutorial,
    // the ddm won't be closed until it losses focus,
    // conventionally clicking anything but the ddm/ddm-children
    mainDDMdisplay('none');
    mainMenu.addEventListener('mouseenter', () => openCleanMenu());
    mainMenu.addEventListener('mouseleave', () => tryToCloseMenu());
    icon.addEventListener('blur', () => tryToCloseMenu());

    let previousValue = mainDDM.style.display; // changes inside style_cb
    const observer = new MutationObserver(mainDDMstyle_cb); // when closed, clean tutorials -> wrappers
    observer.observe(mainDDM, { attributes: true });

    SetUpSelectTurorials();
    SetUpTutorials_smartNotification();



    // 6. Emulate -> slash menu, timestamps + shortcuts
    //#region relevant variables
    // const slashObj = {
    //     targetClass: 'bp3-text-overflow-ellipsis',
    //     emulationClass: 'slash-menu-emulation',
    //     clone: null,
    // }
    // const componentClass = (page) => `bp3-button bp3-small dont-focus-block rm-xparser-default-${page}`;
    // const timestampObj = {
    //     roamClassName: 'rm-video-timestamp dont-focus-block',
    //     start: {
    //         page: 'start',
    //         targetClass: 'rm-xparser-default-start',
    //         buttonClass: componentClass('start'),
    //     },
    //     end: {
    //         page: 'end',
    //         targetClass: 'rm-xparser-default-end',
    //         buttonClass: componentClass('end'),
    //     },
    //     attr: {
    //         emulation: 'yt-gif-timestamp-emulation',
    //         timestampStyle: 'timestamp-style', // start or end
    //         timestamp: 'timestamp',
    //     },
    //     timestamp: {
    //         buttonClass: componentClass('timestamp'),
    //     },
    //     parent: {
    //         className: 'yt-gif-timestamp-parent',
    //     },
    // };

    // const { simulate_roam_research_timestamps } = UI.display;
    // ⛔ const { tm_shortcuts, tm_workflow_display } = UI.timestamps;

    let { timestampObserver, keyupEventHanlder } = window.YT_GIF_OBSERVERS;
    timestampObserver?.disconnect();
    // const targetNode = document.body;
    // const config = { childList: true, subtree: true };
    //#endregion

    // timestampObserver = new MutationObserver(TimestampBtnsMutation_cb);

    // 6.1 cleanAndSetUp_TimestampEmulation -> PlayPauseOnClicks
    // 6.2 run timestampObserver
    // 6.3 registerKeyCombinations (keyupEventHanlder)
    //      6.3.1 addBlockTimestamps
    // ⛔ toggleTimestampEmulation(simulate_roam_research_timestamps.checked);
    // ⛔ simulate_roam_research_timestamps.addEventListener('change', (e) => toggleTimestampEmulation(e.currentTarget.checked));
    // ⛔ tm_shortcuts.addEventListener('change', e => ToogleTimestampShortcuts(e.target.checked));
    // ⛔ tm_workflow_display.addEventListener('change', e => ChangeTimestamapsDisplay(e.currentTarget.value));


    // 7. simulate inline url btn
    //#region relevant variables
    // const { simulate_url_to_video_component } = UI.display;
    links.html.fetched.urlBtn = await UTILS.fetchTextTrimed(links.html.urlBtn);
    //#endregion

    // const urlObserver = new MutationObserver(InlineUrlBtnMutations_cb);

    // ⛔ ToogleUrlBtnObserver(simulate_url_to_video_component.checked && ValidUrlBtnUsage(), urlObserver);
    // ⛔ simulate_url_to_video_component.addEventListener('change', (e) => confirmUrlBtnUsage(e.currentTarget.checked, e));
    // ⛔ simulate_url_to_video_component.addEventListener('change', (e) => ToogleUrlBtnObserver(e.currentTarget.checked, urlObserver));



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
            DeleteDOM_Els(id, cssURL);
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = UTILS.NoCash(cssURL);
            link.id = id;
            document.head.appendChild(link);

            link.onload = () => resolve();
        });
    }
    function DeleteDOM_Els(id, cssURL)
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
        // caution:
        const rm_moreIcon = document.querySelector('.bp3-icon-more').closest('.rm-topbar .rm-topbar__spacer-sm + .bp3-popover-wrapper');
        const htmlText = window.YT_GIF_OBSERVERS.dmm_html ?? await UTILS.FetchText(dropDownMenu);
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
            // ⛔
            // if (parentObj.baseKey?.inputType == 'prompt')
            // {
            //     delete UI[parentKey];
            //     continue;
            // }

            for (const childKey in parentObj)
            {
                // ⛔
                // const child = parentObj[childKey];
                // const directObjPpts = (child?.baseKey) ? child.baseKey : child;
                // const sessionValue = directObjPpts.sessionValue;
                // const domEl = document.getElementById(childKey); // ❗❗❗

                const sessionValue = UI[parentKey][childKey];
                const domEl = document.getElementById(childKey);

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
                            const input = parentObj[childKey];

                            if (domEl.tagName == 'SELECT')
                                input.value = sessionValue.toString();
                            else // checkbox
                                input.checked = UTILS.isTrue(sessionValue);

                            input.previousElementSibling?.setAttribute('for', input.id);
                    }
                }
                // ⛔
                // else
                // {
                //     if (directObjPpts.hasOwnProperty('baseValue'))
                //     {
                //         parentObj[childKey] = sessionValue || directObjPpts.baseValue;
                //     }
                //     else if (childKey == 'baseKey' || directObjPpts.inputType == "prompt")
                //     {
                //         delete parentObj[childKey];
                //     }
                // }
            }
        }
    }
    function RESTRICT_FEATURES()
    {
        const ddm_tm = [
            document.querySelector(".dropdown_timestamp-style > .dropdown-content"),
            document.querySelector(".yt-gif-experience-style > .dropdown-content"),
        ];

        const inputSel = [
            'input',
            'select',
            'a[href]',
        ].join(',');

        const otherInputs = [
            document.querySelector("#simulate_roam_research_timestamps"),
            document.querySelector("#simulate_url_to_video_component"),
            document.querySelector("#play_last_active_player_off_intersection"),
            document.querySelector("#ddm_css_theme_input"),
            document.querySelector("#navigate-to-yt-gif-settings-page > span > input")
        ];


        const badInputs = ddm_tm.map(cnt => [...cnt.querySelectorAll(`:is(${inputSel})`)]).flat(Infinity);

        [...badInputs, ...otherInputs]
            .filter(el => !!el && !el.closest('.ddm-tut'))
            .forEach(el =>
            {
                el.classList.add('input-disabled');

                if (el.tagName == 'INPUT')
                    el.checked = el.disabled = true;

                el = (el.tagName == 'SELECT' || el.classList.contains('bp3-button')) ? el.parentNode : el;

                const org = el.getAttribute('original-tooltip');
                if (!org)
                    el.setAttribute('original-tooltip', (el.getAttribute('data-tooltip') ?? '') + ` Feature available on V0.2.0`)

                el.setAttribute('data-tooltip', el.getAttribute('original-tooltip'))
            });

        const ddmConts = [
            document.querySelector(".dropdown_timestamp-style > span"),
            document.querySelector(".yt-gif-experience-style > span")
        ]

        ddmConts.forEach(el => el.classList.add('ddm-updt-h'))
    }
    //#endregion


    //#region 3. events pre observers
    function DDM_IconFocusBlurEvents(ddm_icon, ddm_focus, ddm_info_message_selector)
    {
        // 1. caution: special case
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
            const main = document.querySelector(`[data-main='${key}']`);
            const binds = [...document.querySelectorAll(`[data-bind*='${key}']`)];

            toggleValidItemClasses();
            main.addEventListener('change', toggleValidItemClasses);

            function toggleValidItemClasses()
            {
                binds.forEach(b => UTILS.toggleClasses(!main.checked, toggleClassArr, b));
            }
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
    function SetUpSelectTurorials()
    {
        const selectObjs = [...document.querySelectorAll('.ddm-tut select')].filter(el => !!el)
            .map(sel => selectObj(sel))
            .forEach(obj =>
            {
                toogleFoldAnim(false, obj.ddm);

                obj.select.addEventListener('change', async (e) =>
                {
                    resetOptions(obj);
                    await ShowOption(obj);
                });
                obj.container.addEventListener('mouseenter', async (e) => await ShowOption(obj));

                // fire change on selected attr
                const selected = obj.select.querySelector('[selected]')?.value;
                if (selected)
                    obj.select.dispatchEvent(new Event('change'));
            })
    }
    function SetUpTutorials_smartNotification()
    {
        const tutContArr = ['tut_update_ver'].map(id => document.querySelector(`[id="${id}"]`)).filter(el => el != null);

        for (const container of tutContArr)
        {
            const obj = getTutorialObj(container);

            if (obj.ok) // toogle icon onchange
            {
                const { btn } = obj;
                btn.addEventListener('change', e => ToogleVisualFeedback(e.target.checked));

                CheckOnLocalStorage(obj);

                function ToogleVisualFeedback(bol)
                {
                    bol = toogleIcons(bol, obj.iconObj, btn);
                    UTILS.toggleClasses(!bol, [cssData.dwn_pulse_anim], obj.pulseElm);
                }

                function CheckOnLocalStorage({ btn, id })
                {
                    if (UTILS.hasOneDayPassed_localStorage(id))
                    {
                        btn.checked = true;
                        btn.dispatchEvent(new Event('change'));
                    }
                    else
                    {
                        // ⛔ 
                        // const sessionValue = window.YT_GIF_DIRECT_SETTINGS.get(id)?.sessionValue;
                        // const bol = typeof sessionValue === 'undefined' ? true : sessionValue;
                        btn.checked = false;
                        ToogleVisualFeedback(false);
                    }
                }
            }
        }

        function getTutorialObj(container)
        {
            const btn = container.querySelector('input[class*=bp3-icon-]');
            const pulseElm = container.querySelector('.drodown_item-pulse-animation');
            const iconObj = getIconFlipObj(btn); // bookmark
            const parentSelector = UTILS.getUniqueSelector(container.querySelector('[data-video-url]')?.parentElement)

            return {
                iconObj,
                btn, pulseElm,
                id: container.id,
                target: () => container.querySelector(parentSelector),
                ok: iconObj.falseVal && iconObj.trueVal && btn // the btn can flip visually
            };
        }
    }
    async function DDM_DeployTutorial(parentTarget)
    {
        if (!parentTarget || parentTarget.querySelector('.yt-gif-wrapper')) // video already deployed
            return;

        const tutWrapper = parentTarget.querySelector('[data-video-url]');

        // remove every attribute but data-video-url
        for (const attr of [...tutWrapper.attributes].filter(attr => attr.name != 'data-video-url'))
            tutWrapper.removeAttribute(attr.name); // fuck!

        const awaitingWrapper = await onYouTubePlayerAPIReady(tutWrapper, 'yt-gif-ddm-tutorial', 'force-awaiting', 'testing manual ty gif tutorial');

        icon.addEventListener('blur', localBlur);

        awaitingWrapper.addEventListener('mouseenter', (e) =>
        {
            icon.dispatchEvent(new Event('click'))
            toggle_VisualFeedback(e.currentTarget, false);
        })
        awaitingWrapper.addEventListener('mouseleave', (e) =>
        {
            toggleFocusOnDMMsparents(true)
            toggle_VisualFeedback(e.currentTarget, true)
        })


        function localBlur(e)
        {
            if (!isRendered(awaitingWrapper))
                icon.removeEventListener('blur', localBlur);
            else
                toggleFocusOnDMMsparents(false);
        }
        function toggleFocusOnDMMsparents(toggle = true)
        {
            const updateTutParents = [parentTarget?.closest('.dropdown-content'), mainDDM];
            for (const el of updateTutParents)
                UTILS.toggleClasses(toggle, [ddm_focus], el);

            if (toggle)
                icon.dispatchEvent(new Event('click'));
        }
        function toggle_VisualFeedback(el, bol)
        {
            UTILS.toggleClasses(bol, [cssData.ddn_tut_awaiting], el);
        }
    }

    //#region Select tutorial
    function selectObj(sel)
    {
        const ddm = sel.closest('.ddm-tut');
        const options = [...sel.options].map(o => o.value);
        const htmls = [...options].reduce((acc, crr) =>
        {
            acc[crr] = ddm.querySelector(`[select="${crr}"]`)?.innerHTML;
            return acc;
        }, {});

        return {
            options,
            target: (v) => ddm.querySelector(`[select="${v}"]`),

            html: (v) => htmls[v],

            select: sel, ddm,
            container: sel.closest('.dropdown'),
        }
    }
    async function ShowOption(obj)
    {
        if (obj.select.value == 'disabled')
            return toogleFoldAnim(false, obj.ddm);

        toogleFoldAnim(true, obj.ddm);

        const target = obj.target(obj.select.value);
        target.style.display = 'block';

        await DDM_DeployTutorial(target);
    }
    function resetOptions(obj)
    {
        for (const option of obj.options)
        {
            const wrapper = obj.target(option);
            if (!(wrapper instanceof Element))
                continue;
            wrapper.style.display = 'none';
            wrapper.innerHTML = obj.html(option);
        }
    }
    function toogleFoldAnim(bol, el)
    {
        UTILS.toggleClasses(!bol, ['absolute'], el); // vertical
        UTILS.toggleClasses(bol, ['w-full'], el); // horizontal
    }
    //#endregion

    //#endregion


    //#region Focus and close mainDDM
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
    function mainDDMdisplay(d)
    {
        return mainDDM.style.display = d
    }
    function canCloseMenu()
    {
        return !mainDDM.classList.contains(ddm_focus) && !mainMenu.matches(':hover')
    }
    function tryToCloseMenu()
    {
        if (canCloseMenu())
            [...mainDDM.querySelectorAll('.dropdown-focus')].forEach(el => el.classList.remove('dropdown-focus'));
        return canCloseMenu() ? mainDDMdisplay('none') : null
    }
    function openCleanMenu()
    {
        return mainDDMdisplay('flex')
    }
    //#endregion


    //#region local utils
    function DDM_Els()
    {
        const { ddm_exist } = cssData
        return document.querySelectorAll('.' + ddm_exist);
    }
    /* ****************** */
    //#region flip icons and tooltip helpers
    function getIconFlipObj(el)
    {
        const falseVal = [...el.classList]?.reverse().find(c => c.includes('bp3-icon-'));
        const trueVal = 'bp3-icon-' + el.getAttribute('flip-icon');
        return { falseVal, trueVal, el };
    }
    function getTooltipFlipObj(el)
    {
        const trueVal = el.getAttribute('flip-tooltip');
        const falseVal = el.getAttribute('data-tooltip');
        return { falseVal, trueVal, el };
    }
    function toogleIcons(bol, { falseVal, trueVal, el })
    {
        bol = UTILS.isTrue(bol);
        UTILS.toggleClasses(false, [trueVal, falseVal], el);
        UTILS.toggleClasses(true, [bol ? trueVal : falseVal], el);
        return bol;
    }
    function toogleTooltips(bol, { falseVal, trueVal, el })
    {
        bol = UTILS.isTrue(bol);
        UTILS.toggleAttribute(true, 'data-tooltip', el, bol ? trueVal : falseVal);
        return bol;
    }
    //#endregion


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
            if (UTILS.isNotZoomPath(node))
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
        return components.filter(el => UTILS.isNotZoomPath(el));
    }
    //#endregion
}




/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
//
async function onYouTubePlayerAPIReady(wrapper, targetClass, dataCreation, message = 'I dunno')
{
    if (!wrapper || !wrapper.parentNode) return;



    // 1. search and get urlIndex and uid
    const { url, accUrlIndex, uid, grandParentBlock } = await tempUidResultsObj(wrapper);

    // 1.1 don't add up false positives
    if (!url || accUrlIndex < 0 || !uid)
    {
        UIDtoURLInstancesMapMap.delete(uid);
        return console.log(`YT GIF: Couldn't find yt-gif component number ${accUrlIndex + 1} within the block ((${uid}))`);
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
    wrapper.style.setProperty('--yt-gif-player-span', parseFloat(configParams.sp) + "%");
    wrapper.setAttribute(attrInfo.target, targetClass);
    wrapper.setAttribute(attrInfo.creation.name, dataCreation);
    wrapper.setAttribute(attrInfo.url.path, url);
    wrapper.setAttribute(attrInfo.url.index, accUrlIndex);
    wrapper.innerHTML = '';
    wrapper.insertAdjacentHTML('afterbegin', links.html.fetched.playerControls);
    wrapper.querySelector('.yt-gif-player').id = newId;



    // 5. Observe children containers and recover active timestamps respectively
    const rm_container = closest_rm_container(grandParentBlock);
    // ⛔ SetUpTimestampRecovery(rm_container);



    // 6. On removed from DOM clear Uid2Url map and deactivate timestamps
    const options = {
        el: grandParentBlock?.querySelector('span'),
        OnRemmovedFromDom_cb: () =>
        {
            UIDtoURLInstancesMapMap.delete(uid);
            // ⛔ if (!UI.timestamps.tm_recovery.checked)
            // DeactivateTimestampsInHierarchy(rm_container, wrapper);
            // ⛔if (!isRendered(rm_container) && rm_container?.closest('.rm-sidebar-outline'))
            // observedParameters.delete(blockID);
        },
    }
    UTILS.ObserveRemovedEl_Smart(options);



    // 7. 
    if (dataCreation == attrInfo.creation.forceAwaiting)// ⛔ || isValid_Awaiting_check())
    {
        return await DeployYT_IFRAME_OnInteraction();
    }
    else
    {
        // ⛔ await AssertParamsClickTimestamp();
        return await DeployYT_IFRAME();
    }



    // 1. uidResultsObj
    async function tempUidResultsObj(el)
    {
        const grandParentBlock = function () { return closestBlock(this.el) };
        const condition = function () { return this.uid = this.grandParentBlock()?.id?.slice(-9) };

        //#region alias like properties
        const aliasSel = {
            inline: {
                is: 'a.rm-alias.rm-alias--block',
                from: '.rm-alias-tooltip__content'
            },
            card: {
                is: '.rm-block__part--equals',
                from: '.bp3-card'
            }
        }
        const openAlias = function (isSel) { return document.querySelector(`.bp3-popover-open > ${isSel}`) };
        const PopOverParent = function (fromSel) { return el.closest(`div.bp3-popover-content > ${fromSel}`) };
        const aliasCondition = function () { return PopOverParent(this.from) && this.uidCondition() };
        const grandParentBlockFromAlias = function () { return closestBlock(this.el.closest('.bp3-popover-open')) };
        //#endregion

        // uidFromGrandParent
        const preSelector = [[...rm_components.state.currentClassesToObserver].map(s => '.' + s), '.yt-gif-wrapper'];
        const targetSelector = preSelector.join();
        const tempUrlObj = {
            urlComponents: function () { return [...this.grandParentBlock().querySelectorAll(this.targetSelector)] },
            getUrlIndex: function () { return this.urlComponents().indexOf(this.el) },
        }


        const uidResults = { /* a class makes the most sense here, but they're so similar, yet so different, and it only happens once at the time I hope... */
            'is component': {
                uid: null, url: null, targetSelector, el,

                condition,
                grandParentBlock,
            },
            'is tooltip card': {
                uid: null, url: null, el: openAlias(aliasSel.card.is),

                targetSelector: [aliasSel.card.is].join(),

                from: aliasSel.card.from,
                grandParentBlock: grandParentBlockFromAlias,
                uidCondition: condition,
                condition: aliasCondition,
            },
            'is alias': {
                uid: null, url: null, targetSelector, el: openAlias(aliasSel.inline.is),

                targetSelector: [aliasSel.inline.is].join(),

                from: aliasSel.inline.from,
                grandParentBlock: grandParentBlockFromAlias,
                uidCondition: condition,
                condition: aliasCondition,
            },
            'is ddm tutorial': {
                uid: 'irrelevant-uid', url: null, el,
                targetSelector: ['[data-video-url]'].join(),

                condition: function () { return this.url = this.el.getAttribute(attrInfo.url.path) },
                grandParentBlock: function () { return this.el.closest('.dropdown-content') },
            },
        }
        Object.keys(uidResults).forEach(key => Object.assign(uidResults[key], tempUrlObj));
        Object.assign(uidResults['is component'], { urlComponents: function () { return ElementsPerBlock(this.grandParentBlock(), this.targetSelector) } }); // such a curious emebed predicament...
        const key = Object.keys(uidResults).find(x => uidResults[x].condition());
        if (!key) return {};


        const resObj = {
            uid: uidResults[key].uid,
            preUrlIndex: uidResults[key].getUrlIndex(),
            accUrlIndex: 0,
            url: uidResults[key].url,
            grandParentBlock: uidResults[key].grandParentBlock(),
            nestedComponentMap: new Map()
        }


        if (key == 'is ddm tutorial')
        {
            resObj.accUrlIndex = resObj.preUrlIndex;
            return resObj;
        }
        else if (key == 'is tooltip card')
        {
            // it is a block in it's own right
            const tempMap = await getUrlMap_smart(uidResults[key].uid);

            resObj.nestedComponentMap = MapAtIndex_Value(tempMap, resObj.preUrlIndex, key);
            // https://roamresearch.slack.com/archives/CTAE9JC2K/p1638578496037700
            if (!resObj?.nestedComponentMap || resObj?.nestedComponentMap.size == 0)
            {
                debugger;
                resObj.nestedComponentMap = [...tempMap.values()][resObj.preUrlIndex];
            }
            if (!resObj?.nestedComponentMap || resObj?.nestedComponentMap.size == 0)
            {
                return resObj;
            }
            updateUrlIndexInsideAlias();
        }
        else if (key == 'is alias')
        {
            const tempMap = await getUrlMap_smart(uidResults[key].uid);

            // needs it's own UID                                   // is it's parent's
            resObj.uid = MapAtIndex_Value(tempMap, resObj.preUrlIndex, key);
            resObj.nestedComponentMap = await getUrlMap_smart(resObj.uid);
            updateUrlIndexInsideAlias();
        }
        else
        {
            resObj.nestedComponentMap = await getUrlMap_smart(resObj.uid);
        }


        resObj.url = MapAtIndex_Value(resObj.nestedComponentMap, resObj.preUrlIndex, 'is component');
        resObj.accUrlIndex += resObj.preUrlIndex;
        if (!YTGIF_Config.guardClause(resObj?.url))
            resObj.url = null;
        return resObj;



        function updateUrlIndexInsideAlias()
        {
            resObj.accUrlIndex += resObj.preUrlIndex;
            resObj.preUrlIndex = uidResults[key].getUrlIndex();  // it also needs it's own urlIndex
        }

        async function getUrlMap_smart(uid)
        {
            return await getMap_smart(uid, UIDtoURLInstancesMapMap, getComponentMap, uid, YTGIF_Config);
        }
    }

    // 3.1 extract params
    function urlConfig(url)
    {
        let success = false;
        const media = JSON.parse(JSON.stringify(videoParams));
        if (YTGIF_Config.guardClause(url))
        {
            media.id = YouTubeGetID(url);

            media.start = media.defaultStart = ExtractFromURL('int', /(t=|start=)(?:\d+)/g);
            media.end = media.defaultEnd = ExtractFromURL('int', /(end=)(?:\d+)/g);

            media.speed = ExtractFromURL('float', /(s=|speed=)([-+]?\d*\.\d+|\d+)/g);

            media.volume = ExtractFromURL('int', /(vl=|volume=)(?:\d+)/g);

            media.hl = new RegExp(/(hl=)((?:\w+))/, 'gm').exec(url)?.[2];
            media.cc = new RegExp(/(cc=|cc_lang_pref=)((?:\w+))/, 'gm').exec(url)?.[2];

            media.sp = new RegExp(/(sp=|span=)((?:\w+))/, 'gm').exec(url)?.[2];
            media.sp = media.sp ?? document.documentElement.style.getPropertyValue('--yt-gif-player-span');

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

    // 7.0
    async function DeployYT_IFRAME_OnInteraction()
    {
        const mainAnimation = setUpWrapperAwaitingAnimation();
        // ⛔const { awaiting_input_type } = UI.experience;
        const interactionType = 'mousedown'; // ⛔ awaiting_input_type.value == 'mousedown' ? 'mousedown' : 'mouseenter'; // huga buga

        AddInteractionEventListener();
        wrapper.addEventListener('customPlayerReady', CreateYTPlayer);

        // ⛔awaiting_input_type.addEventListener('change', changeMouseEvents);

        return wrapper;


        async function CreateYTPlayer(e)
        {
            e.preventDefault();

            UTILS.toggleClasses(false, mainAnimation, wrapper);
            UTILS.removeIMGbg(wrapper);

            RemoveAllListeners();

            if (!e.type.includes('custom'))
            {
                // ⛔ await AssertParamsClickTimestamp();
                wrapper.dispatchEvent(UTILS.simHover());
            }
            else if (typeof e.detail == 'object')
            {
                configParams.start = e.detail.start ?? configParams.start;
                configParams.end = e.detail.end ?? configParams.end;
                configParams.updateTime = e.detail.updateTime ?? configParams.updateTime;
                configParams.mute = e.detail.mute ?? configParams.mute;
                configParams['play-right-away'] = e.detail['play-right-away'] ?? configParams['play-right-away'];

                // ⛔ setObsTimestamp(Object.assign(e.detail.obsTimestamp, { workflow: 'soft' }));
            }

            return await DeployYT_IFRAME();
        }

        function RemoveAllListeners()
        {
            RemoveInteractionEventListener();
            wrapper.removeEventListener('customPlayerReady', CreateYTPlayer);

            // ⛔ awaiting_input_type.removeEventListener('change', changeMouseEvents);
        }
        function AddInteractionEventListener(listener = interactionType)
        {
            wrapper.addEventListener(listener, CreateYTPlayer);
        }
        function RemoveInteractionEventListener()
        {
            wrapper.removeEventListener(interactionType, CreateYTPlayer);
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
        // ⛔ const { player_interface_language, player_captions_language, player_captions_on_load } = Object.fromEntries(window.YT_GIF_DIRECT_SETTINGS); // https://stackoverflow.com/questions/49569682/destructuring-a-map#:~:text=let%20%7B%20b%2C%20d%20%7D%20%3D%20Object.fromEntries(m)

        const playerVars = {
            autoplay: 1, 		// Auto-play the video on load
            controls: 1, 		// Show pause/play buttons in player
            mute: 1,
            start: configParams?.start,
            end: configParams?.end,

            // ⛔ hl: configParams?.hl || player_interface_language.sessionValue,           // Display interface language   // https://developers.google.com/youtube/player_parameters#:~:text=Sets%20the%20player%27s%20interface%20language.%20The%20parameter%20value%20is%20an%20ISO%20639-1%20two-letter%20language%20code%20or%20a%20fully%20specified%20locale.%20For%20example%2C%20fr%20and%20fr-ca%20are%20both%20valid%20values.%20Other%20language%20input%20codes%2C%20such%20as%20IETF%20language%20tags%20(BCP%2047)%20might%20also%20be%20handled%20properly.
            // ⛔ cc_lang_pref: configParams?.cc || player_captions_language.sessionValue, 	// Display closed captions      // https://developers.google.com/youtube/player_parameters#:~:text=This%20parameter%20specifies%20the%20default%20language%20that%20the%20player%20will%20use%20to%20display%20captions.%20Set%20the%20parameter%27s%20value%20to%20an%20ISO%20639-1%20two-letter%20language%20code.

            // ⛔ cc_load_policy: (UTILS.isTrue(player_captions_on_load.sessionValue)) ? 1 : 3,  // Hide closed captions - broken feature by design
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
    async function DeployYT_IFRAME()
    {
        return record.player = new window.YT.Player(newId, playerConfig(configParams));
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
    //const canBeCleanedByBuffer = UTILS.closestBlockID(iframe);// ⛔
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
    // ⛔ const { previousTimestamp, previousVolume } = UI; // still inner objects
    RunWithPreviousParamsONiframeLoad(); // 🧼



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



    // ⛔
    // 8. Performance Mode - Iframe Buffer & Initalize on interaction - synergy
    // if (canBeCleanedByBuffer && parent) // sometimes the parent is already gone - while loading iframes
    // {
    //     const parentCssPath = UTILS.getUniqueSelectorSmart(parent);
    //     PushNew_ShiftAllOlder_IframeBuffer(parentCssPath);
    // }



    // 9. 'auto pause' when an iframe goes out the viewport... stop playing and mute
    const yConfig = { threshold: [0] };
    const ViewportObserver = new IntersectionObserver(PauseOffscreen_callback, yConfig);
    ViewportObserver.observe(iframe);



    // 10. well well well - pause if user doesn't intents to watch
    HumanInteraction_AutopalyFreeze(); // this being the last one, does matter



    //#region 1. previous parameters
    function RunWithPreviousParamsONiframeLoad()
    {
        const sesion = lastBlockIDParameters.get(blockID);
        if (sesion)
        {
            const { url_boundaries, url_volume } = UI.playerSettings;
            RunWithPrevious_TimestampStyle(sesion, url_boundaries);
            RunWithPrevious_VolumeStyle(sesion, url_volume);
        }
    }
    /* ******************* */
    function RunWithPrevious_VolumeStyle(sesion, { value })
    {
        if (value == 'strict')
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
        else if (value == 'soft')
        {
            t.__proto__.newVol = sesion.updateVolume;
        }
        else if (value == 'start-only')
        {
            t.__proto__.newVol = validVolumeURL();
        }
    }

    function RunWithPrevious_TimestampStyle(sesion, { value })
    {
        if (value == 'strict')
        {
            const timeHist = sesion.timeURLmapHistory;
            if (timeHist[timeHist.length - 1] != map.start) // new entry is valid ≡ user updated "?t="
            {
                timeHist.push(map.start);
                seekToUpdatedTime(map.start);
            }
            else
            {
                seekToUpdatedTime(sesion.updateTime);
            }
        }
        else if (value == 'soft' && isBounded(sesion.updateTime))
        {
            seekToUpdatedTime(sesion.updateTime);
        }
        else if (value == 'start-only')
        {
            // don't seek you are already there, it's just semantics and a null option
        }
    }
    //#endregion


    //#region 2. play/mute styles
    function ToggleStyles_EventListeners(bol = false)
    {
        // hmmmm... Mainly because of CleanLoadedWrappers... UI is window.YT_GIF_OBSERVERS.UI | timestamps persist this way
        UI.playerSettings.play_style = Flip(UI.playerSettings.play_style, playStyleDDMO);
        UI.playerSettings.mute_style = Flip(UI.playerSettings.mute_style, muteStyleDDMO);
        function Flip(binaryInput, styleDDMO = () => { })
        {
            if (binaryInput?.tagName)
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

        if (UI.playerSettings.play_style.value == 'all-visible')
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

        if (UI.playerSettings.mute_style.value == 'strict' || UI.playerSettings.mute_style.value == 'all-muted')
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


            if (UI.playerSettings.mute_style.value == 'strict')
            {
                if (anyValidInAndOutKey(e))
                {
                    MuteEveryPlayer_Visibly();
                }
            }
            if (UI.playerSettings.play_style.value == 'soft')
            {
                PauseAllOthersPlaying_Visibly();
            }


            if (CanUnmute())
            {
                isSoundingFine();
            }
            else if (UI.playerSettings.mute_style.value == 'soft')
            {
                isSoundingFine(false);
            }
        }
        else if (e.type == 'mouseleave')
        {
            t.__proto__.newVol = t.getVolume(); // spaguetti isSoundingFine unMute
            t.__proto__.globalHumanInteraction = false;

            //ﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠ//the same as: if it's true, then the other posibilities are false
            if (anyValidInAndOutKey(e) && UI.playerSettings.mute_style.value != 'all-muted')
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
        else if (UI.playerSettings.play_style.value == 'all-visible')
        {
            UI.playerSettings.play_style.visible_clips_start_to_play_unmuted.dispatchEvent(new Event('change'));
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

        // if (canBeCleanedByBuffer)// ⛔
        // {
        //     ifStack_ShiftAllOlder_IframeBuffer();
        // }


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
            if (UI.playerSettings.play_style.value != 'all-visible')
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
                        togglePlay(UI.playerSettings.play_style.value == 'all-visible'); // pause?
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
        return UI.playerSettings.mute_style.value != 'soft' && UI.playerSettings.mute_style.value != 'all-muted';
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
        return UI.playerSettings.play_style.value == 'soft' || UI.playerSettings.play_style.value == 'strict'
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
async function onStateChange(state)
{
    const t = state.target;
    const map = allVideoParameters.get(t.h.id);

    if (state.data === YT.PlayerState.ENDED)
    {
        await RealoadThis();
        // ⛔ if (UI.timestamps.tm_loop_hierarchy.value != 'disabled')
        // await TryToLoadNextTimestampSet();


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


    async function RealoadThis()
    {
        await ReloadYTVideo({ t, start: map?.start, end: map?.end });
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
        const src = UI.default.end_loop_sound_src; // 🧼
        if (UTILS.isValidUrl(src))
        {
            return src
        }
        return null
    }
}






//#region Performance Mode Utils
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
//#endregion




//#region clossesYTGIFParent Utils
function closestYTGIFparentID(el)
{
    return (closestBlock(el) || el?.closest('.dwn-yt-gif-player-container'))?.id
}
function closestBlock(el)
{
    return el?.closest('.rm-block__input')
}
function closest_rm_container(el)
{
    return el?.closest('.roam-block-container')
}
function getWrapperUrlSufix(wrapper, uid = '')
{
    const url = wrapper.getAttribute(attrInfo.url.path);
    const urlIndex = wrapper.getAttribute(attrInfo.url.index);
    const urlSufix = properBlockIDSufix(url, urlIndex);
    return uid + urlSufix;
}
function properBlockIDSufix(url, urlIndex)
{
    return '_' + [url, urlIndex].join('_');
}
function isRendered(el)
{
    return document.body.contains(el);
}
//#endregion




//#region Timestamp
function ElementsPerBlock(block, selector)
{
    if (!block) return [];
    return [...block?.querySelectorAll(selector)]?.filter(b => closestBlock(b).id == block.id) || [];
}
async function ReloadYTVideo({ t, start, end })
{
    if (!t)
        return; //console.log(`YT GIF : Couldn't reload a video. Internal target is missing.`);

    const vars = t.i.h;
    const map = allVideoParameters.get(t.h.id);
    const iframe = t?.getIframe?.();

    start = start || 0;
    end = end || t.getDuration();

    vars.playerVars.start = map.start = start;
    vars.playerVars.end = map.end = end;

    while (isRendered(iframe) && !t?.seekTo)
        await RAP.sleep(50);

    // https://stackoverflow.com/questions/60409231/why-does-my-youtube-react-component-fire-the-playerstate-ended-event-twice-befor
    // t.l.h[5] = async () => { }; // the craziet shinanigans EVER!
    // t.seekTo?.(start); // not only it was preserving it's state
    // t.pauseVideo?.(); // and performing it's onStateChange func twice
    if (t.playerInfo?.playerState)
        t.playerInfo.playerState = 'F';
    if (t.l?.h?.[5])
        t.l.h[5] = async () => { }; // the only way to prevent double fire...? man...
    // though I'm waiting to see what bugs it's going to cause

    await t?.loadVideoById?.({ // but it requieres you to load the video again to set "endSeconds" once again
        'videoId': t.i.h.videoId,
        'startSeconds': start,
        'endSeconds': end,
    });

    while (isRendered(iframe) && !t?.getCurrentTime?.())
        await RAP.sleep(50);

    try { t.l.h[5] = onStateChange; } catch (error) { }

    return t?.getCurrentTime?.();
}
//#endregion




//#region  backend/frontend communication - XXX_Config = {...}
function MapAtIndex_Value(map, valueAtIndex, property = 'is')
{
    const key = FilterMapByIsKey(map, property)?.[valueAtIndex];
    return map?.get(key);
}
function FilterMapByIsKey(map, property)
{
    if (!map || map?.size == 0) return null;
    return [...map.keys()].filter(o => o['isKey'].includes(property));
}

async function getMap_smart(key, map, callback, ...setMapCb_params)
{// https://stackoverflow.com/questions/3458553/javascript-passing-parameters-to-a-callback-function#:~:text=console.log(param1)%3B%0A%7D-,function%20callbackTester(callback%2C%20...params)%20%7B,-callback(...params)%3B%0A%7D%0A%0A%0A%0AcallbackTester
    // since it store recursive maps, once per instance it's enough
    try
    {
        if (!key) throw new Error('uid is null');
        if (!map.has(key))
            map.set(key, await callback(...setMapCb_params));
        return map.get(key);
    } catch (error)
    {
        console.log(error);
        return null;
    }
}
async function getComponentMap(tempUID, _Config = YTGIF_Config)
{
    let uidMagazine = [];
    let indentFunc = 0;
    const { targetStringRgx, componentPage } = _Config;

    const orderObj = {
        order: -1,
        incrementIf: function (condition) { return condition ? Number(++this.order) : null },
        condition: (x) => false,
    };
    const results = {
        // 'has components aliases': { tone: '#37d5d6' },
        // 'has components': { tone: '#36096d' },
        // 'has any aliases': { tone: '#734ae8' },
        // 'has any components': { tone: '#21d190' },
        'is tooltip card': { tone: '#21d190' },
        'is component': { tone: '#20bf55' },
        'is alias': { tone: '#bfe299' },
        'is block reference': { tone: 'green' },
    };
    Object.keys(results).forEach(key => Object.assign(results[key], orderObj));

    // componentsInOrderMap
    return await TryToFindTargetStrings_Rec(await TryToFindTargetString(tempUID), { uidHierarchy: [] }, new Map());



    async function TryToFindTargetStrings_Rec(objRes, parentObj, map)
    {
        for (const { value, is, order } of objRes?.targetStringsWithUids) // loop through RENDERED targetStrings (components) and uids (references)
        {
            const generateUniqueKey = () => assertUniqueKey_while(objRes.uid, indentFunc, is, order);

            if (['is alias', 'is component'].some(w => w === is))
            {
                map.set(generateUniqueKey(), value);
            }
            else if (is === 'is tooltip card')
            {
                const { tooltipKey, tooltipObj } = generateTooltipObj(value, objRes, generateUniqueKey); // save it a spot in the map
                const tooltipMap = await TryToFindTargetStrings_Rec(tooltipObj, parentObj, new Map());
                map.set(tooltipKey, tooltipMap); // assign it
            }
            else if (is == 'is block reference')
            {
                parentObj.uidHierarchy = UTILS.pushSame(parentObj.uidHierarchy, value);

                const comesFromRecursiveParent = parentObj?.uid == value;
                const isSelfRecursive = parentObj?.blockReferencesAlone?.includes(value) || value == tempUID;
                const pastFirstLevel = indentFunc > parentObj?.uidHierarchy?.length ?? 1;
                if (comesFromRecursiveParent || (pastFirstLevel && isSelfRecursive))
                    continue; // skip it | unrendered

                // it is rendered, so execute it's rec func
                indentFunc += 1;
                objRes.isKey = is;
                map = await TryToFindTargetStrings_Rec(await TryToFindTargetString(value), objRes, map);
                indentFunc -= 1;
            }
        }

        return map;

        function assertUniqueKey_while(uid, indent, isKey, order)
        {
            uidMagazine = PushIfNewEntry(uidMagazine, uid); // clunky, but it works

            const similarCount = uidMagazine.filter(x => x === uid).length; // uniqueKey among non siblings
            return {
                indent, uid, similarCount,
                isKey, isKeyOrder: isCount(),
                order,
            }

            function isCount()
            {
                const keys = ['is tooltip card', 'is alias', 'is component', 'is block reference'];
                for (const is of keys)
                    results[isKey].incrementIf(isKey === is)

                return results[isKey].order;
            }
        }
        function cleanIndentedBlock()
        {
            const tab = '\t'.repeat(indentFunc);
            const cleanLineBrakes = objRes.string.replace(/(\n)/gm, ". ");
            const indentedBlock = tab + cleanLineBrakes.replace(/.{70}/g, '$&\n' + tab);
            return indentedBlock;
        }
        function PushIfNewEntry(arr, item)
        {
            const lastItem = [...arr]?.pop();
            if (lastItem != item)
                arr = UTILS.pushSame(arr, item);
            return arr;
        }
    }

    function generateTooltipObj(value, objRes, generateUniqueKey)
    {
        const tooltipObj = stringsWihtUidsObj(value);
        tooltipObj.uid = objRes.uid + '_t' + (results['is tooltip card'].order < 0 ? 0 : results['is tooltip card'].order);
        const tooltipKey = generateUniqueKey();
        return { tooltipKey, tooltipObj };
    }

    async function TryToFindTargetString(desiredUID)
    {
        const info = await RAP.getBlockInfoByUID(desiredUID);
        const rawText = info[0][0]?.string || "F";
        const resObj = stringsWihtUidsObj(rawText);
        resObj.uid = desiredUID;
        resObj.uidHierarchy = resObj.uidHierarchy ?? [];
        return resObj;
    }

    function stringsWihtUidsObj(rawText)
    {
        const { blockRgx, aliasPlusUidsRgx, tooltipCardRgx, componentRgx } = BlockRegexObj(componentPage);
        const string = clean_rm_string(rawText);

        let blockReferencesAlone = [];
        const compactObjs = getRenderedStuff(string);
        const targetStringsWithUids = compactObjs.flat(Infinity).filter(x => x != null);

        return { targetStringsWithUids, blockReferencesAlone };

        function getRenderedStuff(string)
        {
            const blockMatches = [...[...string.matchAll(new RegExp(blockRgx, 'gm'))].map(x => x = x[0])];
            const siblingsOrderObj = {
                'is block reference': {},
                'is tooltip card': {},
                'is alias': {},
                'is component': {},
            }
            Object.keys(siblingsOrderObj).forEach(key => Object.assign(siblingsOrderObj[key], orderObj));

            return blockMatches.map(val => isValueObj(val, siblingsOrderObj));

            function isValueObj(val, siblingsOrder)
            {
                const resObj = () =>
                {
                    siblingsOrder[is].incrementIf(true);
                    return { value: inOrderValue, is, order: siblingsOrder[is].order }
                }

                let is = 'is block reference', inOrderValue = val;

                if (val.match(tooltipCardRgx)?.[0]) // {{=:_rendered_by_roam_| -> string XXxxxx ... <- }}
                {
                    is = 'is tooltip card';
                    inOrderValue = [...val.matchAll(tooltipCardRgx)][0][2];

                    const blockLikeString = [...val.matchAll(tooltipCardRgx)][0][1];
                    return [resObj(), ...getRenderedStuff(blockLikeString),]
                }
                else if (val.match(aliasPlusUidsRgx)?.[0]) // [xxxanything goesxxx]((( -> xxxuidxxx <- )))
                {
                    is = 'is alias';
                    inOrderValue = [...val.matchAll(aliasPlusUidsRgx)][0][2];
                }
                else if (val.match(componentRgx)?.[0]) // {{componentPage: -> first target <- xxxxxx xxx... }}
                {
                    is = 'is component';
                    inOrderValue = val.match(targetStringRgx)?.[0];
                }
                else // xxxuidxxx
                {
                    if (inOrderValue.length != 9)
                        return null;
                    else
                        blockReferencesAlone = UTILS.pushSame(blockReferencesAlone, val);
                }

                return resObj()
            }
        }

    }

}

function BlockRegexObj(componentPage, caputureGargabe = false)
{
    const componentRgx = new RegExp(preRgxComp(componentPage), 'gm');
    const inlindeCodeRgx = /(`.+?`)|(`([\s\S]*?)`)/gm;
    const embedCompRgx = new RegExp(preRgxComp('embed'), 'gm');
    const anyPossibleComponentsRgx = /{{.+}/gm;
    const aliasPlusUidsRgx = /\[(.*?(?=\]))]\(\(\((.*?(?=\)))\)\)\)/gm;
    const tooltipCardRgx = /{{=:(.+?)\|(.+)}}/gm;
    const anyUidRgx = /(?<=\(\()([^(].*?[^)])(?=\)\))/gm;
    // set in the order in which roam renders them - anyPossibleComponents is kinda like a joker card, it will trap components along with irrelevant uids
    const baseBlockRgx = [tooltipCardRgx, componentRgx, anyPossibleComponentsRgx, aliasPlusUidsRgx, anyUidRgx]
    const withGarbage = [inlindeCodeRgx, embedCompRgx, ...baseBlockRgx];

    const blockRgx = reduceRgxArr(!caputureGargabe ? baseBlockRgx : withGarbage);

    return { blockRgx, aliasPlusUidsRgx, tooltipCardRgx, anyPossibleComponentsRgx, componentRgx };

    function reduceRgxArr(regexArr)
    {// https://masteringjs.io/tutorials/fundamentals/concat-regexp
        return regexArr.reduce((acc, v, i, a) =>
            new RegExp(acc.source != '(?:)' ? acc.source + '|' + v.source : v.source, 'gm'), new RegExp());
    }
}
function preRgxComp(rgxPage)
{
    return `{{(\\[\\[)?(${rgxPage})(?!\\/)(?!\\/)(?:(\\]\\])(.*?(?::|))|:|\\s)(?:(?<=:)|)(.+?)(\\}\\})`
}
function clean_rm_string(rawText)
{
    const s1 = rawText.replace(/(`.+?`)|(`([\s\S]*?)`)/gm, 'used_to_be_an_inline_code_block');
    return s1.replace(new RegExp(preRgxComp('embed'), 'gm'), 'used_to_be_an_embed_block');
}
//#endregion




/*
>Why so many grammatical errors? Well Because I write them while they come to mind. "OH that's cool, BUT WAIT!", type of deal.<

user requested ☐ ☑



I want to add ☐ ☑
    an inline editor for ajusting the litle miscalculations in the clips ☐
        a litle bit earlier, a litle bit after...
        and inplement the changes, when the user the user enter the real edit block mode
            🙋
    
    an inline timeline under YT GIFs to show any related idea taken form there
        just like sound clouds timestamp/comment timeline
            https://soundcloud.com/codytxr0kr/the-joe-rogan-experience-279

added
    Timestamps
        option to display 
            formated MSH 00:00:00
            seconds only
            original or formated MSH 00:00:00

    InAndOutKeys + Click Events (Timestamps) 
        Play (focus on player) Ctrl ☑ ☑
    
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

    the ability to let only one frame to keep playing with sound
        while exiting the frame
        the usage of two InAndOutKeys will do the trick

    relative and strict timestamps, specially when using nested references

    timestamps
        when folding a block or when the current active timestamp disappears
            add an observer with the uid and block id
            to activate them when they get rendered
                add strict and soft boundaries recoveries
                    keep the current time
                    seek to recoverd start

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
    
    pause or mute when video plays with while using the inAndOutKeys ☑


TODO ☐ ☑
    when changing the url on a yt gif compoenent, if it has rendered block references
            they don't update the url ☐


Features on hold ☐ ☐
    controls (can't add <select> tags under rm_input-block)
        brake down url into start/end timestamps
            on the start component, append the remainings of the yt gif component hidden text

Discarted
    Url Btn formatter + Timestamps (display all anyways)
        add option - more buttons to the right
        to format start/end timestamp, if the url has those parameters

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

    replace with awaiting for input/thumbnails
        when the frame gets lost while scrolling
        offer a margin of error / slider / how far away
            though the same functionallity can be achieved
            using the buffer, if you set it to 1 max

    should happen only when there are yt-gif componenst whitin the block hierarchy
        open/show the slash menu
        paint/link them visually

    Scroll over timestamp and change it accordingly (currently doable because of url btns functionality)
        https://chrome.google.com/webstore/detail/video-annotation-bookmark/apoimieffgakgcbagednnmdhgaiedbea
        https://www.designcise.com/web/tutorial/how-to-return-the-position-of-a-regular-expression-match-in-javascript#:~:text=football%27%3B%0A%0Aconst%20indexPairs%20%3D%20%5B%5D%3B-,while%20(null%20!%3D%3D%20(matchArr%20%3D%20regex.exec(str)))%20%7B,-indexPairs.push(%5BmatchArr
        while (null !== (matchArr = regex.exec(str))) {
            indexPairs.push([matchArr.index, regex.lastIndex]);
        }
        indexPairs.reduce((acc, v,i,a)=> [...acc, sb(a[i-1]?.[0],v[0]), sb(v[0],v[1]), sb(v[1], a[i+1]?.[1]) ], [])
        (`.+?`)|({{.+?}})

        var regex = /(`.+?`)|({{.+?}})/gm;
        var indexPairs = [];

        while (null !== (matchArr = regex.exec(str3))) {
            indexPairs.push([matchArr.index, regex.lastIndex]);
        }

        console.log(indexPairs);

        https://stackoverflow.com/questions/4514144/js-string-split-without-removing-the-delimiters#:~:text=%22abcdeabcde%22.split(-,/(%3F%3Dd)/g,-)%20//%2D%3E%20%5B%22abc%22%2C%20%22deabc%22%2C%20%22de
        /(?=d)/g


Potential errors
    btn url
        matching url will be overwritten inside
            components
            code blocks
            tooltip hidden content
    


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

    timestamp recovery
        they fire multiple times as the observer catches them
        they fire by index, which means changing pages yeilds different results

Fixed
     videoParams ☑ ☑
        default volume is mistaken as string ☑ ☑
            it should be an integer

    the weird recursive func doesn't work on block references - uids ((0UN_kefSF))
        plus the persistent timestamp doen't work as expected

    Turns out that "Try to load less offten" is the cause of the problem
        timestamps
        recovery off
        empty recordID
            with a peer, clicking on start then end then start
            when it reaches the boundary it doesn't go back to the NEW start

    ok so here's the plan // url btns
        match every rm component and render stuff
        then store those substrings boundaries
        then search every instance of url (match)
        then check if the url is NOT inside the boundaries
        then replace substring with the yt-gif componenent

    url btn + click events
        middle click
            will open on cross root, 
            but if on your current root you have videos playing OFF SCREEN
            they will be ignored


bugs that fixed themselves
    initizlizing any video
        it's volume is 100 always - lol, it works as expected right now

*/