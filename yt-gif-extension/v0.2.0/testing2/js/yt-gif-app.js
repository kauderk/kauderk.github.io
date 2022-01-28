// version 39 - semi-refactored
/**
 * @summary USER INPUTS
 * @type Object
 * @description WILL NOT CONTAIN NESTED OBJECTS, it will read 'strings' as guides then acustom to them, all inside the Ready() function.
 * It's property types will change.
 * - nested object >>> sesionValue
*/
const UI = JSON.parse(JSON.stringify(window?.YT_GIF_SETTINGS_PAGE || {}));
const UTILS = window.kauderk?.util;
/*-----------------------------------*/
/* user doesn't need to see this */
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
    dmm_html: window.ddm_html ?? null,
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

    volume: window.YT_GIF_DIRECT_SETTINGS?.get('player_volume')?.sessionValue,
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
//
const observedParameters = new Map();
const obsParams = {
    lastActiveTimestamp: null,
}
//
const YTvideoIDs = new Map();
/*-----------------------------------*/
const StartEnd_Config = {
    componentPage: 'yt-gif\\/(start|end)',
    targetStringRgx: /((\d{1,2}):)?((\d{1,2}):)((\d{1,2}))|(\d+(?:(\.\d{1})|(?=\s|\}|\w+|$)))/,
}
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
    'initialize-mode': '',
    'timestamp-experience': '',
    'timestamp-loop-opt': '',
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
    const { ddm_css_theme_input: ddm_css_theme_stt, player_span: player_span_stt } = Object.fromEntries(window.YT_GIF_DIRECT_SETTINGS);
    const { themes, playerStyle, dropDownMenuStyle } = links.css;
    const { playerControls, dropDownMenu } = links.html;
    const { yt_gif } = cssData; // CssThemes_UCS
    const { ddm_main_theme: ddm_main_theme_id } = cssData.id;
    //#endregion

    await smart_LoadCSS(dropDownMenuStyle, `${yt_gif}-dropDownMenuStyle`);
    await smart_LoadCSS(playerStyle, `${yt_gif}-playerStyle`);

    //await smart_LoadCSS(themes.get(ddm_css_theme_stt.sessionValue), ddm_main_theme_id);
    await smart_CssPlayer_UCS(player_span_stt.sessionValue); // UCS - user customizations

    links.html.fetched.playerControls = await PlayerHtml_UCS(playerControls);

    await smart_Load_DDM_onTopbar(dropDownMenu); // DDM - drop down menu



    // 2. assign direct values to the main object | UI - user inputs
    DDM_to_UI_variables(); // filtering baseKey & prompts and transforming them from objs to values or dom els - it is not generic and only serves for the first indent level (from parent to child keys)
    SaveSettingsOnChanges(); // the seetings page script is responsable for everything, these are just events



    // 3. set up events
    //#region relevant variables
    const { ddm_icon, ddm_focus, ddm_info_message_selector, dropdown__hidden, awaitng_input_with_thumbnail } = cssData;
    const { timestamp_display_scroll_offset, end_loop_sound_volume, iframe_buffer_slider } = UI.range;
    const initialize_mode = UI.experience.initialize_mode;
    const input_x_buffer_option = getOption(initialize_mode, 'input_x_buffer');
    const thumbnail_as_bg = getOption(UI.experience.xp_options, 'thumbnail_as_bg');
    const { ddm_css_theme_input } = UI.dropdownMenu;
    //#endregion

    DDM_IconFocusBlurEvents(ddm_icon, ddm_focus, ddm_info_message_selector);

    DDM_FlipBindedDataAttr_RTM([dropdown__hidden], attrData); // RTM runtime

    UpdateOnScroll_RTM(timestamp_display_scroll_offset);
    UpdateOnScroll_RTM(end_loop_sound_volume);
    UpdateOnScroll_RTM(iframe_buffer_slider);

    ToggleThumbnails(thumbnail_as_bg, awaitng_input_with_thumbnail);

    navigateToSettingsPageInSidebar();
    ToggleTheme_DDM_RTM(ddm_css_theme_input, themes, ddm_css_theme_stt, ddm_main_theme_id);

    initialize_modes_synergy(iframe_buffer_slider, input_x_buffer_option, initialize_mode);



    // 4. run extension and events - set up
    //#region relevant variables
    const { override_roam_video_component } = UI.defaultValues;
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
    const slashObj = {
        targetClass: 'bp3-text-overflow-ellipsis',
        emulationClass: 'slash-menu-emulation',
        clone: null,
    }
    const componentClass = (page) => `bp3-button bp3-small dont-focus-block rm-xparser-default-${page}`;
    const timestampObj = {
        roamClassName: 'rm-video-timestamp dont-focus-block',
        start: {
            page: 'start',
            targetClass: 'rm-xparser-default-start',
            buttonClass: componentClass('start'),
        },
        end: {
            page: 'end',
            targetClass: 'rm-xparser-default-end',
            buttonClass: componentClass('end'),
        },
        attr: {
            emulation: 'yt-gif-timestamp-emulation',
            timestampStyle: 'timestamp-style', // start or end
            timestamp: 'timestamp',
        },
        timestamp: {
            buttonClass: componentClass('timestamp'),
        },
        parent: {
            className: 'yt-gif-timestamp-parent',
        },
    };

    const { simulate_roam_research_timestamps } = UI.display;
    const { tm_workflow_display } = UI.timestamps;
    const shortcuts_option = getOption(UI.timestamps.tm_options, 'shortcuts');
    let { timestampObserver, keyupEventHanlder } = window.YT_GIF_OBSERVERS;
    timestampObserver?.disconnect();
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    //#endregion

    timestampObserver = new MutationObserver(TimestampBtnsMutation_cb);

    // 6.1 cleanAndSetUp_TimestampEmulation -> PlayPauseOnClicks
    // 6.2 run timestampObserver
    // 6.3 registerKeyCombinations (keyupEventHanlder)
    //      6.3.1 addBlockTimestamps
    toggleTimestampEmulation(simulate_roam_research_timestamps.checked);
    simulate_roam_research_timestamps.addEventListener('change', (e) => toggleTimestampEmulation(e.currentTarget.checked));
    shortcuts_option.addEventListener('customChange', e => ToogleTimestampShortcuts(e.detail.currentValue));
    tm_workflow_display.addEventListener('change', e => ChangeTimestamapsDisplay(e.currentTarget.value));


    // 7. simulate inline url btn
    //#region relevant variables
    const s_u_f_key = 'simulate_url_formatter';
    const url_formatter_option = getOption(UI.display.ms_options, s_u_f_key);
    links.html.fetched.urlBtn = await UTILS.fetchTextTrimed(links.html.urlBtn);
    //#endregion

    const urlObserver = new MutationObserver(InlineUrlBtnMutations_cb);

    const s_u_f_startUp = url_formatter_option.selected && ValidUrlBtnUsage();
    url_formatter_option.customSelect?.(s_u_f_startUp);
    ToogleUrlBtnObserver(s_u_f_startUp, urlObserver);
    url_formatter_option.addEventListener('customChange', (e) => confirmUrlBtnUsage(e.detail.currentValue, e));
    url_formatter_option.addEventListener('customChange', (e) => ToogleUrlBtnObserver(e.currentTarget.selected, urlObserver));



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
        document.querySelectorAll(".select").forEach(fakeSel =>
        {
            if (!fakeSel) return;

            const { select } = new CustomSelect({ fakeSel });
            select.id = fakeSel.id;
            fakeSel.removeAttribute('id');
        })

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
                            const input = parentObj[childKey];

                            if (domEl.tagName == 'SELECT')
                            {
                                const sesionOptions = sessionValue.toString().split(',').filter(s => !!s);
                                const options = [...input.options].forEach(o =>
                                {
                                    const selected = sesionOptions.includes(o.value);
                                    o.selected = selected;
                                    if (selected && input.type == 'select-one')
                                        input.value = o.value;
                                    o['customSelect']?.(o.selected); // Hmmmmm
                                })
                            }
                            else // checkbox
                                input.checked = UTILS.isTrue(sessionValue);

                            input.previousElementSibling?.setAttribute('for', input.id);
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
                    case 'referenced':
                        continue;
                    case 'deploymentStyle': // special case...
                        child.addEventListener('change', function (e) { updateOverrideComponentSettingBlock(e, this, childKey, siblingKeys) }, true);
                        continue;
                    case 'range': // special case...
                        child.addEventListener('wheel', function (e) { changeOnWeeel(e, this, childKey) }, true);
                }
                async function HandleSettingsPageBlockUpdate(e)
                {
                    // e.preventDefault();
                    // e.stopPropagation();
                    // if(e.target == e.currentTarget)
                    return await updateSettingsPageBlock(e, e.currentTarget, childKey, siblingKeys)
                }

                if (!child?.addEventListener) { debugger; continue; }
                child.addEventListener('change', HandleSettingsPageBlockUpdate, true);
                child.addEventListener('customChange', HandleSettingsPageBlockUpdate, true);
            }
        }
    }

    /* *************** */
    async function updateSettingsPageBlock(e, input, keyObj, siblingKeys)
    {
        const { type, checked, value } = input;
        let replaceWith = (value).toString(); // range - checkbox - radio - label - select

        if (type == 'checkbox' || type == 'radio')
        {
            replaceWith = (checked).toString();
        }
        if (type == 'radio') // special case...
        {
            [...siblingKeys]
                .map(x => window.YT_GIF_DIRECT_SETTINGS.get(x))
                .filter(y => y.inputType == 'radio')
                .forEach(o => o.UpdateSettingsBlockValue('')) // to false
        }
        if (type == 'select-multiple')
        {
            replaceWith = [...input.selectedOptions].map(o => o.value);
        }

        await window.YT_GIF_DIRECT_SETTINGS.get(keyObj)?.UpdateSettingsBlockValue(replaceWith);
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
            const binds = () => [...document.querySelectorAll(`[data-bind*='${key}']`)];

            const toogleSingle = () => binds().forEach(b => UTILS.toggleClasses(!main.checked, toggleClassArr, b));
            const toogleMultiple = () => binds().forEach(b =>
            {
                const on = b.getAttribute('on');
                const not = b.getAttribute('not');
                const equals = (s) => s.split(',').map(s => s.trim()).some(v => v == main.value);
                const any = (v) => main.value != 'disabled' && v == 'any';

                if (on) // showMatch || showIfAny
                    UTILS.toggleClasses(!(equals(on) || any(on)), toggleClassArr, b);
                else if (not) // hideMatch || hideIfAny
                    UTILS.toggleClasses((equals(not) || any(not)), toggleClassArr, b);
            });

            if (!main) { debugger; continue; }
            if (main.tagName == 'INPUT')
            {
                toogleSingle();
                main.addEventListener('change', toogleSingle);
                main.addEventListener('customBind', toogleSingle);
            }
            else if (main.tagName == 'SELECT')
            {
                toogleMultiple();
                main.addEventListener('change', toogleMultiple);
                main.addEventListener('customBind', toogleMultiple);
            }
        }
    }
    function UpdateOnScroll_RTM(scroll)
    {
        const labelEl = scroll.nextElementSibling;
        labelEl.innerHTML = scroll.value; // don't fire rendundant API calls on startup

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

    function ToggleThumbnails(thumbnail_as_bg, awaitng_input_with_thumbnail)
    {
        // BIND TO SETTINGS PAGE

        thumbnail_as_bg.addEventListener('customChange', handleIMGbgSwap);
        function handleIMGbgSwap(e)
        {
            const awaitingGifs = [...document.querySelectorAll(`.${awaitng_input_with_thumbnail}`)];
            for (const el of awaitingGifs)
            {
                if (e.target.selected)
                    UTILS.applyIMGbg(el, el.getAttribute('data-video-url'));
                else
                    UTILS.removeIMGbg(el); // spaguetti
            }
        }
    }
    /* ************* */
    function ToggleTheme_DDM_RTM(ddm_css_theme_input, themes, ddm_css_theme_stt, ddm_main_theme_id)
    {
        const icons = ['bp3-icon-flash', 'bp3-icon-moon'];

        ToogleThemeCombo(ddm_css_theme_input);

        ddm_css_theme_input.addEventListener('change', async (e) => await ToogleThemeCombo(e.currentTarget));

        async function ToogleThemeCombo(tEl)
        {
            const previousIcons = [...tEl?.classList]?.filter(el => el.startsWith('bp3-icon-'));
            UTILS.toggleClasses(false, previousIcons, tEl);

            UTILS.toggleClasses(true, [!tEl.checked ? icons[0] : icons[1]], tEl);
            await smart_LoadCSS(themes.toogle(ddm_css_theme_stt.sessionValue), ddm_main_theme_id);
        }
    }
    async function navigateToSettingsPageInSidebar()
    {
        // caution:
        const SttPages = () => UTILS.innerElsContains('.rm-sidebar-outline .rm-title-display span', TARGET_PAGE);
        const anySidebarInstance = () => SttPages().length >= 1;

        const wrapper = document.querySelector('#navigate-to-yt-gif-settings-page');
        const tooltipObj = getTooltipFlipObj(wrapper.querySelector(`[data-tooltip]`))
        const iconObj = getIconFlipObj(wrapper.querySelector(`input`));

        const toogleVisuals = (bol) =>
        {
            toogleTooltips(bol, tooltipObj);
            toogleIcons(bol, iconObj);
        }
        const toogleOnSidebar = () => toogleVisuals(anySidebarInstance())


        tooltipObj.el.addEventListener('click', async function (e)
        {
            // caution: how do you communicate with the other scripts? Interfaces? Events? WindowEvents?
            await RAP.setSideBarState(3);
            await RAP.sleep(50); // an observer is the safest option though

            if (!anySidebarInstance())
            {
                toogleVisuals(true);
                await RAP.openBlockInSidebar(TARGET_UID); // backend execution... should it be here...? //https://stackoverflow.com/questions/12097381/communication-between-scripts-three-methods#:~:text=All%20JS%20scripts%20are%20run%20in%20the%20global%20scope.%20When%20the%20files%20are%20downloaded%20to%20the%20client%2C%20they%20are%20parsed%20in%20the%20global%20scope
            }

            // fires settings page instance
            await RAP.sleep(50);
            SttPages()?.[0]?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        });

        tooltipObj.el.addEventListener('mouseenter', toogleOnSidebar);


        const { icon } = GetMainYTGIFicon(ddm_icon);
        icon.addEventListener('blur', toogleOnSidebar, true);
        icon.addEventListener('mouseenter', toogleOnSidebar, true);
        icon.addEventListener('mouseleave', toogleOnSidebar, true);
    }
    /* ************* */
    function initialize_modes_synergy(slider, input_x_buffer, initialize_mode)
    {
        initialize_mode.addEventListener('change', e => input_x_buffer.disabled = false)

        input_x_buffer.addEventListener('customChange', ifBuffer_ShiftOldest);
        slider.addEventListener('click', ifBuffer_ShiftOldest);
        slider.addEventListener('wheel', ifBuffer_ShiftOldest);
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
                        const sessionValue = window.YT_GIF_DIRECT_SETTINGS.get(id)?.sessionValue;
                        const bol = typeof sessionValue === 'undefined' ? true : sessionValue;
                        btn.checked = bol;
                        ToogleVisualFeedback(bol);
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

        const getContent = () => parentTarget?.closest('.dropdown-content');

        icon.addEventListener('blur', localBlur);

        awaitingWrapper.addEventListener('mouseenter', (e) =>
        {
            icon.dispatchEvent(new Event('click'));
            UnfocusEverytingButThis(true);
            toggle_VisualFeedback(e.currentTarget, false);
        })
        awaitingWrapper.addEventListener('mouseleave', (e) =>
        {
            toggleFocusOnDMMsparents(true);
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
            const ownContent = [getContent(), mainDDM];

            for (const el of ownContent)
                UTILS.toggleClasses(toggle, [ddm_focus], el); // focus this

            if (toggle)
                icon.dispatchEvent(new Event('click'));
        }
        function UnfocusEverytingButThis(toggle)
        {
            const otherTutContent = [...document.querySelectorAll('.dropdown-item.yt-gif-wrapper-parent')]
                .map(tut => tut.closest('.dropdown-info-box.dropdown-focus'))
                .filter((v, i, a) => !!v && v != getContent() && a.indexOf(v) === i);
            for (const el of otherTutContent)
                UTILS.toggleClasses(!toggle, [ddm_focus], el);
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
    function iconIsPulsing(bol)
    {
        return UTILS.toggleClasses(bol, [cssData.dwn_pulse_anim], icon)
    }
    //#endregion


    //#region 6. Emulate slash menu & timestamps
    function toggleTimestampEmulation(bol)
    {
        if (bol)
            RunEmulation();
        else
            StopEmulation();

        UTILS.toggleClasses(!bol, [`${cssData.dropdown__hidden}`], document.querySelector('.dropdown_timestamp-style'));

        function RunEmulation()
        {
            StopEmulation();
            ToogleTimestampSetUp(true);
            ToogleTimestampShortcuts(shortcuts_option.selected);
        }
        function StopEmulation()
        {
            ToogleTimestampSetUp(false);
            ToogleTimestampShortcuts(false);
        }
    }
    function ToogleTimestampSetUp(bol)
    {
        timestampObserver.disconnect();

        if (bol)
        {
            const found = [];
            found.push(...targetNode.getElementsByClassName(timestampObj.start.targetClass));
            found.push(...targetNode.getElementsByClassName(timestampObj.end.targetClass));
            cleanAndSetUp_TimestampEmulation(found);
            timestampObserver.observe(targetNode, config);
        }
        else
        {
            const foundToRemove = [...targetNode.querySelectorAll(`[${timestampObj.attr.emulation}]`)];
            for (let i of foundToRemove)
            {
                const key = i.getAttribute(timestampObj.attr.timestampStyle) || 'timestamp';
                i.innerHTML = key;
                i = UTILS.ChangeElementType(i, 'button');
                i.className = timestampObj[key].buttonClass;
            }
            // already disconnected
        }
    }
    function ToogleTimestampShortcuts(bol)
    {
        // remove them anyway, avoid duplicates
        document.removeEventListener('keydown', keyupEventHanlder);
        if (bol)
        {
            keyupEventHanlder = registerKeyCombinations;
            document.addEventListener('keydown', keyupEventHanlder);
        }
        else
        {
            // already removed
        }
    }


    // 6.1 on valid dom nodes get last component and add timestamp + click events
    async function cleanAndSetUp_TimestampEmulation(found)
    {
        let siblingsArr = [];

        let startEndComponentMap = null;
        const componentMapMap = new Map();

        let emulationArr = [];
        const succesfulEmulationMap = new Map();
        const componenSel = `.${timestampObj.end.targetClass}, .${timestampObj.start.targetClass}, .${timestampObj.parent.className}`;
        const isKey = 'is component';


        const renderedComponents = found.filter(node => isRendered(node) && UTILS.isNotZoomPath(node))
        for (const node of renderedComponents)
        {
            const block = closestBlock(node);
            if (!block) continue;

            const tempUID = block?.id?.slice(-9);
            const mapsKEY = block.id;
            const update_startEndComponentMap = async () => startEndComponentMap = await getMap_smart(mapsKEY, componentMapMap, getComponentMap, tempUID, StartEnd_Config);


            // you are iterating through renderedComponents (mutation records), so you need to get the original siblings of each block
            siblingsArr = ElementsPerBlock(block, `:is(${componenSel})`);
            await update_startEndComponentMap();

            if (!startEndComponentMap || ((startEndComponentMap.size !== siblingsArr.length) && !MapAtIndex_Value(startEndComponentMap, siblingsArr.indexOf(node), isKey)))
            {
                // console.count(`YT GIF Timestamps: updating block strings: ((${tempUID})) ...        ...       ...         ...`);
                await RAP.sleep(800); // YIKES!!!
                componentMapMap.set(mapsKEY, await getComponentMap(tempUID, StartEnd_Config));
                await update_startEndComponentMap();
            }


            let targetNodeParent = siblingsArr.find(x => x === node);
            const targetIndex = siblingsArr.indexOf(node);
            if (targetIndex == -1 || !targetNodeParent || !targetNodeParent?.parentNode) continue;


            const timestampContent = MapAtIndex_Value(startEndComponentMap, targetIndex, isKey);
            if (!timestampContent) continue;
            const ObjAsKey = MapAtIndex_ObjKey(startEndComponentMap, targetIndex, isKey);
            const indent = parseInt(ObjAsKey.indent, 10);
            const similarCount = ObjAsKey.similarCount;
            const similarCountButRoot = indent == 0 ? 0 : similarCount;
            const fromUid = ObjAsKey.uid;

            const key = Object.keys(timestampObj).find(key => targetNodeParent.classList.contains(timestampObj[key]?.targetClass)); // find timestampObj key that is included in targetNode classlist
            const page = timestampObj[key]?.page || 'timestamp';

            targetNodeParent.attributes?.forEach?.(attr => targetNodeParent.removeAttribute(attr.name));
            targetNodeParent = UTILS.ChangeElementType(targetNodeParent, 'div');
            targetNodeParent.className = timestampObj.parent.className;
            targetNodeParent.innerHTML = '';

            const targetNode = UTILS.elm('', 'a');
            targetNode.setAttribute(timestampObj.attr.timestampStyle, page);
            targetNode.setAttribute(timestampObj.attr.emulation, '');
            targetNode.setAttribute(timestampObj.attr.timestamp, timestampContent);
            targetNode.className = timestampObj.roamClassName;
            targetNode.innerHTML = timestampContent;
            targetNode.innerHTML = fmtTimestamp(UI.timestamps.tm_workflow_display.value)(targetNode.innerHTML); // javascript is crazy!


            const targetNodePpts = {
                fromUniqueUid: fromUid + similarCountButRoot,
                similarCount: parseInt(similarCount, 10),
                page, indent, targetIndex, tempUID, fromUid,
                targetNode, appendToParent: () => targetNodeParent.appendChild(targetNode),
                targetNodeParent,
                timestamp: timestampContent,
                color: window.getComputedStyle(targetNode).color,
                ObjAsKey, blockUid: tempUID, blockID: mapsKEY, startEndComponentMap
            }


            emulationArr = await getMap_smart(mapsKEY, succesfulEmulationMap, () => []);
            emulationArr = UTILS.pushSame(emulationArr, targetNodePpts);
        }

        const { getDuration } = await durationObj(succesfulEmulationMap);
        for (let values of succesfulEmulationMap.values())
        {
            values = values.sort((a, b) => a.indent - b.indent); // RAP utils
            const sortedByUid = sortObjByKey('fromUniqueUid', values);
            const targetObjsArr = sortedByUid.map((v, i, a) => a[i]['data']);


            for (const ArrObjs of targetObjsArr)
            {
                const findPage = (p) => [...ArrObjs].reverse().find(x => x.page == p);
                const lastArr = [findPage('start'), findPage('end')];
                const completePears = lastArr.every(el => !!el);

                for (const o of ArrObjs)
                {
                    if (!o?.targetNode)
                        return;

                    o.targetNode.oncontextmenu = e => e.preventDefault(); //https://codinhood.com/nano/dom/disable-context-menu-right-click-javascript

                    const isPear = lastArr.includes(o); // both used inside these functions
                    let duration = getDuration(o.blockID); // gain some performance
                    duration = (duration ?? 0) ? parseInt(fmtTimestamp('S')(duration)) : duration; // if it is anything else but null or undefined, then parse it to secondsOnly
                    // changeSetIfPear();
                    validateSelf(duration);

                    if (isPear)
                    {
                        const set = completePears ? 'pears' : 'single';
                        o.targetNode.setAttribute('timestamp-set', set);
                    }


                    async function OnClicks(e)
                    {
                        await PlayPauseOnClicks(e, o.tempUID, { self: o, pears: (isPear && completePears) ? lastArr : null });
                    }
                    async function validateSelf(d)
                    {
                        if (typeof d !== 'number')
                            return;
                        if (duration == parseInt(d) && o.targetNode.hasAttribute('out-of-bounds'))
                            return; // already set, exit
                        duration = parseInt(d); // good to go
                        if (typeof duration !== 'number')
                            return; // invalid, exit

                        const tm = parseInt(fmtTimestamp('S')(o.timestamp));
                        const bounded = tm >= 0 && tm <= parseInt(duration);

                        UTILS.toggleAttribute(!bounded, 'out-of-bounds', o.targetNode);
                    }

                    o.targetNode.addEventListener('customMousedown', OnClicks);
                    o.targetNode.onmousedown = OnClicks;
                    o.targetNode.OnClicks = OnClicks;
                    o.targetNode.validateSelf = validateSelf;
                    o.appendToParent(); // I'm using observers and these functions take just a little bit of longer to get attached, NOW it should be ok
                }
            }
        }



        function sortObjByKey(key, obj)
        {// https://gist.github.com/JamieMason/0566f8412af9fe6a1d470aa1e089a752
            const groupBy = key => array => array.reduce((objectsByKeyValue, obj) =>
            {
                const value = obj[key];
                objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
                return objectsByKeyValue;
            }, {});
            const groupByKey = groupBy(key);
            const objByKey = groupByKey(obj);
            return Object.entries(objByKey).map(([title, data]) => ({ title, data }));
        }
        async function durationObj(succesfulEmulationMap)
        {
            const obj = { getDuration: () => null }

            if (!isSelected(UI.timestamps.tm_options, 'YT_API_KEY_V3'))
                return obj;


            let wrapperObjs = [];
            const rawTargets = [...succesfulEmulationMap.values()].map(arrs => arrs[0]?.targetNodeParent);
            if (rawTargets.length == 0)
                return obj;



            for (const el of rawTargets)
            {
                const o = await getWrapperInHierarchyObj(el);
                if (!wrapperObjs.find(x => x.id == o.id)) // push if o.id is not in wrapperObjs
                    wrapperObjs.push(o);
            }


            const durationMap = new Map(); // store duration of each grandparent wrapper, if any
            for (const wo of wrapperObjs)
            {
                const lastUrl = wo.lastWrapper?.getAttribute('data-video-url');
                const videoId = UTILS.getYouTubeVideoID(lastUrl ?? '') || 'invalid';
                if (durationMap.has(wo.id) && !durationMap.get(wo.id))
                    YTvideoIDs.delete(videoId); // it fetched something wrong, clean it and try angain
                // getMap_smart -> avoid making redundant requests from YT API V3
                durationMap.set(wo.id, await getMap_smart(videoId, YTvideoIDs, tryToGetUrlDuration, videoId));
            }


            return {
                getDuration: (targetBlockID) =>
                {
                    // a grandparent wrapper should have it's duration
                    const foundBlockID = wrapperObjs.find(x => x.container?.contains(document.getElementById(targetBlockID)))?.id;
                    return durationMap.get(foundBlockID);
                },
            }
        }
    }
    async function getLastWrapper_RAP(uid, el)
    {
        const { lastWrapperInBlock, root } = await getYTwrapperRootObj(uid, el);
        const lastWrapper = lastWrapperInBlock?.(root);
        return {
            lastWrapper,
            id: closestBlock(lastWrapper)?.id,
        }
    }

    // 6.1.1
    async function PlayPauseOnClicks(e, uid, targetNodePpts)
    {
        const { currentTarget: tEl } = e;
        const { which, seekToMessage, simMessage } = typeof e.detail == 'object' ? e.detail : e;

        if (tEl.hasAttribute('awaiting')) return;
        tEl.setAttribute('awaiting', true);


        const { pulse } = PulseObj(tEl);
        const { click, rghtclick, mdlclick } = getClicks();

        const {
            lastWrapperInBlock, WrappersInBlock,
            f_uid, blockExist,
            root, crossRoot, mainRoot,
        } = await getYTwrapperRootObj(uid, tEl);



        if (!blockExist) // fail
        {
            if (click || rghtclick || !f_uid)
                pulse('red');
            else if (mdlclick)
                return await openingOnCrossRoot();

            return NoLongerAwaiting();
        }


        if (click || rghtclick) // success
        {
            if (e['altKey'])
                await ClickResetWrapper(lastWrapperInBlock(root));
            else if (click)
                await playLastBlockOnly_SimHover(root);
            else if (rghtclick)
                await TogglePlayOnAtrr_SimHover(root);

            return NoLongerAwaiting();
        }


        if (mdlclick) // opening?
        {
            return await openingOnCrossRoot();
        }



        return NoLongerAwaiting();



        async function playLastBlockOnly_SimHover(r)
        {
            pulse('green');


            const boundaryObj = await getBoundaryObj(r);
            if (!boundaryObj.success)
                return;
            if (simMessage == 'visuals')
                pulse('purple');


            // 1.
            const { record, obsTimestamp, targetWrapper, timestampObj } = boundaryObj;
            const { start, end, currentTime, seekTo, page, ok } = timestampObj;


            // 3.0
            if (simMessage == 'visuals' && ok && seekToMessage != 'seekTo-strict')
                return;
            // 3.1
            await ReloadYTVideo({ t: record?.player, start, end });


            // 4.0
            if (seekToMessage == 'seekTo-soft' && ok)
                record?.player?.seekTo?.(currentTime);
            else if (seekTo != start) // ReloadYTVideo already seeks to start
                record?.player?.seekTo?.(seekTo);


            // 4.1
            record?.isSoundingFine?.(!(UI.timestamps.tm_seek_action.value == 'mute'));
            record?.togglePlay?.(!(UI.timestamps.tm_seek_action.value == 'pause'));


            // 5.
            targetWrapper?.dispatchEvent(new CustomEvent('customPlayerReady',
                {
                    detail: {
                        start, end, page,
                        updateTime: currentTime ?? seekTo,
                        ['play-right-away']: !(UI.timestamps.tm_seek_action.value == 'pause'),
                        mute: UI.timestamps.tm_seek_action.value == 'mute',
                        obsTimestamp,
                    },
                }))


            // 6.
            if (e['ctrlKey'])
                ScrollToTargetWrapper(r);
        }
        async function getBoundaryObj(r)
        {
            const targetWrapper = lastWrapperInBlock(r);


            // 1. pause everthing but this
            const deactivateAll = [...document.querySelectorAll('.yt-gif-wrapper')]
                .filter(el => !el.closest('.ddm-tut')) // yikes
                .forEach(wrapper =>
                {
                    UTILS.toggleAttribute(false, 'yt-active', wrapper);
                    if (wrapper != targetWrapper)
                        wrapper?.dispatchEvent(UTILS.simHoverOut());
                });


            // 2. 
            const validTimestamp = tEl.innerHTML.match(StartEnd_Config.targetStringRgx)?.[0];
            const secondsOnly = UTILS.HMSToSecondsOnly(validTimestamp);
            if (!validTimestamp || typeof secondsOnly !== 'number')
            {
                return { success: false };
            }


            // 2.1
            const targetBlockID = [...recordedIDs.keys()].reverse().find(k => k?.startsWith(closestYTGIFparentID(targetWrapper)));
            const record = recordedIDs.get(targetBlockID);
            const obsBlockID = [...observedParameters.keys()].reverse().find(k => k?.endsWith(getWrapperUrlSufix(targetWrapper, f_uid)));
            const obsTimestampOrg = observedParameters.get(obsBlockID)?.lastActiveTimestamp ?? {};
            const obsTimestamp = { ...obsTimestampOrg };


            // 3.
            DeactivateTimestampsInHierarchy(closest_rm_container(targetWrapper), targetWrapper);
            ToggleBoundarySet(targetWrapper, true);


            return {
                sameBoundaries: record?.sameBoundaries?.(),
                success: true,

                record, obsTimestamp, targetWrapper,

                timestampObj: getSeconds(),
            }

            function getSeconds()
            {
                const start = sec("start") ? secondsOnly : (pearSec() || 0);
                const end = sec("end") ? secondsOnly : pearSec() || record?.player?.getDuration?.();
                const seekTo = sec("end") ? secondsOnly + 1 : secondsOnly;

                const tm = record?.player?.getCurrentTime?.();
                const currentTimeAlternative = lastBlockIDParameters.get(targetBlockID)?.updateTime;
                const currentTime = tm ?? currentTimeAlternative ?? start;

                const bounded = ((tm = currentTime) => tm >= start && tm <= end)();
                const farEnough = ((tm = currentTime) => tm + 1 > seekTo)();

                return {
                    start, end, page: sec("end") ? "end" : "start",
                    seekTo, currentTime,
                    ok: bounded && farEnough
                }

                function sec(p) { return targetNodePpts.self.page == p }
                function pearSec() { return UTILS.HMSToSecondsOnly(targetNodePpts.pears?.find(o => o != targetNodePpts.self)?.timestamp || '') }
            }
        }


        function ToggleBoundarySet(targetWrapper, bol = true)
        {
            if (targetNodePpts.pears)
                targetNodePpts.pears.forEach(o => toogleActiveAttr(bol, o.targetNode));

            else
                toogleActiveAttr(bol, targetNodePpts.self.targetNode);

            UTILS.toggleAttribute(bol, 'last-active-timestamp', targetNodePpts.self.targetNode);
            UTILS.toggleAttribute(bol, 'yt-active', targetWrapper);

            function toogleActiveAttr(bol, el)
            {
                if (el)
                    UTILS.toggleAttribute(bol, 'active-timestamp', el);
            }
        }

        async function TogglePlayOnAtrr_SimHover(r)
        {
            pulse('blueViolet');
            const lastWrapper = lastWrapperInBlock(r);
            const iframe = lastWrapper?.querySelector('iframe');

            if (iframe?.hasAttribute('yt-playing')) // pepega
                lastWrapper?.dispatchEvent(UTILS.simHoverOut()); // hover out -> videoIsPlayingWithSound(false)
            else if (iframe)
                lastWrapper?.dispatchEvent(UTILS.simHover());
        }


        async function openingOnCrossRoot()
        {
            await RAP.setSideBarState(3);
            await RAP.sleep(50);

            pulse('blue');
            if (WrappersInBlock(crossRoot).length == 0) // 0 instances on crossRoot
            {
                await RAP.navigateToUiOrCreate(f_uid, (root == mainRoot), 'block');
            }

            const prevWrapper = lastWrapperInBlock(crossRoot);
            const isRendered = prevWrapper instanceof Element && UTILS.isElementVisible(prevWrapper);
            await RAP.sleep(isRendered ? 50 : 500); // visible? then quicker

            ScrollToTargetWrapper(crossRoot);

            await playLastBlockOnly_SimHover(crossRoot);
            return NoLongerAwaiting();
        }


        function ScrollToTargetWrapper(r)
        {
            lastWrapperInBlock(r)?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        }
        function getClicks()
        {
            return {
                click: which == 1,
                rghtclick: which == 3,
                mdlclick: which == 2,
            }
        }
        function NoLongerAwaiting()
        {
            tEl.removeAttribute('awaiting');
        }
    }
    async function getYTwrapperRootObj(uid, tEl)
    {
        const { foundBlock } = await getLastComponentInHierarchy(uid);
        if (!foundBlock?.uid) console.warn(`YT GIF Timestamps: couldn't find YT GIFs within the Hierarchy: ((${uid}))`);
        const { uid: f_uid } = foundBlock || { uid: '' };


        const barObj = {
            tEl,
            condition: function () { return this.tEl.closest(`.${this.root}`) },
        }
        const PagesObj = {
            main: {
                root: 'roam-article',
                crossRoot: 'rm-sidebar-outline',
            },
            side: {
                root: 'rm-sidebar-outline',
                crossRoot: 'roam-article',
            },
            pageRef: {
                root: 'rm-reference-main',
                crossRoot: 'rm-sidebar-outline',
            },
        };


        Object.keys(PagesObj).forEach(key => Object.assign(PagesObj[key], barObj));
        const key = Object.keys(PagesObj).find(x => PagesObj[x].condition());
        const { root, crossRoot } = PagesObj[key];
        const blockExist = document.querySelector(`.${root} [id$="${f_uid}"]`);



        // root -> roam-article || rm-sidebar-outline
        const WrappersInBlock = (r) =>
        {
            const wrappers = [...document.querySelectorAll(`.${r} [id$="${f_uid}"] .yt-gif-wrapper`)];

            if (r == PagesObj.main.crossRoot)
                return wrappers; // they don't have this tEl

            return wrappers.map(pw => closest_rm_container(pw))
                .filter(pc => pc.contains(tEl))
                .map(c => [...c.querySelectorAll(`[id$="${f_uid}"] .yt-gif-wrapper`)])
                .flat(Infinity);
        }

        const lastWrapperInBlock = (r = root) => [...WrappersInBlock(r)]?.pop();


        return {
            lastWrapperInBlock, WrappersInBlock,
            f_uid, blockExist,
            root, crossRoot, mainRoot: PagesObj.main.root,
        }
    }

    //#region 6.2.1
    async function updateTimestampOnMouseleave(e, uid, nodePpts)
    {
        const { currentTarget: tEl } = e;
        toogleDocumentScroll(tEl, false);
        const { blockRgx } = BlockRegexObj(StartEnd_Config.componentPage, true);
        const res = RAP.getBlockInfoByUID(nodePpts.fromUid);
        const rawText = res[0]?.[0]?.string || 'F';
    }
    async function rawTimestampOnWheel(e, uid)
    {
        const { currentTarget: tEl } = e;
        if (!tEl.parentNode.classList.contains('yt-gif-timestamp-prevent-scroll')) return;

        const validTimestamp = tEl.innerHTML.match(StartEnd_Config.targetStringRgx)?.[0];
        const secondsOnly = UTILS.HMSToSecondsOnly(validTimestamp);

        if (!validTimestamp || typeof secondsOnly !== 'number') return;

        const newTimestamp = SliderValue(secondsOnly);
        tEl.innerHTML = UTILS.convertHMS(newTimestamp);

        function SliderValue(value)
        {
            const dir = Math.sign(e.deltaY) * -1;
            const parsed = parseInt(value, 10);
            return Number(dir + parsed);
        }
    }
    // 6.2.2
    function toogleDocumentScroll(el, bol)
    {
        UTILS.toggleClasses(bol, ['yt-gif-timestamp-prevent-scroll'], el);
    }
    //#endregion



    // 6.3
    async function registerKeyCombinations(e)
    {
        if (e['ctrlKey'] && e['altKey']) 
        {
            let pageRefSufx = null;
            if (e.key == 's') // Ctrl + Alt + s
            {
                pageRefSufx = 'start'
            }
            else if (e.key == 'd') // Ctrl + Alt + d
            {
                pageRefSufx = 'end'
            }
            await addBlockTimestamp_smart_local(pageRefSufx);
        }
    }
    // 6.3.1
    async function addBlockTimestamp_smart_local(pageRefSufx)
    {
        const timestampObj = await getTimestampObj_smart(pageRefSufx);
        const uid = timestampObj.uid;
        const component = timestampObj[UI.timestamps.tm_workflow_grab.value]?.fmt ?? '';
        if (!uid) return;

        const { updatedString, el } = concatStringAtCaret(getCurrentInputBlock(), component);

        await RAP.updateBlock(uid, updatedString);
        await RAP.sleep(50);

        updateAtCaret(getCurrentInputBlock(), el.selectionEnd);
    }
    function updateAtCaret(el, atLength = 0, start = false)
    {
        if (start)
            el.selectionStart = el.selectionEnd = atLength;
        else
            el.selectionEnd = el.selectionStart = atLength;
        el.focus();
    }
    function concatStringAtCaret(el, newText)
    {
        const start = el.selectionStart
        const end = el.selectionEnd
        const text = el.value
        const before = text.substring(0, start)
        const after = text.substring(end, text.length)
        el.value = (before + newText + after)
        updateAtCaret(el, (end + newText.length));

        return { updatedString: el.value, el }
    }


    // 6.0 observe added/removed nodes and act accordingly
    function slashMenuMutation_cb(mutationsList, observer)
    {
        const found = [];
        const removed = [];

        for (const { addedNodes, removedNodes } of mutationsList)
        {
            for (const node of addedNodes)
            {
                if (!node.tagName) continue; // not an element

                if (node.classList.contains(slashObj.targetClass) && !node.classList.contains(slashObj.emulationClass))
                {
                    found.push(node);
                }
                else if (node.firstElementChild)
                {
                    found.push(...node.getElementsByClassName(slashObj.targetClass));
                }
            }

            for (const node of removedNodes)
            {
                if (!node.tagName) continue; // not an element

                if (node.classList.contains(slashObj.targetClass) && !node.classList.contains(slashObj.emulationClass))
                {
                    removed.push(node);
                }
                else if (node.firstElementChild)
                {
                    removed.push(...node.getElementsByClassName(slashObj.targetClass));
                }
            }
        }

        if (removed.length == 0 && found.length == 0) return;

        const timeNode = (node) => node.innerHTML.includes('Time');
        const YTtimeNode = (node) => node.innerHTML.includes('YT GIF');
        const validTimeNode = (node) => timeNode(node) && !YTtimeNode(node);

        const dontUnfocusBlocks = [...document.querySelectorAll('body > div.rm-autocomplete__results.bp3-elevation-3 > .dont-unfocus-block .bp3-text-overflow-ellipsis')];
        const emulations = [...document.querySelectorAll(`body > div.rm-autocomplete__results.bp3-elevation-3 > [class*="${slashObj.emulationClass}"]`)];
        const LastTimeNode = dontUnfocusBlocks.reverse().find(node => validTimeNode(node));
        const AnyTimeNodeExist = dontUnfocusBlocks.filter(node => validTimeNode(node)).length != 0;


        for (const node of found)
        {
            const clone = node?.parentNode?.cloneNode(true);
            if (clone?.querySelector('.bp3-text-overflow-ellipsis')?.innerHTML &&
                clone?.querySelector('.rm-icon-key-prompt')?.innerHTML &&
                clone?.querySelector('.bp3-icon')?.className)
            {
                slashObj.clone = clone;
            }


            const emulations = [...document.querySelectorAll(`body > div.rm-autocomplete__results.bp3-elevation-3 > [class*="${slashObj.emulationClass}"]`)];


            if (validTimeNode(node))
            {
                const parent = node.parentNode;

                if (slashObj.clone && emulations.length == 0)
                {
                    const start = createSlashMenuEmulation_videoItem({
                        cloneFrom: slashObj.clone,
                        emulationSufix: '-start',
                        prompt: 'YT GIF Timestamp - start',
                        shortutPrompt: 'Ctrl + Alt + s',
                    });
                    parent.parentNode.insertBefore(start, parent);
                    start.addEventListener('click', async () => addBlockTimestamp_smart_local('start'));


                    const end = createSlashMenuEmulation_videoItem({
                        cloneFrom: slashObj.clone,
                        emulationSufix: '-end',
                        prompt: 'YT GIF Timestamp - end',
                        shortutPrompt: 'Ctrl + Alt + d',
                    });
                    parent.parentNode.insertBefore(end, parent);
                    end.addEventListener('click', async () => addBlockTimestamp_smart_local('end'));
                }

                if (LastTimeNode)
                {
                    const parent = LastTimeNode.parentNode;
                    emulations.forEach(el => parent.parentNode.insertBefore(el, parent));
                }
            }
        }


        for (const node of removed)
        {
            if (timeNode(node) && !AnyTimeNodeExist)
            {
                emulations.forEach(x => x.remove());
                return;
            }
        }

        function createSlashMenuEmulation_videoItem({ cloneFrom, emulationSufix, prompt, shortutPrompt, iconSufix })
        {
            iconSufix = iconSufix || 'video';
            const el = cloneFrom.cloneNode(true);

            el.classList.add(slashObj.emulationClass + emulationSufix);
            el.querySelector('.bp3-text-overflow-ellipsis').innerHTML = prompt;
            el.querySelector('.rm-icon-key-prompt').innerHTML = shortutPrompt;
            el.querySelector('.bp3-icon').className = `bp3-icon bp3-icon-${iconSufix}`;
            return el;
        }
    };
    async function TimestampBtnsMutation_cb(mutationsList)
    {
        const found = [];

        for (const { addedNodes } of mutationsList)
        {
            for (const node of addedNodes)
            {
                if (!node.tagName) continue; // not an element

                if (node.classList.contains(timestampObj.start.targetClass) || node.classList.contains(timestampObj.end.targetClass))
                {
                    found.push(node);
                }
                else if (node.firstElementChild)
                {
                    found.push(...node.getElementsByClassName(timestampObj.start.targetClass));
                    found.push(...node.getElementsByClassName(timestampObj.end.targetClass));
                }
            }
        }

        await cleanAndSetUp_TimestampEmulation(found);
    }


    // 7.0 display
    function ChangeTimestamapsDisplay(value)
    {
        const fmt = fmtTimestamp(value);

        document.querySelectorAll('[yt-gif-timestamp-emulation]')
            .forEach(tms => tms.innerHTML = fmt(tms.innerHTML));
    }
    function fmtTimestamp(value)
    {
        const str2sec = (str) => UTILS.HMSToSecondsOnly(str)
        let fmt = (tms) => tms;

        if (value == 'lessHMS')
            fmt = (tms) => UTILS.seconds2time(str2sec(tms));
        else if (value == 'HMS')
            fmt = (tms) => UTILS.convertHMS(str2sec(tms));
        else if (value == 'S')
            fmt = (tms) => str2sec(tms);

        return fmt;
    }

    //#endregion


    //#region 7. url btn emulation
    async function InlineUrlBtnMutations_cb(mutationsList)
    {
        let added = [];
        for (const { addedNodes } of mutationsList)
            added = [...added, ...NodesRecord(addedNodes, 'bp3-icon-video')];

        ReadyUrlBtns(added);
    }
    function ReadyUrlBtns(added)
    {
        for (const rm_btn of added)
        {
            UTILS.toggleClasses(true, ['yt-gif'], rm_btn);
            rm_btn.insertAdjacentHTML('afterbegin', links.html.fetched.urlBtn);


            const floatParam = (p, url) => new RegExp(`((?:${p})=)((\\d+)?[.]?\\d+)`, 'gm')?.exec(url)?.[2] || '0';
            const getFmtPage = (p, url) => fmtTimestamp(UI.timestamps.tm_workflow_display.value)(floatParam(p, url)); // javascript is crazy!

            const startParam = (url) => getFmtPage('t|start', url);
            const endParam = (url) => getFmtPage('end', url);


            urlBtn('yt-gif').onclick = async (e) => await OnYtGifUrlBtn(e, (url) => `{{[[yt-gif]]: ${url} }}`);
            urlBtn('start').onclick = async (e) => await OnYtGifUrlBtn(e, (url) => `{{[[yt-gif/start]]: ${startParam(url)} }}`);
            urlBtn('end').onclick = async (e) => await OnYtGifUrlBtn(e, (url) => `{{[[yt-gif/end]]: ${endParam(url)} }}`);
            urlBtn('start|end').onclick = async (e) => await OnYtGifUrlBtn(e, (url) => `{{[[yt-gif/start]]: ${startParam(url)} }} {{[[yt-gif/end]]: ${endParam(url)} }}`);



            async function OnYtGifUrlBtn(e, fmtCmpnt_cb)
            {
                // 0.
                const tEl = e.currentTarget;
                e.stopPropagation();
                e.preventDefault();


                // 1. execute further if the user has valid keys
                const block = closestBlock(rm_btn);
                const uid = block?.id?.slice(-9);
                const { url, ytUrlEl } = getYTUrlObj(rm_btn);

                if (!ValidUrlBtnUsage())
                    return console.warn('YT GIF Url Button: Invalid Simulation keys');
                if (!uid || !url)
                    return logUrlBtnWarning();


                // 2. protect against spamming clicks
                const awaiting = (bol) => awaitingAtrr(bol, rm_btn) && awaitingAtrr(bol, tEl);

                if (rm_btn.hasAttribute('awaiting'))
                    return;

                awaiting(true);


                // 3. execute further if the block and the urlBtn exist
                const blockReq = await RAP.getBlockInfoByUIDM(uid);
                const info = blockReq[0]?.[0];
                if (!info) return;

                const index = ElementsPerBlock(block, `.bp3-icon-video + a[href="${url}"]`).indexOf(ytUrlEl);
                if (index == -1)
                    return logUrlBtnWarning();


                // 4. gather spots/boundaries where roam does NOT render information
                const IndexObj = (rgx, type) => indexPairObj(rgx, info.string, type);
                const BadIndexMatches = [
                    ...IndexObj(/(`.+?`)|(`([\s\S]*?)`)/gm, 'codeBlocks'), // codeBlocks

                    ...filterOutCode(IndexObj(/{{=:(.+?)\|(.+)}}/gm, 'tooltipPrompt'))
                        .map(op =>
                        {
                            const y = { ...op };
                            y.start = op.start + 4; // 4 = {{=:
                            y.end = op.end - (1 + op.groups[2]?.length + 2); // 1 = |     +    [2].length = hiidden content   +    2 = }}
                            y.match = op.groups[1]; // prompt
                            return y;
                        }), // tooltipPrompt

                    ...filterOutCode(IndexObj(/({{.+})/gm, 'components')), // components
                ];


                // 5. valid spots where you can insert fmt components - user requests
                const urlsMatches = IndexObj(new RegExp(`(${url.replace(/[?\\]/g, '\\$&')})`, 'gm'), 'urlsMatch');
                const freeUrls = urlsMatches.filter(uo =>
                {
                    let specialCase = false;
                    const badIndex = BadIndexMatches
                        .some(bio =>
                        {
                            const bounded = uo.start >= bio.start && uo.end <= bio.end;
                            specialCase = bio.type == 'tooltipPrompt';
                            return bounded;
                        });

                    if (specialCase)
                        return true;
                    return !badIndex;
                })


                // 6. return if any errors
                let string;
                try
                {
                    string = replaceString(info.string, freeUrls[index].start, freeUrls[index].end, fmtCmpnt_cb(url));
                }
                catch (error)
                {
                    return logUrlBtnWarning();
                }


                // 7. FINALLY! update the block
                UIDtoURLInstancesMapMap.delete(uid);
                await RAP.updateBlock(uid, string, info.open);


                // 8. set free for any possible future clicks
                awaiting(false);


                function logUrlBtnWarning()
                {
                    console.warn(`YT GIF Url Button: couldn't find url within the block: ((${uid}))`);
                }
            }
            function urlBtn(page)
            {
                return rm_btn.querySelector(`[yt-gif-url-btn="${page}"]`);
            }
        }


        function indexPairObj(regex, str, type)
        {// https://www.designcise.com/web/tutorial/how-to-return-the-position-of-a-regular-expression-match-in-javascript#:~:text=matchArr%5B1%5D.length%5D)%3B%0A%7D-,console.log(indexPairs)%3B%20//%20output%3A%20%5B8%2C%2025%5D%2C%20%5B27%2C%2035%5D,-The%20exec()%20method
            const matches = [...str.matchAll(regex)];

            const indexPairs = [];

            for (const matchArr of matches)
            {
                indexPairs.push(
                    [
                        matchArr.index,
                        matchArr.index + matchArr[0]?.length,
                        matchArr[0],
                        matchArr
                    ]
                );
            }
            return [...indexPairs].map(mp => ({
                type,
                start: mp[0],
                end: mp[1],
                match: mp[2],
                groups: mp[3],
            }));
        }
        function filterOutCode(indexObj)
        {
            const inlindeCodeRgx = /(`.+?`)|(`([\s\S]*?)`)/gm;
            return [...indexObj].filter(x => !inlindeCodeRgx.test(x.match))
        }
        function replaceString(str, start, end, replace)
        {
            if (start < 0 || start > str.length)
            {
                throw new RangeError(`start index ${start} is out of the range 0~${str.length}`);
            }
            if (end > str.length || end < start)
            {
                throw new RangeError(`end index ${end} is out of the range ${start}~${str.length}`);
            }
            return str.substring(0, start) + replace + str.substring(end);
        }
    }
    function getYTUrlObj(rm_btn)
    {
        const ytUrlEl = rm_btn?.nextSibling;
        let url = ytUrlEl?.href;

        if (!YTGIF_Config.guardClause(url))
            url = null;

        return { url, ytUrlEl };
    }

    function NodesRecord(Nodes, sel)
    {
        if (!Nodes || Nodes.length == 0)
            return [];

        return [...Array.from(Nodes)]
            .filter(el => !!el.tagName)
            .map(x =>
            {
                if (x.classList.contains(sel))
                    return x
                else
                    return [...x.querySelectorAll(`.${sel}`)]
            })
            .flat(Infinity)
            .filter((v, i, a) =>
            {
                return !!v &&
                    getYTUrlObj(v).url &&
                    !hasYTGifAttr(v) &&
                    !hasYTGifClass(v) &&
                    v.classList.contains(sel) &&
                    a.indexOf(v) === i &&
                    isRendered(v);
            })
    }
    /* ****************** */
    function ToogleUrlBtnObserver(bol, obs)
    {
        obs.disconnect();

        if (bol)
        {
            const allUrlBtns_rm = [...document.querySelectorAll('.bp3-icon-video')]
                .filter(b =>
                {
                    // those that do not have yt-gif customization
                    return !hasYTGifAttr(b) && !hasYTGifClass(b) && getYTUrlObj(b).url;
                });

            ReadyUrlBtns(allUrlBtns_rm);
            obs.observe(targetNode, config);
        }
        else
        {
            const allUrlBtns = [...document.querySelectorAll(`.yt-gif-url-btns,.yt-gif-url-btn-wrapper`)]
                .forEach(el => el.remove());
            const allUrlBtns_rm = [...document.querySelectorAll('.bp3-icon-video')]
                .forEach(el => el.classList.remove('yt-gif'));
        }
    }
    function hasYTGifClass(b)
    {
        return [...b.classList]
            .some(x => x.includes('yt-gif'));
    }
    function hasYTGifAttr(b)
    {
        return [...b.attributes]
            .map(a => a.name)
            .some(x => x.includes('yt-gif'));
    }
    /* ****************** */
    function confirmUrlBtnUsage(bol, e)
    {
        const canUse = ValidUrlBtnUsage();
        if (!bol || canUse)
            return;

        const yesMessage = canUse ?
            'Simulate because I have both graph and localStorage keys' :
            'Simulate, but first take me to the caution prompt - localStorage key is missing';

        const userMind = confirm(`YT GIF Url Button: Simulation Request\n\nYES: ${yesMessage} \n   -  https://github.com/kauderk/kauderk.github.io/blob/main/yt-gif-extension/install/faq/README.md#simulate-url-button-to-video-component \n\nNO: Don't simulate`);

        if (userMind)
        {
            localStorage.setItem(s_u_f_key, 'true');
            if (!canUse)
                window.open("https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/install/faq#caution-prompt", '_blank').focus();
        }
        else
        {
            if (e)
            {
                e.stopPropagation();
                e.preventDefault();
                e.currentTarget.customSelect?.(false); // this used to use be a chk tag/events, but since I'm changing them for "class CustomSelect()" a weird loop happens with the 'click' event handler...
                e.currentTarget.parentElement.dispatchEvent(new Event('customChange'));
            }
            localStorage.removeItem(s_u_f_key);
        }
        return userMind;
    }
    function ValidUrlBtnUsage()
    {
        const key = s_u_f_key;
        const binarySessionVal = (k) => UTILS.isTrue(window.YT_GIF_DIRECT_SETTINGS?.get('ms_options')?.sessionValue?.includes?.(k));
        const usageKey = binarySessionVal('override_' + key) || UTILS.isTrue(localStorage.getItem(key));

        return usageKey && binarySessionVal(key)
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
        wrapper.setAttribute('invalid-yt-gif', '')
        return console.log(`YT GIF: Couldn't find yt-gif component number ${accUrlIndex + 1} within the block ((${uid}))`);
    }
    const newId = iframeIDprfx + Number(++window.YT_GIF_OBSERVERS.creationCounter);



    // 2.1 OnPlayerReady video params point of reference
    allVideoParameters.set(newId, ExtractParamsFromUrl(url));
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
    SetUpTimestampRecovery(rm_container);



    // 6. On removed from DOM clear Uid2Url map and deactivate timestamps
    const options = {
        el: grandParentBlock?.querySelector('span'),
        OnRemmovedFromDom_cb: () =>
        {
            UIDtoURLInstancesMapMap.delete(uid);
            if (!UI.timestamps.tm_recovery.checked)
                DeactivateTimestampsInHierarchy(rm_container, wrapper);
            if (!isRendered(rm_container) && rm_container?.closest('.rm-sidebar-outline'))
                observedParameters.delete(getLocalBlockID());
        },
    }
    UTILS.ObserveRemovedEl_Smart(options);



    // 7. 
    if (dataCreation == attrInfo.creation.forceAwaiting || isInput_selectedValid())
    {
        return await DeployYT_IFRAME_OnInteraction();
    }
    else
    {
        await AssertParamsClickTimestamp();
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
            media.id = UTILS.getYouTubeVideoID(url);

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
            //#endregion
        }

        if (success) { return media; }
        else { console.warn(`${newId}    Invalid youtube url detected for yt-gifs ${((uid))}`); }
        return false;
    }

    // 5.0 timestamp recovery
    function SetUpTimestampRecovery(rm_container)
    {
        if (!rm_container || rm_container?.hasAttribute('active-timestamp-observer'))
            return;

        rm_container.setAttribute('active-timestamp-observer', '');

        const arr = [getObsTimestamp()];
        const MutationObj = { removed: arr, lastActive: arr };
        let awaiting = false;

        const observer = new MutationObserver(async (mutationsList) =>
        {
            if (awaiting || !UI.display.simulate_roam_research_timestamps.checked)
                return;

            awaiting == true;

            await TimestampsInHierarchyMutation_cb(mutationsList, MutationObj);

            awaiting == false;
        });

        observer.observe(rm_container, { childList: true, subtree: true, attributes: true });
    }
    async function TimestampsInHierarchyMutation_cb(mutationsList, MutationObj)
    {
        const { lastActive, added } = getMutationNodes(mutationsList, MutationObj);


        // 0. set last active timestamp by attribute
        const lastActiveTimestamp = lastActive.find(aO => aO?.target?.timestamp && aO.blockID);
        setObsTimestamp(lastActiveTimestamp);



        // 1. Reset when removed
        const removedActiveObj = MutationObj.removed.find(rO => rO?.target?.timestamp && canReset(rO.blockID));
        if (removedActiveObj && UI.timestamps.tm_reset_on_removal.value != 'disabled')
        {
            MutationObj.removed.length = 0;

            return await ClickResetWrapper(getTargetWrapper());
        }


        // 2. Restore last active timestamp
        const commonObj = added.find(aO => aO?.blockID && aO.blockID == getObsTimestamp()?.blockID);
        if (commonObj && UI.timestamps.tm_recovery.checked)
        {
            const block = document.getElementById(commonObj.blockID);

            // wait until all timestamps are rendered
            const rawComponents = ElementsPerBlock(block, '.rm-xparser-default-start, .rm-xparser-default-end');
            if (rawComponents.length > 0)
                return;

            const get = (k) => getObsTimestamp()?.target[k];
            const equals = (k = 'timestamp') => get(k) == ElementsPerBlock(block, `[${k}]`)?.[get('index')]?.getAttribute?.(k);

            // cleanup - since it's a rendered mismatch
            if (UI.timestamps.tm_restore.value == 'match' && !equals())
                return observedParameters.delete(getLocalBlockID());

            // value == 'any' - go ahead with anything in this position
            const assignObj = equals() ? { simMessage: 'visuals' } : {};
            return await TryToRecoverActiveTimestamp(getObsTimestamp(), assignObj);
        }


        // 1.2 cleanup - previous unrendered|removed node

        if (!UI.timestamps.tm_recovery.checked && added.length > 0 && MutationObj.removed.length > 0)
        {
            const inactiveYetAdded = MutationObj.removed.find(rO => rO?.target?.timestamp && [...added].some(aO => aO?.target?.timestamp && aO.blockID.includes(rO.blockID))); // HOLY SHIT!!!
            if (inactiveYetAdded)
                MutationObj.removed.splice(MutationObj.removed.indexOf(inactiveYetAdded), 1);
        }


        function canReset(id)
        {
            if ('block' == UI.timestamps.tm_reset_on_removal.value)
            {
                if (!document.querySelector('div.rm-block__input#' + id))
                    return true;
            }
            else if ('container' == UI.timestamps.tm_reset_on_removal.value)
            {
                if (!document.getElementById(id))
                    return true;
            }
        }
    }
    async function TryToRecoverActiveTimestamp(commonObj, assignObj)
    {
        await RAP.sleep(10);

        const children = (sel, self) => !self ? rm_container?.querySelectorAll(sel) : [rm_container, ...rm_container?.querySelectorAll(sel)];
        const atIndex = (siblings, index) => Array.from(siblings).flat(Infinity)[index];

        // const active_rm_container = atIndex(children('.roam-block-container', true), commonObj.containerIndex);
        let active_block = atIndex(children('.roam-block'), commonObj.blockIndex);

        const block = document.getElementById(commonObj.blockID);
        if (block != active_block && commonObj.workflow == 'strict')
        {
            if (!rm_container.contains(block))
                return;
            active_block = block; // Hmmm...
        }

        const timestamps = ElementsPerBlock(active_block, '[yt-gif-timestamp-emulation]') || [];
        const targetTimestamp = timestamps[commonObj.target.index] || timestamps[commonObj.start.index] || timestamps[commonObj.end.index] || timestamps[timestamps.length - 1];

        await ClickOnTimestamp(targetTimestamp, assignObj);
    }
    function getMutationNodes(mutationsList, MutationObj)
    {
        let added = [];
        let lastActive = [];


        for (const record of mutationsList)
        {
            const t = record.target;
            if (t == rm_container)
                continue;
            if (record.type == "attributes")
            {
                lastActive = [...lastActive, NodesRecord(record.target, 'last-active-timestamp', t)];
                continue;
            }

            if (!record.target.hasAttribute('class'))
                continue;

            const { removedNodes, addedNodes } = record;
            MutationObj.removed = [...MutationObj.removed, NodesRecord(removedNodes, 'active-timestamp', t)];
            added = [...added, NodesRecord(addedNodes, 'yt-gif-timestamp-emulation', t)];
        }


        MutationObj.removed = validArr(MutationObj.removed);
        added = validArr(added);
        lastActive = validArr(lastActive);
        function validArr(arr) { return arr.flat(Infinity).filter(x => !!x) }

        return { lastActive, added };
    }
    function NodesRecord(Nodes, attr, target)
    {
        if (!Nodes || Nodes.length == 0)
            return null;

        const NodesArr = (Nodes == '[object NodeList]' ? [...Nodes] : [Nodes]).filter(el => !!el.tagName);

        return NodesArr
            .map(x =>
            {
                if (x.hasAttribute(attr))
                    return x
                else
                    return [...x.querySelectorAll(`[${attr}]`)]
            })
            .flat(Infinity)
            .map(el => closestBlock(el))
            .filter((v, i, a) => a.indexOf(v) === i)// remove duplicates
            .map(block => 
            {
                const timestamps = ElementsPerBlock(block, '[yt-gif-timestamp-emulation]') || [];
                const activeTimestamps = timestamps.filter(x => x.hasAttribute(attr)) || [];

                const getActivePage = (p) => activeTimestamps.find(x => x.getAttribute('timestamp-style') == p);
                const timestampPage = (page) => ({
                    timestamp: page?.getAttribute('timestamp'),
                    index: timestamps.indexOf(page),
                    page, otherPage: page == 'start' ? 'end' : 'start',
                });

                const siblingIndex = (siblings, el) => Array.from(siblings).flat(Infinity).indexOf(el);
                const children = (sel, self) => !self ? rm_container?.querySelectorAll(sel) : [rm_container, ...rm_container?.querySelectorAll(sel)];

                return {
                    blockID: block.id,
                    blockIndex: siblingIndex(children('.rm-block__input'), block),
                    containerIndex: siblingIndex(children('.roam-block-container', true), rm_container),
                    workflow: 'strict',

                    node: target.querySelector('[yt-gif-timestamp-emulation]'),
                    start: timestampPage(getActivePage("start")),
                    end: timestampPage(getActivePage("end")),
                    target: timestampPage(activeTimestamps.find(x => x.hasAttribute('last-active-timestamp') || x.hasAttribute(attr))),
                }
            });
    }
    function getTargetWrapper()
    {
        if (!grandParentBlock) return null;
        return [...grandParentBlock.querySelectorAll('.yt-gif-wrapper')]?.pop();
    }
    function getLocalBlockID()
    {
        return getBlockID(getTargetWrapper()) ?? blockID;
    }
    function setObsTimestamp(commonObj)
    {
        if (!commonObj || !commonObj.blockID)
            return;
        const blockID = getLocalBlockID();
        const lastActive = observedParameters.get(blockID)?.lastActiveTimestamp;

        const equals = commonObj.target?.timestamp === lastActive?.target?.timestamp;
        const ok = commonObj.target?.timestamp;

        if (ok && (!equals || !lastActive)) // newEntry || not even initialized || it's pair is missing
            observedParameters.set(blockID, { lastActiveTimestamp: commonObj }); // Hmmm...
    }
    function getObsTimestamp()
    {
        const lastActive = observedParameters.get(getLocalBlockID())?.lastActiveTimestamp;
        if (lastActive && UI.timestamps.tm_recovery.checked)
        {
            return lastActive;
        }
        return null;
    }
    async function AssertParamsClickTimestamp()
    {
        const lastActive = getObsTimestamp();
        if (UI.display.simulate_roam_research_timestamps.checked)
            if (UI.timestamps.tm_recovery.checked && lastActive)
            {
                await TryToRecoverActiveTimestamp(lastActive);
                await RAP.sleep(10);

                const TryActiveTimestamp = (p) => rm_container?.querySelector(`.rm-video-timestamp[timestamp-style="${p}"][active-timestamp]`)?.getAttribute('timestamp') || '';
                configParams.start = UTILS.HMSToSecondsOnly(TryActiveTimestamp('start')) || configParams.start;
                configParams.end = UTILS.HMSToSecondsOnly(TryActiveTimestamp('end')) || configParams.end;
            }
    }

    // 7.0
    async function DeployYT_IFRAME_OnInteraction()
    {
        const mainAnimation = setUpWrapperAwaitingAnimation();
        const { awaiting_input_type } = UI.experience;
        let interactionType = awaiting_input_type.value == 'mousedown' ? 'mousedown' : 'mouseenter'; // huga buga

        AddInteractionEventListener();
        wrapper.addEventListener('customPlayerReady', CreateYTPlayer);

        function changeMouseEvents(e)
        {
            if (!isRendered(wrapper))
                return RemoveAllListeners()
            ReplaceInteractionEventListener(e.target.value)
        }

        awaiting_input_type.addEventListener('change', changeMouseEvents);

        return wrapper;


        async function CreateYTPlayer(e)
        {
            e.preventDefault();

            UTILS.toggleClasses(false, mainAnimation, wrapper);
            UTILS.removeIMGbg(wrapper);

            RemoveAllListeners();

            if (!e.type.includes('custom'))
            {
                await AssertParamsClickTimestamp();
                wrapper.dispatchEvent(UTILS.simHover());
            }
            else if (typeof e.detail == 'object')
            {
                configParams.start = e.detail.start ?? configParams.start;
                configParams.end = e.detail.end ?? configParams.end;

                lastBlockIDParameters.delete(getLocalBlockID()); // YIKES!!!
                const isBounded = (t) => t >= configParams.start && t <= configParams.end;
                configParams.updateTime = e.detail.updateTime ?? configParams.updateTime;

                configParams.mute = e.detail.mute ?? configParams.mute;
                configParams['play-right-away'] = e.detail['play-right-away'] ?? configParams['play-right-away'];

                setObsTimestamp(Object.assign(e.detail.obsTimestamp, { workflow: 'soft' }));
                configParams.updateTime = isBounded(configParams.updateTime) ? configParams.updateTime : configParams[e.detail.page];
            }

            return await DeployYT_IFRAME();
        }

        function RemoveAllListeners()
        {
            RemoveInteractionEventListener();
            wrapper.removeEventListener('customPlayerReady', CreateYTPlayer);

            awaiting_input_type.removeEventListener('change', changeMouseEvents);
        }
        function ReplaceInteractionEventListener(listener = interactionType)
        {
            RemoveInteractionEventListener();
            AddInteractionEventListener(interactionType = listener);
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

            if (isSelected(UI.experience.xp_options, 'thumbnail_as_bg'))
                UTILS.applyIMGbg(wrapper, url);
            else
                mainAnimation = awaitingAnimation;

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
    map.start = map?.start || 0;
    map.end = map?.end || t.getDuration();
    const clipSpan = () => map.end - map.start;

    const loadingMarginOfError = 1; //seconds
    let updateStartTime = map.start;

    const speed = map?.speed || 1;
    const entryVolume = validVolumeURL();
    const tickOffset = 1000 / speed;

    const blockID = getBlockID(iframe);
    const canBeCleanedByBuffer = UTILS.closestBlockID(iframe);
    const recording = recordedIDs.get(blockID);
    // 🚧?
    if (recording != null)
    {
        recording.target = t;
        recording.seekToUpdatedTime = seekToUpdatedTime; // 🍝
        recording.sameBoundaries = function (tg = t)
        {
            if (!tg)
                return false;

            const key = tg.h.id;
            const { start: startM, end: endM } = allVideoParameters.get(key);
            const { start, end } = tg?.i?.h?.playerVars;

            return startM == start && endM == end;
        }
        recording.isSoundingFine = function (bol = true, el = iframe)
        {
            isSoundingFine(bol, el)
        }
        recording.togglePlay = function (bol = true, el = iframe)
        {
            togglePlay(bol, el)
        }
        recording.bounded = function (sec)
        {
            const d = t.getDuration?.() ?? 0;
            return sec >= 0 && sec <= d;
        }
    }
    if (parent.hasAttribute('loaded'))
    {
        const sesion = lastBlockIDParameters.get(blockID);
        if (sesion && typeof t.__proto__.previousTick == 'number')
        {
            sesion.updateTime = t.__proto__.previousTick;
            t.__proto__.previousTick = null;
        }
        RunWithPreviousParamsONiframeLoad(); // The YT API reloads the iframe onload, it disorients the users, this a counter-measurement
        HumanInteraction_FreezeAutoplay();
        return;
    }


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
    const timeDisplayStart = timeDisplay.querySelector('.yt-gif-timestamp-start');
    const timeDisplayEnd = timeDisplay.querySelector('.yt-gif-timestamp-end');
    const resetBoundariesBtn = parent.querySelector('.yt-gif-reset-boundaries');


    // 1. previous parameters if available
    RunWithPreviousParamsONiframeLoad();



    // 2. play style | pause style
    ToggleStyles_EventListeners(true);



    // 3. Mouse over the frame functionality
    parent.addEventListener('mouseenter', InState);
    parent.addEventListener('mouseleave', OutState);
    parent.addEventListener('customVideoEnded', OnCustomVideoEnded);



    // 4. scroll wheel - timestamp display feature
    timeDisplay.addEventListener('wheel', BoundWheelValueToSeek);
    timeDisplay.addEventListener('mouseenter', ContinuouslyUpdateTimeDisplay);
    timeDisplay.addEventListener('mouseleave', ClearTimers);



    // 5. fullscreenStyle
    iframe.addEventListener('fullscreenchange', fullscreenStyle_Handler);
    iframe.addEventListener('fullscreenchange', fullscreenAutoplaySynery_Handler);



    // 6. Reload bounaries
    resetBoundariesBtn.addEventListener('click', ResetBoundaries_smart);
    resetBoundariesBtn.ResetBoundaries_smart = ResetBoundaries_smart;


    // 7. store relevant elements with event event listeners to clean them later
    const withEventListeners = [parent, parent.parentNode, timeDisplay, iframe]; // ready to be cleaned



    // 8. clean data and ready 'previous' paramaters for next sesion with IframeRemmovedFromDom_callback
    const options = {
        el: iframe,
        OnRemmovedFromDom_cb: IframeRemmovedFromDom_callback,
    }
    UTILS.ObserveRemovedEl_Smart(options); // Expensive? think so. Elegant? no, but works



    // 9. Performance Mode - Iframe Buffer & Initalize on interaction - synergy
    if (canBeCleanedByBuffer && parent) // sometimes the parent is already gone - while loading iframes
    {
        const parentCssPath = UTILS.getUniqueSelectorSmart(parent);
        PushNew_ShiftAllOlder_IframeBuffer(parentCssPath);
    }



    // 10. 'auto pause' when an iframe goes out the viewport... stop playing and mute
    const yConfig = { threshold: [0] };
    const ViewportObserver = new IntersectionObserver(PauseOffscreen_callback, yConfig);
    ViewportObserver.observe(iframe);



    // 11. well well well 
    if (map['play-right-away'] && map.hasOwnProperty('updateTime'))
    {
        while (isRendered(iframe) && !t?.getCurrentTime?.())
            await RAP.sleep(500);

        seekToUpdatedTime(map.updateTime ?? map.start);
        togglePlay(true);
        isSoundingFine(!map.mute);

        delete map['play-right-away'];
    }
    else
    {
        // pause if user doesn't intents to watch
        HumanInteraction_FreezeAutoplay(); // this being the last one, does matter
    }



    // 12. Guard clause - onPlayerReady executed
    parent.setAttribute('loaded', '');
    iframe.addEventListener('load', () => t.__proto__.previousTick = tick(t));
    ValidateHierarchyTimestamps(parent, t);



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
    function OutState(e)
    {
        StopAllOtherPlayers(e);

        t.__proto__.newVol = t.getVolume(); // spaguetti isSoundingFine unMute
        t.__proto__.globalHumanInteraction = false;

        //                            the same as: if it's true, then the other posibilities are false
        if (anyValidInAndOutKey(e) && UI.playerSettings.mute_style.value != 'all-muted')
        {
            toogleActive(true)
            videoIsPlayingWithSound()
        }
        else
        {
            toogleActive(false)
            //                                                playing
            togglePlay(!AnyPlayOnHover() && (t.getPlayerState() === 1))
            isSoundingFine(false)
        }
    }

    function InState(e)
    {
        if (isSelected(UI.playerSettings.ps_options, 'mantain_last_active_player'))
            ToogleAllOthers(false, true)

        t.__proto__.globalHumanInteraction = true; // I'm afraid this event is slower to get attached than 200ms intervals... well 
        togglePlay(true)

        if (CanUnmute())
        {
            isSoundingFine()
        }
        else if (UI.playerSettings.mute_style.value == 'soft')
        {
            isSoundingFine(false)
        }
    }

    function StopAllOtherPlayers(e)
    {
        toogleAllActivePlayers(false, true)

        if (UI.playerSettings.mute_style.value == 'strict')
        {
            if (anyValidInAndOutKey(e))
                MuteAllOtherPlayers()
        }
        if (UI.playerSettings.play_style.value == 'soft')
        {
            PauseAllOthersPlaying()
        }
    }

    /* ************************************************* */
    function toogleAllActivePlayers(bol, ignoreSelf = false)
    {
        const attr = 'yt-active';
        [...document.querySelectorAll(`[${attr}]`)]
            .forEach(el =>
            {
                if (ignoreSelf && el == parent)
                    return
                UTILS.toggleAttribute(bol, attr, el)
            })
    }
    function toogleActive(bol)
    {
        UTILS.toggleAttribute(bol, 'yt-active', parent)
    }
    /* ********************** */
    function MuteAllOtherPlayers()
    {
        function muteWithBlock(id, el)
        {
            SoundIs(ytGifAttr.sound.mute, el);
            recordedIDs.get(id)?.target?.mute();
        }

        const config = {
            styleQuery: ytGifAttr.sound.unMute,
            //self_callback: (id, el) => muteWithBlock(id, el),
            others_callback: (id, el) => muteWithBlock(id, el)
        };

        LoopTroughYTGIFs(config);
    }
    function PauseAllOthersPlaying()
    {
        const config = {
            styleQuery: ytGifAttr.play.playing,
            others_callback: (id, el) =>
            {
                PlayIs(ytGifAttr.play.paused, el);
                recordedIDs.get(id)?.target?.pauseVideo();
            }
        };
        LoopTroughYTGIFs(config);
    }
    /* ********************** */
    function LoopTroughYTGIFs(config = { styleQuery, others_callback: () => { }, self_callback: () => { } })
    {
        const ytGifs = document.querySelectorAll(`[${config?.styleQuery}]`);
        for (const i of ytGifs)
        {
            if (i != iframe)
            {
                config?.others_callback?.(getBlockID(i), i);
            }
            else if (config.self_callback)
            {
                config?.self_callback?.(getBlockID(i), i);
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

        ClearTimers();
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
        const _clipSpan = clipSpan();
        const offsetClip = _clipSpan < 0;

        UTILS.toggleAttribute(tick() > map.end, 'tick-offset', timeDisplayStart);
        UTILS.toggleAttribute(offsetClip, 'offset', timeDisplayEnd);

        // timeDisplay.innerHTML = '00:00/00:00'
        if (isSelected(UI.display.ms_options, 'clip_lifespan_format')) // 'bounded tick'/'clip end'
        {
            const boundedTick = Math.abs(_clipSpan - (map.end - tick()));
            const validEnd = offsetClip ? map.end : _clipSpan;

            timeDisplayStart.innerHTML = fmtMSS(boundedTick);
            timeDisplayEnd.innerHTML = fmtMSS(validEnd);
        }
        else // 'update'/'end'
        {
            timeDisplayStart.innerHTML = fmtMSS(tick());
            timeDisplayEnd.innerHTML = fmtMSS(map.end);
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

        if (isSelected(UI.display.ms_options, 'clip_lifespan_format'))
        {
            if (dir <= map.start)
                dir = map.end - 1; //can go beyond that

            if (dir >= map.end)
                dir = map.start; //can go beyond that
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
    const TimestampVisible = (bol) =>
    {
        UTILS.toggleClasses(bol, ['yt-gif-timestamp-update'], timeDisplay);
        UTILS.toggleClasses(!bol, ['yt-gif-invisible-element'], timeDisplay);
    }
    //#endregion


    //#region 5. fullscreen
    function fullscreenStyle_Handler(params)
    {
        currentFullscreenPlayer = t.h.id;

        if (!document.fullscreenElement)
        {
            if (isParentHover())
            {
                if ('mute' == UI.playerSettings.fullscreen_style.value)
                    isSoundingFine(false);
                else if ('pause' == UI.playerSettings.fullscreen_style.value)
                    togglePlay(false);
            }
            else if ('play' == UI.playerSettings.fullscreen_style.value)
                togglePlay(true);
        }
    }
    function fullscreenAutoplaySynery_Handler(e)
    {
        if (document.fullscreenElement)
        {
            PauseAllOthersPlaying();
        }
        else if (UI.playerSettings.play_style.value == 'all-visible')
        {
            UI.playerSettings.play_style.visible_clips_start_to_play_unmuted.dispatchEvent(new Event('change'));
        }
    }
    //#endregion


    //#region 6. reload boundaries
    async function ResetBoundaries_smart(e)
    {
        const tEl = e?.currentTarget ?? resetBoundariesBtn;
        const awaiting = (bol) => awaitingAtrr(bol, tEl);

        if (tEl.hasAttribute('awaiting'))
            return;

        TimestampVisible(true);
        awaiting(true);

        DeactivateTimestampsInHierarchy(closest_rm_container(tEl), parent);
        await ReloadYTVideo({ t, start: map.defaultStart, end: map.defaultEnd });
        seekToUpdatedTime(map.defaultStart ?? 0);

        UpdateTimeDisplay();
        awaiting(false);

        if (e.message != 'update-timestamp')
            return TimestampVisible(false);

        // update/visible until any interaction
        UpdateTimeDisplay();
        t.__proto__.timerID = window.setInterval(() => UpdateTimeDisplay(), tickOffset);
        t.__proto__.timers.push(t.__proto__.timerID);
        timeDisplay.onmousemove = stopUpdateDisplayOnce;
        function stopUpdateDisplayOnce(e)
        {
            e.stopPropagation();
            e.preventDefault();
            TimestampVisible(false);
            e.currentTarget.onmousemove = null;
        }
    }
    function OnCustomVideoEnded()
    {
        if (timeDisplay.classList.contains('yt-gif-timestamp-update'))
        {
            timeDisplay.onmousemove = null;
            TimestampVisible(false);
            ClearTimers();
        }
    }
    //#endregion


    //#region 8. on destroyed - clean up and ready next session
    function IframeRemmovedFromDom_callback(observer)
    {
        // expensive for sure 🙋
        UTILS.RemoveElsEventListeners(withEventListeners);
        ToggleStyles_EventListeners(false);




        //🚧 UpdateNextSesionValues
        const media = JSON.parse(JSON.stringify(videoParams));
        media.src = getWrapperUrlSufix(parent);
        media.id = map.id;
        media.updateTime = isBounded(tick()) ? tick() : map.start;
        media.updateVolume = isValidVolNumber(t.__proto__.newVol) ? t.__proto__.newVol : validUpdateVolume();
        if (media.timeURLmapHistory.length == 0) // kinda spaguetti, but it's super necesary - This will not ignore the first block editing - stack change
        {
            media.timeURLmapHistory.push(map.start);
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
            ifBuffer_ShiftOldest();
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

                // roam research displace blocks and the YT player api doesn't catch up...
                const previousIframe = document.querySelector('#' + key);
                if (isRendered(previousIframe))
                {
                    const previousParent = getParent(previousIframe);
                    if (!isRendered(previousParent))
                        return destroyMssg();

                    const observerTargetEl = UTILS.div([rm_components.state.currentClassesToObserver?.[0]]);
                    previousParent.parentNode.replaceChild(observerTargetEl, previousParent);
                }
                else
                    destroyMssg();

                function destroyMssg()
                {
                    // console.count('Destroyed! ' + key);
                }
            }
        }
    }
    //#endregion


    //#region 10. pause on off screen
    function PauseOffscreen_callback(entries)
    {
        if (!entries[0])
        {
            ViewportObserver.disconnect();
        }

        if (tick() > updateStartTime + loadingMarginOfError && !t.__proto__.globalHumanInteraction) // and the interval function 'OneFrame' to prevent the loading black screen
        {
            if (UI.playerSettings.play_style.value != 'all-visible')
                return stopIfInactive()

            if (entries[0].isIntersecting)
                togglePlay(true)
            else
                stopIfInactive()
        }

        function stopIfInactive()
        {
            if (
                !parent.hasAttribute('yt-active') ||
                !isSelected(UI.playerSettings.ps_options, 'mantain_last_active_player')
            )
                return togglePlay(false)

            ToogleAllOthers(false, true)
        }
    }
    function ToogleAllOthers(all, self)
    {
        toogleAllActivePlayers(all, self)
        MuteAllOtherPlayers()
        PauseAllOthersPlaying()
    }

    //#endregion


    //#region 11. last - let me watch would you
    function HumanInteraction_FreezeAutoplay()
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
        return true;
    }
    function tick(target = t)
    {
        return target?.getCurrentTime();
    }
    //#endregion


    //#region validate - check values utils
    function isBounded(x)
    {
        return map.start < x && x < map.end;
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
    function CanUnmute() // NotMuteAnyHover
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

        const keys = UI.defaultValues.InAndOutKeys.split(',').map(s => s.trim()).filter(s => !!s);
        for (const name of keys)
            if (e[name])
                return true;

        return false;
    }
    function AnyPlayOnHover()
    {
        return UI.playerSettings.play_style.value == 'soft' || UI.playerSettings.play_style.value == 'strict'
    }
    function isParentHover()
    {// https://stackoverflow.com/questions/36767196/check-if-mouse-is-inside-div#:~:text=if%20(element.parentNode.matches(%22%3Ahover%22))%20%7B
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
        t.getIframe()?.closest('.yt-gif-wrapper')?.dispatchEvent(new CustomEvent('customVideoEnded'));

        if (UI.timestamps.tm_loop_hierarchy.value != 'disabled')
        {
            await TryToLoadNextTimestampSet();
        }
        else
        {
            await RealoadThis();
        }

        const soundSrc = validSoundURL();
        if (soundSrc)
        {
            if (UI.range.end_loop_sound_volume.value != 0)
            {
                PlayEndSound(soundSrc);
            }
        }

        if (isSelected(UI.playerSettings.ps_options, 'minimize_on_video_ended') && (currentFullscreenPlayer === t.h.id)) // let's not talk about that this took at least 30 mins. Don't. Ughhhh
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
    async function TryToLoadNextTimestampSet()
    {
        await RAP.sleep(10);

        const iframe = t?.getIframe?.();
        if (!iframe)
            return await RealoadThis();

        const options = [...UI.timestamps.tm_loop_options.selectedOptions].map(o => o.value); // skip - include_player
        const page = UI.timestamps.tm_loop_to.value || 'start';
        const sel = `[timestamp-set][timestamp-style="${page}"]`;
        const boundedSel = `${sel}:not([out-of-bounds])`;
        const tmSel = options.includes('skip') ? boundedSel : sel; // Skip if target is missing or if it is out of bounds

        const targetWrapper = iframe.closest('.yt-gif-wrapper');
        const rm_container = closest_rm_container(iframe);

        if (!rm_container)
            return await RealoadThis();

        const targets = TimestampsInHierarchy(rm_container, targetWrapper, tmSel);
        const lastActive = TimestampsInHierarchy(rm_container, targetWrapper, '[last-active-timestamp]')?.[0];
        const activeSel = ElementsPerBlock(closestBlock(lastActive), tmSel)?.[0]; // go one level up and search for a "start" timestamp, bc does it makes sense to loop through "end" boundaries???

        const index = targets.indexOf(activeSel);
        if (index === -1 && // din't find any active
            (UI.timestamps.tm_loop_hierarchy.value == 'active' || targets.length == 0)) // and ( only on active or there are no targets)
            return await RealoadThis();
        // else value == 'auto'

        let nextIndex = (index + 1) % targets.length;
        if (options.includes('include_player')) // include player in the loop
        {
            if (index == targets.length - 1) // the only scenario where we need to go back to the beginning
                return await ClickResetWrapper(targetWrapper, { message: 'update-timestamp' });
            else if (index == -1) // assuming there are targets and the player was reset, go on the next one
                nextIndex = 0;
        }

        const target = targets[nextIndex];
        if (isRendered(target))
            await ClickOnTimestamp(target, { seekToMessage: 'seekTo-strict' });
        else
            await RealoadThis();
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

    ifBuffer_ShiftOldest(); // modifies and returns masterIframeBuffer
}
function ifBuffer_ShiftOldest()
{
    if (isInputSelected()) // everything else are buffer variations
        return null;


    // work in pregress | by shifting/removing the first entry, you clean the most irrelevent YT GIF, and give space to new ones (to load, thus autoplay on mouseenter) when intersecting the website
    let arr = window.YT_GIF_OBSERVERS.masterIframeBuffer;
    const cap = parseInt(UI.range.iframe_buffer_slider.value, 10);
    const { displaced, buffer } = attrInfo.creation;



    if (isIntersection_selectedValid())
    {
        // 2.
        arr = FitBuffer_OffScreen(arr, cap, displaced);
    }
    else
    {
        // 2. while...
        const { shiftedArr, atLeastOne: oneShifted, lastOne } = FitBuffer(arr, cap, buffer);
        arr = shiftedArr;
        // 2.1 mix and match
        if (oneShifted || cap <= arr.length) // there is space
        {
            toggle_buffers_overflow(true);
        }
        else if (!oneShifted && cap > arr.length) // overflow
        {
            toggle_buffers_overflow(false);
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
function isIntersection_selectedValid()
{
    return isIntersectionSeletectd() && isInputBufferSelected() // the only place where it is available
}
function isInput_selectedValid()
{
    return isInputSelected() || (!isIntersectionSeletectd() && isInputBufferSelected()) || isSelected(UI.experience.initialize_mode, 'overflow')
}
function isInputSelected()
{
    return isSelected(UI.experience.initialize_mode, 'input')
}
function isIntersectionSeletectd()
{
    return isSelected(UI.experience.xp_options, 'intersection')
}
function isInputBufferSelected()
{
    return isSelected(UI.experience.initialize_mode, 'input_x_buffer')
}
function toggle_buffers_overflow(bol)
{
    const modes = UI.experience.initialize_mode;
    const input_x_buffer = getOption(modes, 'input_x_buffer');

    input_x_buffer.disabled = bol;
    if (!bol)
        input_x_buffer.selected = false;

    getOption(modes, 'overflow').selected = bol;
    modes.dispatchEvent(new Event('customBind'));

    // const input_x_buffer = getOption(modes, 'input_x_buffer');
    // const buffer = getOption(modes, 'buffer');

    // buffer.disabled = input_x_buffer.disabled = bol;
    // if (!bol)
    //     buffer.selected = input_x_buffer.selected = false;

    // getOption(modes, 'overflow').selected = bol;



    // const validOpt = (o, b, is) => o[is] = b
    // const allOptions = (bol, is) => [...modes.options].forEach(o => validOpt(o, bol, is))

    // allOptions(bol, 'selected');
    // if (!bol)
    //     allOptions(false, 'disabled');

    // const overflow = getOption(modes, 'overflow');
    // overflow.selected = bol;
    // overflow.disabled = !bol;
}
//#endregion

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
window.YTGIF = {
    getTimestampObj: getTimestampObj_smart
}
async function getTimestampObj_smart(page)
{
    const openInputBlock = getCurrentInputBlock();
    const uid = openInputBlock?.id?.slice(-9);
    const failObj = { S: null, HMS: null, };

    if (!page || !uid || !openInputBlock)
        return failObj;
    return await getTimestampObj(page, uid);

    async function getTimestampObj(page, uid)
    {
        const { formats, foundBlock, targetBlock } = await getLastComponentInHierarchy(uid);
        if (!foundBlock) return failObj;

        const { lestHMS, HMS, S } = formats;

        const obj = (v) => ({
            value: v,
            fmt: `{{[[yt-gif/${page}]]: ${v} }}`,
        });

        return {
            lessHMS: obj(fmt({ lestHMS })),
            HMS: obj(fmt({ HMS })),
            S: obj(parseInt(S ?? targetBlock[page].S)),
            uid: targetBlock?.uid,
        }

        function fmt(obj)
        {// https://www.codegrepper.com/code-examples/javascript/get+var+name+javascript#:~:text=%E2%80%9Cget%20var%20name%20javascript%E2%80%9D%20Code%20Answer
            const key = Object.keys(obj)[0];
            const value = obj[key]; // Hmmm...
            return (!value || value?.includes?.('NaN')) ? targetBlock[page][key] : value;
        }
    }
}
function getCurrentInputBlock()
{
    return document.querySelector(".rm-block__input--active.rm-block-text")
}
function DeactivateTimestampsInHierarchy(rm_container, targetWrapper)
{
    if (!rm_container) return;
    const sel = '[yt-gif-timestamp-emulation]';
    const all = TimestampsInHierarchy(rm_container, targetWrapper, sel);
    all.forEach(el =>
    {
        UTILS.toggleAttribute(false, 'active-timestamp', el);
        UTILS.toggleAttribute(false, 'last-active-timestamp', el);
    });
}
function TimestampsInHierarchy(rm_container, targetWrapper, allSelector)
{
    const badSets = [...rm_container.querySelectorAll('.yt-gif-wrapper')]
        .filter(w => w != targetWrapper)
        .map(w => [...closest_rm_container(w).querySelectorAll(allSelector)])
        .flat(Infinity);

    const actives = [...rm_container.querySelectorAll(allSelector)]
        .filter(tm => !badSets.includes(tm));
    return actives;
}
function ValidateHierarchyTimestamps(wrapper, t)
{
    const videoId = t?.i?.h?.videoId;
    YTvideoIDs.set(videoId, t.getDuration?.());

    const d = parseInt(YTvideoIDs.get(videoId));
    const rm_container = closest_rm_container(wrapper);

    if (rm_container && typeof d == 'number')
        TimestampsInHierarchy(rm_container, wrapper, '[yt-gif-timestamp-emulation]')
            .forEach(tm => tm.validateSelf?.(d));
}
function getBlockID(wrapper)
{
    if (!wrapper) return null;
    return closestYTGIFparentID(wrapper) + getWrapperUrlSufix(wrapper);
}
/* ***************** */
function PulseObj(tEl)
{
    const base = ['yt-timestamp-pulse-text-anim'];
    const anims = {
        green: [...base, 'yt-timestamp-success'],
        red: [...base, 'yt-timestamp-warn'],
        blue: [...base, 'yt-timestamp-opening'],
        purple: [...base, 'yt-timestamp-reset'],
        blueViolet: [...base, 'yt-timestamp-pause'],
    }
    anims['all'] = Object.values(anims).flat(Infinity).filter((v, i, a) => a.indexOf(v) === i); // remove duplicates on allAnim

    function pulse(anim = 'green')
    {
        UTILS.toggleClasses(false, anims['all'], tEl)
        UTILS.toggleClasses(true, anims[anim], tEl)
        setTimeout(() => UTILS.toggleClasses(false, anim, tEl), 500);
    }

    return { pulse }
}
/* ***************** */
async function ClickOnTimestamp(target, assignObj = {})
{
    const detail = { // cringe event object
        currentTarget: target,
        which: 1,
        seekToMessage: UI.timestamps?.tm_seek_to?.value == 'soft' ? 'seekTo-soft' : 'seekTo-strict',
        mute: UI.timestamps.tm_seek_action.value == 'mute',
        ...assignObj
    };
    Object.assign(detail, assignObj);
    // how do you resolve/return a promise using a CustomEvent handler?
    await target?.OnClicks?.(detail)
}
async function ClickResetWrapper(targetWrapper, assignObj = {})
{
    if (!targetWrapper) return;

    const reset = targetWrapper.querySelector('.yt-gif-reset-boundaries');
    // await reset?.dispatchEvent(new Event('click'));
    await reset?.ResetBoundaries_smart?.(assignObj);
}
/* ***************** */
function ElementsPerBlock(block, selector)
{
    if (!block) return [];
    return [...block?.querySelectorAll(selector)]?.filter(b => closestBlock(b).id == block.id) || [];
}
async function getWrapperInHierarchyObj(pointOfReferenceElm)
{
    const classIs = (x, cs) => x.classList.contains(cs);
    const hasSel = (x, sel) => x.querySelector(sel);

    let el = closestBlock(pointOfReferenceElm);
    const originalId = el?.id;

    while (el?.contains?.(pointOfReferenceElm))
    {
        el = el.parentElement;
        if (classIs(el.parentElement, 'roam-app'))
            return {} // if you get to the top of the DOM, stop

        let wrapper = getWrapper();
        if (!wrapper || !classIs(el, 'roam-block-container'))
            continue; // F

        // await if the RAW wrapper exists
        while (isRendered(wrapper) && !wrapper.hasAttribute('invalid-yt-gif') && classIs(wrapper, 'rm-xparser-default-yt-gif'))
            await RAP.sleep(10);

        wrapper = getWrapper(); // get the wrapper again, in case it was rendered

        const block = closestBlock(wrapper);
        const lastWrapper = ElementsPerBlock(block, '.yt-gif-wrapper').pop();

        if (lastWrapper) // gotem!
            return {
                lastWrapper,
                container: el,
                block, id: block.id, originalId,
            }
    }
    return {}

    function getWrapper()
    {
        const wrapper = hasSel(el.firstElementChild, '.yt-gif-wrapper'); // this it a wrapper
        return wrapper ?? hasSel(el.firstElementChild, '.rm-xparser-default-yt-gif'); // this is a raw wrapper
    }
    // wrapperObjs = wrapperObjs.reduce((acc, crr) =>
    // { // https://dev.to/marinamosti/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep
    //     const is = acc.find(i => i.id === crr.id);
    //     return is ? acc : acc.concat([crr]);
    // }, []);
}
/* ***************** */
function PulseObj(tEl)
{
    const base = ['yt-timestamp-pulse-text-anim'];
    const anims = {
        green: [...base, 'yt-timestamp-success'],
        red: [...base, 'yt-timestamp-warn'],
        blue: [...base, 'yt-timestamp-opening'],
        purple: [...base, 'yt-timestamp-reset'],
        blueViolet: [...base, 'yt-timestamp-pause'],
    }
    anims['all'] = Object.values(anims).flat(Infinity).filter((v, i, a) => a.indexOf(v) === i); // remove duplicates on allAnim

    function pulse(anim = 'green')
    {
        UTILS.toggleClasses(false, anims['all'], tEl)
        UTILS.toggleClasses(true, anims[anim], tEl)
        setTimeout(() => UTILS.toggleClasses(false, anims[anim], tEl), 500);
    }

    return { pulse }
}
function fmtTimestamp(value)
{
    const str2sec = (str) => UTILS.HMSToSecondsOnly(str)
    let fmt = (tms) => tms;

    if (value == 'lessHMS')
        fmt = (tms) => UTILS.seconds2time(str2sec(tms));
    else if (value == 'HMS')
        fmt = (tms) => UTILS.convertHMS(str2sec(tms));
    else if (value == 'S')
        fmt = (tms) => str2sec(tms);

    return fmt;
}
function awaitingAtrr(bol, el)
{
    return UTILS.toggleAttribute(bol, 'awaiting', el);
}
/* ***************** */
function ExtractParamsFromUrl(url)
{
    let success = false;
    const media = JSON.parse(JSON.stringify(videoParams));
    if (YTGIF_Config.guardClause(url))
    {
        const fParam = (p) => floatParam(p, url);
        media.id = UTILS.getYouTubeVideoID(url);

        media.start = media.defaultStart = fParam('t|start');
        media.end = media.defaultEnd = fParam('end');

        media.speed = fParam('s|speed');

        media.volume = new RegExp(/(vl=|volume=)(?:\d+)/).exec(url)?.[2];

        media.hl = new RegExp(/(hl=)((?:\w+))/, 'gm').exec(url)?.[2];
        media.cc = new RegExp(/(cc=|cc_lang_pref=)((?:\w+))/, 'gm').exec(url)?.[2];

        media.sp = new RegExp(/(sp=|span=)((?:\w+))/, 'gm').exec(url)?.[2];

        media.src = url;
        media.type = 'youtube';

        success = true;
    }

    if (success) { return media; }
    else { console.warn(`${newId}    Invalid youtube url detected for yt-gifs ${((uid))}`); }
    return false;
}

    while (isRendered(iframe) && !t?.getCurrentTime?.())
        await RAP.sleep(50);

    try { t.l.h[5] = onStateChange; } catch (error) { }

    return t?.getCurrentTime?.();
}
/* ***************** */
function replace_nth(str = '', subStr = '', repStr = '', n = 1)
{// https://stackoverflow.com/questions/35499498/replace-nth-occurrence-of-string#:~:text=with%20RegExp%20constructor-,const%20replace_nth%20%3D%20function%20(s%2C%20f%2C%20r%2C%20n)%20%7B,-//%20From%20the%20given
    // From the given string s, replace f with r of nth occurrence
    return str.replace(RegExp("^(?:.*?" + subStr + "){" + n + "}")
        , x => x.replace(RegExp(subStr + "$"), repStr));
}
//#endregion




//#region  backend/frontend communication - XXX_Config = {...}
async function getLastComponentInHierarchy(tempUID, _Config = YTGIF_Config, includeOrigin = true)
{
    const original = await RAP.getBlockInfoByUID(tempUID);
    const ParentHierarchy = await RAP.getBlockParentUids_custom(tempUID);
    if (!ParentHierarchy && !original) { return {}; }
    const originalStr = original[0]?.[0]?.string || '';


    const baseObj = {
        blockID: null, start: 0, end: 0, HMS: 000, crrTime: null,
    }
    const iframeMaps = {
        targets: {
            condition: function (sufix)
            {
                this.blockID = [...recordedIDs.keys()].find(k => k?.endsWith(sufix));
                return this.crrTime = recordedIDs.get(this.blockID)?.target?.getCurrentTime() || false;
            },
        },
        lastParams: {
            condition: function (sufix)
            {
                this.blockID = [...lastBlockIDParameters.keys()].find(k => k?.endsWith(sufix));
                return this.crrTime = lastBlockIDParameters.get(this.blockID)?.updateTime || false;
            },
        },
    }
    Object.keys(iframeMaps).forEach(key => Object.assign(iframeMaps[key], baseObj));

    const Hierarchy = !includeOrigin ? ParentHierarchy : [...ParentHierarchy, [{ uid: tempUID, string: originalStr }, { title: 'made-up', uid: 'invalid' }]];
    const blockStrings = Hierarchy.map(arr => arr[0]).map(o => res = { string: clean_rm_string(o.string), uid: o.uid });


    for (const { string, uid } of blockStrings.reverse())
    {
        const componentMap = await getComponentMap(uid, _Config);
        const reverseValues = [...componentMap.values()].reverse();

        const lastUrl = reverseValues?.find(v => _Config.guardClause(v));
        if (!lastUrl) continue;

        const lastUrlIndex = reverseValues.indexOf(lastUrl);
        const possibleBlockIDSufix = uid + properBlockIDSufix(lastUrl, lastUrlIndex);

        const key = Object.keys(iframeMaps).find(x => iframeMaps[x].condition(possibleBlockIDSufix));

        const crrTime = iframeMaps[key]?.crrTime;
        const startObj = boundaryObj(lastUrl.match(/(t=|start=)(?:(\d+))/)?.[2] || 0);
        const endObj = boundaryObj(lastUrl.match(/(end=)(?:(\d+))/)?.[2] || 0);

        return {
            formats: boundaryObj(crrTime),
            foundBlock: {
                string,
                uid,
                blockID: iframeMaps[key]?.blockID,
                possibleBlockIDSufix,
            },
            targetBlock: {
                string: originalStr,
                uid: tempUID,
                start: startObj,
                end: endObj,
            },
        };

        function boundaryObj(value)
        {
            return {
                lestHMS: UTILS.seconds2time(parseInt(value)),
                HMS: UTILS.convertHMS(value),
                S: value,
            }
        }
    }
    return {};
}


function MapAtIndex_Value(map, valueAtIndex, property = 'is')
{
    const key = FilterMapByIsKey(map, property)?.[valueAtIndex];
    return map?.get(key);
}
function MapAtIndex_ObjKey(map, valueAtIndex, property = 'is')
{
    return FilterMapByIsKey(map, property)?.[valueAtIndex];
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
    const anyPossibleComponentsRgx = /{{([^}]*)/gm; // https://stackoverflow.com/questions/30787438/how-to-stop-match-until-before-a-character-in-regex#:~:text=assisterId%3D-,(%5B%5E%22%5D*),-%5B%5E%22%5D*%20matches%20any%20character
    const aliasPlusUidsRgx = /\[(.*?(?=\]))]\(\(\((.*?(?=\)))\)\)\)/gm;
    const tooltipCardRgx = /{{=:(.+?)\|([^}]*)/gm;
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




//#region custom elms
class CustomSelect
{// https://codepen.io/dcode-software/pen/MWmrqGQ // https://www.youtube.com/watch?v=zbjGcA3iEME
    constructor({ fakeSel, classes })
    {
        this.classes = classes ?? {};
        this.fakeSel = fakeSel;
        this.customSelect = document.createElement("select");

        if (this.fakeSel.hasAttribute('multiple'))
            this.customSelect.setAttribute('multiple', '');

        this._removeFakeSibling();

        Array.from(this.fakeSel.children).forEach((fake, idx, arr) =>
        {
            const option = document.createElement("option"); // binded to the fake select

            option.setAttribute('value', fake.getAttribute('value'));
            option.textContent = fake.textContent;
            this.customSelect.appendChild(option);

            if (fake.hasAttribute('selected'))
                this._select(fake);

            fake.addEventListener('click', handleSelect.bind(this));
            option.customSelect = customSelect.bind(this);
            option.customHandleSelect = handleSelect.bind(this);
            option.fake = fake;

            function handleSelect() 
            {
                if (fake.hasAttribute('disabled') || option.disabled)
                    return;

                const previous = option.selected;
                if (
                    this.fakeSel.hasAttribute('multiple') &&
                    (fake.hasAttribute('selected') || option.selected)
                )
                {
                    this._deselect(fake)
                    this._fireCustomChange(option, false, previous)
                } else
                {
                    this._select(fake)
                    this._fireCustomChange(option, true, previous)
                }
                this.customSelect.dispatchEvent(new Event('change'))
            }
            function customSelect(bol)
            {
                if (bol)
                    this._select(fake)
                else
                    this._deselect(fake)
            }
        });

        this.fakeSel.insertAdjacentElement("afterend", this.customSelect);
        this.customSelect.style.display = "none";
        this.customSelect.setAttribute('hidden-fake-select', '');

        return {
            select: this.customSelect,
            originalSelect: this.fakeSel,
        }
    }

    _removeFakeSibling()
    {
        const fakeSibling = this.fakeSel.nextElementSibling?.hasAttribute('hidden-fake-select');
        if (fakeSibling)
            this.fakeSel.parentNode.removeChild(this.fakeSel.nextElementSibling);
    }
    _select(fake)
    {
        if (!this.fakeSel.hasAttribute('multiple'))
            Array.from(this.fakeSel.children).forEach((el) => this._vsSelected(false, el));

        this._isSelected(true, fake);
        this._vsSelected(true, fake);
    }
    _deselect(fake)
    {
        this._isSelected(false, fake);
        this._vsSelected(false, fake);
    }
    _vsSelected(bol, el)
    {
        UTILS.toggleAttribute(bol, 'selected', el);
        if (this.classes.selected)
            UTILS.toggleClasses(bol, [this.classes.selected], el);
    }
    _isSelected(bol, fake)
    {
        const index = Array.from(this.fakeSel.children).indexOf(fake);
        const option = this.customSelect.children[index];
        option.selected = bol;
    }
    _fireCustomChange(option, bol, previousValue)
    {
        if (previousValue != bol) // nothing changed, skip
            option.dispatchEvent(new CustomEvent('customChange',
                {
                    bubbles: false,
                    cancelBubble: true,
                    cancelable: true,
                    //composed: false,
                    detail: {
                        previousValue,
                        currentValue: bol,
                    },
                }));
    }
}
/* ********************* */
async function tryToGetUrlDuration(id)
{
    const key = window.YT_GIF_DIRECT_SETTINGS.get('YT_API_KEY_V3')?.sessionValue; // yikes
    if (!key)
        return null;

    try
    {

        const url = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${key}&part=snippet,contentDetails`;
        const res = await asyncAjax(url);
        const youtube_time = res.items[0].contentDetails.duration;
        console.log(`youtube_time: ${youtube_time}, id: ${id}`);
        return formatISODate(youtube_time);
    }
    catch (error)
    {

    }

    return null;
}
function asyncAjax(url)
{// https://stackoverflow.com/questions/27612372/how-to-await-the-ajax-request#:~:text=return%20new%20Promise(function(resolve%2C%20reject)%20%7B
    return new Promise(function (resolve, reject)
    {
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            beforeSend: function () { },
            success: function (data) { resolve(data) },
            error: function (err) { reject(err) },
        })
    })
}
function formatISODate(youtube_time)
{ // https://stackoverflow.com/questions/2086260/youtube-player-api-how-to-get-duration-of-a-loaded-cued-video-without-playing-i#:~:text=function%20formatISODate(youtube_time)%7B
    const arr = youtube_time.match(/(\d+)(?=[MHS])/ig) || [];
    return arr.map(i => (i.length < 2) ? ('0' + i) : i).join(':');
}
/* ********************* */
function isSelected(select, ...value)
{
    return [...select.selectedOptions].find(o => value.includes(o.value))
}
function getOption(select, value)
{
    return [...select.options].find(o => o.value == value)
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
    getWrapperInHierarchyObj
        while elm exist
    durationObj -> getDuration from smart_map
        validate self - bounded attr
    videoId -> fetch API -> duration
        using Utils to get videoId
            formatISODate
        tryToGetUrlDuration | asyncAjax
            fetch -> requieres $ JQuery
    added custom events to parent & reset controls
        reste btn
            show update timestamp
            fire customVideoEnded event

    timestamp loop
        added skip & include player options (auto)        

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

    implement a boundary detection ☐
         on timestamp startup
            using API KEY ☑ ☑
            on iframe load ☐ ☐

    validate timestamp duration on video loadeded ☐

    timestamp options
         player to timestamp loops ☑ ☑
         skip out of bounds timestamps ☑ ☑

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