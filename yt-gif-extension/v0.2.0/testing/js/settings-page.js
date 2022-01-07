// version 4 - semi-refactored
const TARGET_PAGE = 'roam/js/kauderk/yt-gif/settings';
const UTIL_K = window.kauderk.util;
const RAP = window.kauderk.rap;

let TARGET_UID = RAP.getPageUid(TARGET_PAGE);

const fmtSplit = ' : ';
const PmtSplit = ' / ';
const cptrPrfx = '<',
    cptrSufx = '>';

const rad = 'radio',
    chk = 'checkbox',
    str = 'string',
    pmt = 'prompt',
    int = 'integer',
    bol = 'boolean',
    url = 'url',
    rng = 'range';

/**
 * each key must be unique, careful bud
 */
window.YT_GIF_SETTINGS_PAGE = {
    Workflow: {
        baseKey: BasePmt(`BIP BOP . . .`),
        joins: InlinePmt(`either "ﾠ:ﾠ" for actual settings or "ﾠ/ﾠ" for prompt guidelines`), // he doesn't know... wait- he knows "ﾠ" != " "
        parameters: {
            baseKey: BasePmt("\n`(xxxuidxxx)` : `yt_gif_settings_key` : `<value>`"),
            uid: InlinePmt("\n`(xxxuidxxx)`\nunique per user data base, without it the settings can't be written on this page"),
            key: InlinePmt("\n`yt_gif_settings_key`\nsecond way to know which setting to change"),
            value: InlinePmt("\n`<value>`\nin many cases optional and most of the time a binary switch, on - off"),
        },
        //reach: InlinePmt(`Blocks below "LogStatus" will be ignored`),
    },
    display: {
        baseKey: BaseSetting(chk),
        clip_life_span_format: dom('1'),
        simulate_roam_research_timestamps: dom(),
        simulate_url_to_video_component: dom(),
    },
    timestamps: {
        baseKey: BaseSetting(chk),
        timestamp_recovery: dom('1'),
        timestamp_recovery_strict: dom('', rad),
        timestamp_recovery_soft: dom('1', rad),
        timestamp_shortcuts_enabled: dom(),
        timestamp_mute_when_seeking: dom(),
        timestamp_reset_on_last_active_container_removed: dom('1'),
    },
    previousTimestamp: {
        baseKey: BaseSetting(rad),
        /* one a time */
        strict_start_timestamp: dom('1'),
        start_timestamp: dom(),
        fixed_start_timestamp: dom(),
    },
    previousVolume: {
        baseKey: BaseSetting(rad),
        /* one a time */
        strict_start_volume: dom('1'),
        start_volume: dom(),
        fixed_start_volume: dom(),
    },
    experience: {
        baseKey: BaseSetting(chk),
        sound_when_video_loops: dom('1'),
        awaiting_for_user_input_to_initialize: dom('', chk),
        awaiting_for_mouseenter_to_initialize: dom('', rad),
        awaiting_for_mousedown_to_initialize: dom('', rad),
        awaiting_with_video_thumnail_as_bg: dom('1'),
        iframe_buffer_stack: dom('1'),
        try_to_load_on_intersection_beta: dom(),
    },
    fullscreenStyle: {
        baseKey: BaseSetting(chk),
        smoll_vid_when_big_ends: dom('1'),
        mute_on_exit_fullscreenchange: dom(),
        pause_on_exit_fullscreenchange: dom(),
    },
    muteStyle: {
        baseKey: BaseSetting(rad),
        strict_mute_everything_except_current: dom('1'),
        muted_on_mouse_over: dom(),
        muted_on_any_mouse_interaction: dom(),
    },
    playStyle: {
        baseKey: BaseSetting(rad),
        strict_play_current_on_mouse_over: dom('1'),
        play_on_mouse_over: dom(),
        visible_clips_start_to_play_unmuted: dom(),
        play_last_active_player_off_intersection: dom('1', chk),
    },
    range: {
        baseKey: BaseSetting(rng),
        timestamp_display_scroll_offset: {
            baseKey: BaseDom('5', int),
            tdso_opt: InlinePmt(`seconds up to 60`),
        },
        end_loop_sound_volume: {
            baseKey: BaseDom('50', int),
            elsv_opt: InlinePmt(`integers from 0 to 100`),
        },
        iframe_buffer_slider: {
            baseKey: BaseDom('10', int),
            ibs_opt: InlinePmt(`integers from 1 to 30`),
        },
    },
    select: {
        timestamp_workflow_display: {
            baseKey: BaseInitSetting('HMS', chk),
            twd_opt: InlinePmt(`default -> HMS - Hours, Minutes, Seconds or S - seconds only`),
        },
        timestamp_workflow_grab: {
            baseKey: BaseInitSetting('HMS', chk),
            twg_opt: InlinePmt(`default -> HMS - Hours, Minutes, Seconds or S - seconds only`),
        },
    },
    InAndOutKeys: {
        baseKey: BaseSetting(chk),
        ctrlKey: dom('1'),
        shiftKey: dom(),
        altKey: dom(),
        iaok_opt: InlinePmt(`middle mouse button is on by default`),
    },
    defaultPlayerValues: {
        baseKey: BaseSetting(),
        player_span: {
            baseKey: BaseInitSetting('50%', str),
            ps_opt: InlinePmt(`empty means 50% - only valid css units like px  %  vw`),
            pv_opt_2: InlinePmt("each block's url parameter `&sp=` has priority over this"),
        },
        player_volume: {
            baseKey: BaseInitSetting(40, int),
            vv_opt: InlinePmt(`integers from 0 to 100`),
            pv_opt: InlinePmt("each block's url parameter `&vl=` has priority over this"),
        },
        player_interface_language: {
            baseKey: BaseInitSetting('en', str),
            pil_opt: InlinePmt("each block's url parameter `&hl=` has priority over this"),
            pli_guide: InlinePmt(`https://developers.google.com/youtube/player_parameters#:~:text=Sets%20the%20player%27s%20interface%20language.%20The%20parameter%20value%20is%20an%20ISO%20639-1%20two-letter%20language%20code%20or%20a%20fully%20specified%20locale.%20For%20example%2C%20fr%20and%20fr-ca%20are%20both%20valid%20values.%20Other%20language%20input%20codes%2C%20such%20as%20IETF%20language%20tags%20(BCP%2047)%20might%20also%20be%20handled%20properly.`),
        },
        player_captions_language: {
            baseKey: BaseInitSetting('en', str),
            pcl_opt: InlinePmt("each block's url parameter `&cc=` has priority over this"),
            pcl_guide: InlinePmt(`https://developers.google.com/youtube/player_parameters#:~:text=This%20parameter%20specifies%20the%20default%20language%20that%20the%20player%20will%20use%20to%20display%20captions.%20Set%20the%20parameter%27s%20value%20to%20an%20ISO%20639-1%20two-letter%20language%20code.`),
        },
        player_captions_on_load: {
            baseKey: BaseInitSetting('true', bol),
            pcol_guide: InlinePmt("Browsers love to cash data... if set to -true- most certently you'll get caption on load, but it's hard to tell otherwise... Also, the mix and match of diferent `&hl=` and `&cc=` can cause to not show the captions on load"),
        },
    },
    defaultValues: {
        baseKey: BaseSetting(),
        override_roam_video_component: {
            baseKey: BaseInitSetting('', [bol, str]),
            orvc_opt: InlinePmt('distinguish between `{{[[video]]:}}` from `{{[[yt-gif]]:}}` or "both" which is also valid'),
        },
        end_loop_sound_src: {
            baseKey: BaseInitSetting('https://freesound.org/data/previews/256/256113_3263906-lq.mp3', url),
            elss_opt: InlinePmt(`src sound when yt gif makes a loop, empty if unwanted`),
        },
        override_simulate_url_to_video_component: {
            baseKey: BaseInitSetting('', bol),
            orsuvc_opt: InlinePmt(`Because of browsers' external problems, I'd like to set this as the "usage key" replacement`),
        },
    },
    dropdownMenu: {
        baseKey: BaseSetting(),
        //yt_gif_update_visual_feedback: dom('1', chk),
        ddm_css_theme_input: {
            baseKey: BaseInitSetting('', chk),
            ct_opt: InlinePmt(`"dark" == "true" or "light" == "false"`),
        },
    },
    LogStatus: {
        baseKey: BasePmt(`Everything looks alright :D`),
        DisplacedBlocks: {
            baseKey: BasePmt(`invalid -> settings block - deleted - deprecated\n**__If you encounter any nested blocks, it's extremely advisable that you delete them__**`),
        },
        UnknownBlocks: {
            baseKey: BasePmt(`... to the YT GIF SETTINGS PAGE script algorithm-functions`),
        },
        ls_: InlinePmt(`End of settings`),
    },
}
window.YT_GIF_SETTINGS_PAGE.Workflow.baseKey.string = `The ${Object.keys(window.YT_GIF_SETTINGS_PAGE).length} blocks will be -added on updates- and -removed if deprecated- automatically. The last parameters "<>" are customizable. 🐕 👋`;




// this looks like a bad idea...
window.YT_GIF_DIRECT_SETTINGS = null;
window.YT_GIF_SETTINGS_PAGE_INIT = async () => await init();


async function init()
{
    const { acc, keyObjMap } = await assignChildrenMissingValues();
    window.YT_GIF_DIRECT_SETTINGS = keyObjMap;  // the performance will increase dramatically if ONLY un-examined keyObjs are reviewd inside addAllMissingBlocks  keyObjMap.fiter(x=>!examined) or something like that...

    if (TARGET_UID == null) // Brand new installation
    {
        TARGET_UID = await RAP.getOrCreatePageUid(TARGET_PAGE); //navigateToUiOrCreate : getOrCreatePageUid
        const addedBlocks = await addAllMissingBlocks(); // 🐌
    }
    else // Read and store Session Values
    {
        window.YT_GIF_DIRECT_SETTINGS.set(TARGET_PAGE, { uid: TARGET_UID }); // the most special cases of them all... the actual page
        const FinishRec_thenDisplace_cbArr = await Read_Write_SettingsPage(TARGET_UID, keyObjMap); // 🐌
        const addedBlocks = await addAllMissingBlocks(); // 🐌 // THEY WILL STACK UP AGAINS EACHOTHER IF THEY ARE NOT EXAMINED - careful, bud
        for (const cb_closure of FinishRec_thenDisplace_cbArr) await cb_closure();
    }
    await RAP.SetNumberedViewWithUid(TARGET_UID);
    await RAP.CollapseDirectcChildren(TARGET_UID, false);
}

//#region HIDDEN FUNCTIONS
async function assignChildrenMissingValues()
{
    // 0.
    let = keyObjMap = new Map(); // acc inside the Rec_func
    const passAccObj = {
        accStr: '',
        nextStr: '',
        indent: -1,
        accKeys: [],
    };


    // 1.
    return {
        acc: await Rec_assignChildrenMissingValues(window.YT_GIF_SETTINGS_PAGE, passAccObj),
        keyObjMap
    };



    // ♾️ 🧱🧱🧱
    async function Rec_assignChildrenMissingValues(nextObj, accObj = passAccObj)
    {
        // 0. this Rec_Func won't return nothing per se
        let { accStr } = accObj;
        let funcGeneralOrder = -1;

        const { nextStr, indent, accKeys } = accObj;
        const tab = `\t`.repeat((indent < 0) ? 0 : indent);

        accStr = accStr + '\n' + tab + nextStr; //accStr = accStr + '\n' + tab + accKeys.join(" ");


        for (const property in nextObj)
        {
            const nestedPpt = nextObj[property];
            if (nextObj.hasOwnProperty(property) && nestedPpt && typeof nestedPpt === "object" && !(nestedPpt instanceof Array))
            {
                // 0.
                const nextAccObj = {
                    parentKey: property,

                    indent: indent + 1,
                    inputTypeFromBaseKey: nestedPpt?.baseKey?.inputType,

                    accStr: accStr,
                    nextStr: nestedPpt.string || '', // debugging purposes
                };


                // 1. store for later - YT_GIF_DIRECT_SETTINGS
                if (property != 'baseKey') // there are too many, filter a litle bit
                {
                    const directObjPpts = (nestedPpt?.baseKey) ? nestedPpt.baseKey : nestedPpt;

                    if (directObjPpts.UpdateSettingsBlockValue) // an actual setting ... most definitely an inline Object
                    {
                        // 1.1 clousure
                        directObjPpts.UpdateSettingsBlockValue = function (replaceWith)
                        {
                            const rgxValue = new RegExp(/<(.*?)>/, 'gm'); // "<XXX>"
                            const preChange = directObjPpts.string + "";

                            const postChange = directObjPpts.string.replace(rgxValue, `<${replaceWith}>`);

                            if (postChange != directObjPpts.string) // well. don't make extra api calls
                            {
                                directObjPpts.string = postChange;
                                directObjPpts.sessionValue = replaceWith;
                                RAP.updateBlock(directObjPpts.uid, directObjPpts.string);
                                //console.log(`Setting ${property} was, \n${preChange} \nnow is \n${window.YT_GIF_DIRECT_SETTINGS.get(property).string}`)
                            }
                        };
                    }

                    directObjPpts.parentKey = accObj.parentKey || TARGET_PAGE;
                    keyObjMap.set(property, directObjPpts);
                }


                // 2. 
                accStr = await Rec_assignChildrenMissingValues(nextObj[property], nextAccObj);


                // 3.                                                                // this took two straight days ... thank you thank you
                if (nestedPpt.baseKey != undefined) // implied that inlineObj = false
                {
                    // 3.1
                    nestedPpt.baseKey.order = Number(++funcGeneralOrder); // the property (name) is a wrapper, look on it's level to access the baseKey
                    nestedPpt.baseKey.indent = nextAccObj.indent;
                }
                else if (nestedPpt.inlineObj == true) // InlinePmt and dom/setting so far
                {
                    // 3.1
                    nestedPpt.order = Number(++funcGeneralOrder);
                    nestedPpt.indent = nextAccObj.indent;
                    // 3.2
                    nestedPpt.inputType = (nestedPpt.inputType) ? nestedPpt.inputType : accObj.inputTypeFromBaseKey; // valid form baseKey? no, then keep same
                }
            }
        }
        return accStr;
    }
}
async function Read_Write_SettingsPage(UID, keyObjMap = new Map())
{
    // 0.
    const ChildrenHierarchy = await RAP.getBlockOrPageInfo(UID, true);
    const accObj = { accStr: '' };
    let FinishRec_thenDisplace_cbArr = []; // acc inside the Rec_Func


    if (!ChildrenHierarchy)
    {
        return 'Page is empty';
    }

    // 1.
    let singleKeyEntries = []; // acc
    const entirePageText = await Rec_Read_Write_SettingsPage(ChildrenHierarchy[0][0], accObj);

    // 🔚
    return FinishRec_thenDisplace_cbArr;



    // ♾️ 🧱🧱🧱
    async function Rec_Read_Write_SettingsPage(nextChildObj, accObj)
    {
        // 0.
        let { accStr } = accObj;
        let parentState = {
            displaced: false, // can loop throughout its children
            overrideKey: null,
        }

        const { nextUID, keyFromLevel0, selfOrder } = accObj;
        const { tab, nextStr, indent, parentUid } = await RelativeChildInfo(nextChildObj); // var from obj .1
        const { uid, key, value, caputuredValue, caputureValueOk, splitedStrArr, join } = getKeywordsFromBlockString(nextStr); // var from obj .2

        const { succesful, outKey, outUid } = await SettingsBlockReading(); // main logic

        // 1.
        if (!succesful)
        {
            // 1.1
            if (outUid != TARGET_UID && outKey != TARGET_PAGE)
                HandleFutureMove(outUid);
        }
        else
        {
            // 1.2
            accStr = accStr + '\n' + tab + nextStr; // outside of here, you'll the page before the changes
        }


        // 2.
        if (nextChildObj.children)
        {
            const object = await RAP.getBlockOrPageInfo(nextChildObj.uid);
            const children = RAP.sortObjectsByOrder(object[0][0].children);

            // 3. rec
            for (const child of children)
            {
                const nextAccObj = {
                    accStr: accStr,
                    nextUID: uid,
                    keyFromLevel0: nextChildObj.overrideKey || key || TARGET_PAGE, // well well well - the page can't be avoided, can it?
                    selfOrder: child.order,
                    parentState: parentState,
                    RoamObj: child,
                };

                accStr = await Rec_Read_Write_SettingsPage(child, nextAccObj);
            }
        }


        // 🔚
        return accStr; // debugging purposes



        // var from obj .1
        async function RelativeChildInfo(obj)
        {
            const nextStr = obj.string || obj.title || '';
            const parentsHierarchy = await RAP.getBlockParentUids(obj.uid);
            let nestLevel = parentsHierarchy.length;
            let tab = '\t';
            return {
                tab: tab.repeat(nestLevel),
                nextStr,
                indent: nestLevel,
                parentUid: (parentsHierarchy[0])
                    ? parentsHierarchy[0][0]?.uid : TARGET_UID, // if undefined - most defenetly it's the direct child (level 0) of page
            }
        }
        // var from obj .2
        function getKeywordsFromBlockString(nextStr)
        {
            const rgxUid = new RegExp(/\(([^\)]+)\)/, 'gm'); //(XXXXXXXX)
            const join = includesAtlest(nextStr, [PmtSplit, fmtSplit]);
            const splitedStrArr = nextStr.split(join); // deconstruct
            const everyFirstKeyword = splitedStrArr.map(word => word.split(' ')[0]); // returns array of words

            const preUid = rgxUid.exec(everyFirstKeyword[0]);
            const p_uid = preUid ? preUid[1] : undefined;

            const { value, caputureValueOk } = tryTrimCapturedValue(everyFirstKeyword[2] || '');

            return {
                uid: p_uid,

                key: everyFirstKeyword[1],

                caputuredValue: everyFirstKeyword[2],
                value: value,
                caputureValueOk,

                splitedStrArr,

                join
            }
            function tryTrimCapturedValue(string)
            {
                const prefix = string.substring(0, 1);
                const suffix = string.substring((string.length - 1), string.length);
                if (prefix == cptrPrfx && suffix == cptrSufx)
                {
                    // < >
                    return {
                        value: string.substring(1, string.length - 1),
                        caputureValueOk: true,
                    }
                }
                return {
                    value: string,
                    caputureValueOk: false,
                }
            }
            function includesAtlest(string, Arr)
            {
                const match = Arr.filter(s => string.includes(s));
                return (match.length > 0) ? match[0] : fmtSplit; // filter first match or default
            }
        }
        /* ********************************************* */
        // main logic
        async function SettingsBlockReading()
        {
            // 1.0
            let returnObj = {
                succesful: false,
                outKey: key,
                outUid: nextChildObj.uid,
            }

            // 1.1
            if (key && singleKeyEntries.includes(key)) // someone made a hard copy of a setting, deal with it
            {
                if (keyObjMap.has(key))
                {
                    const invalidKey = `${key}`.concat('_InvalidDuplicate');
                    const n_string = await UpdateRoamBlock_Settings(invalidKey);
                    debugger;
                    //accObj.RoamObj.string = n_string;
                    nextChildObj.string = n_string;
                    parentState.overrideKey = invalidKey; // it's facinating that this value will be lost in the recursion void - my understanding is that I can't grasp this shit... but attaching the value to a Rec_Fuc param as it's property... THAT! that will do the job... Facinating stuff indeed...
                    nextChildObj.overrideKey = invalidKey;

                    return returnObj = {
                        succesful: false,
                        outKey: invalidKey,
                        outUid: nextChildObj.uid,
                    };
                }
            }

            // 1.0
            singleKeyEntries.push(key); // keep track of any possible duplicates
            const targeObj = keyObjMap.get(key);


            // 1.2
            if (targeObj && key != TARGET_PAGE) // actual data reading & validation
            {
                // 1.2.1 make sure to read usefull session values
                let p_string = nextStr;
                const { v_uid, uidOk } = await validateBlockUid(uid);
                const { v_string, stringOK } = await validateBlockContent(targeObj, nextStr, splitedStrArr);

                // 1.2.2
                if (!uidOk || !stringOK)
                {
                    p_string = await UpdateRoamBlock_Settings(key, v_string); // for prompts 
                }

                // global
                assertObjPpt_base(targeObj, p_string, v_uid);

                // 1.2.4
                if (join == fmtSplit && targeObj.hasOwnProperty('sessionValue'))
                {
                    Object.assign(targeObj, UpdateInlineObj(targeObj)); // for and actual setting
                }

                // 1.2.5
                FinishRec_thenDisplace_cbArr.push(async () => await ToDisplaceInTheFuture(isOrderOk())); //validNestFromThePast -> boolean

                // 🔚
                returnObj = {
                    succesful: true,
                    outKey: key,
                    outUid: v_uid,
                };
            }

            return returnObj;



            //1.2.1
            async function validateBlockUid(caputuredUID)
            {
                const uidOk = (caputuredUID == nextChildObj.uid); // kinda redundant
                const v_uid = (uidOk) ? caputuredUID : nextChildObj.uid; // : nextUID;
                return {
                    uidOk,
                    v_uid,
                }
            }
            async function validateBlockContent(obj, nextStr, splitedStrArr)
            {
                const caputuredString = splitedStrArr[2] || ''; // undefinded means it doens't requieres a third param, that's ok

                let v_string = caputuredString;
                let stringOK = true;


                if (obj.string != caputuredString && obj.join == PmtSplit) // kinda hardcoded...
                {
                    debugger;
                    if (obj.uid != '' || obj.string.includes(" / ") || splitedStrArr[3] != undefined)
                    {
                        debugger;
                        throw new Error(`STOP! the string is invalid =>         ${obj.string}`);
                    }
                    v_string = obj.string;
                    stringOK = false;
                }

                return {
                    v_string,
                    stringOK
                }
            }

            // 1.1  - 1.2.2
            async function UpdateRoamBlock_Settings(newKey, newString, newUid = nextChildObj.uid)
            {
                splitedStrArr.splice(0, 1, `(${newUid})`); //.replace(/\(([^\)]+)\)/, `(${nextChildObj.uid})`);;
                splitedStrArr.splice(1, 1, newKey);
                if (newString)
                    splitedStrArr.splice(2, 1, newString);
                const v_string = splitedStrArr.join(join || PmtSplit);
                await RAP.updateBlock(newUid, v_string);
                await RAP.sleep(50);

                console.log(`Updating block  ((${uid})) -> \n ${nextStr} \n\nto ((${newUid})) -> \nﾠ\n${v_string}`);
                return v_string;
            }

            // 1.2.4
            function UpdateInlineObj(crrObjKey)
            {
                crrObjKey.sessionValue = value;
                crrObjKey.caputuredValue = caputuredValue;

                if (crrObjKey.inputType == int)
                {
                    crrObjKey.sessionValue = parseInt(crrObjKey.sessionValue, 10);
                }

                if (!caputureValueOk && splitedStrArr[2]) // caputured string too
                {
                    console.warn(`"${nextStr}" value looks weird, it will default to false...`);
                }
                return crrObjKey;
            }

            // 1.2.5
            function isOrderOk()
            {
                //                          are you indented correclty?      is your relative order alright?        are you nested under the proper block?
                const validNestFromThePast = (targeObj.indent == indent && accObj.selfOrder == targeObj.order && accObj.keyFromLevel0 == targeObj.parentKey);
                if (validNestFromThePast)
                {
                    parentState.displaced = true;
                }
                return validNestFromThePast;
            }
            async function ToDisplaceInTheFuture(validNestFromThePast)
            {
                const relevantParentUID = validNestFromThePast ? parentUid : keyObjMap.get(targeObj.parentKey).uid; // block with proper indent? no, then nest it under it's most relevant parent

                if (parentState.displaced == false) // shall stay with it's parent then
                {
                    await TryToMoveBlock(relevantParentUID, targeObj.order, targeObj.uid);
                    if (accObj.keyFromLevel0 != targeObj.parentKey)
                    {
                        await TryToMoveBlock(keyObjMap.get(targeObj.parentKey).uid, targeObj.order, targeObj.uid);
                    }
                }
            }
        }
        // 1.1
        function HandleFutureMove(uidToMove)
        {
            let Recylce_cb = null;
            if (keyFromLevel0 != 'DisplacedBlocks' && key)
            {
                Recylce_cb = async () => await TryToMoveBlock(keyObjMap.get('DisplacedBlocks').uid, 0, uidToMove); // move one block at a time and it's children along with it
            }
            else if (keyFromLevel0 != 'UnknownBlocks' && !nextStr.includes(join))
            {
                Recylce_cb = async () => await TryToMoveBlock(keyObjMap.get('UnknownBlocks').uid, 0, uidToMove); // well well well don't delete it if you don't know what it is
            }
            if (Recylce_cb)
            {
                FinishRec_thenDisplace_cbArr.push(Recylce_cb);
            }
            parentState = {
                displaced: true,
            };
        }

        /* ********* */
        async function TryToMoveBlock(parentUid, order, selfUid)
        {
            try
            {
                if (parentUid && selfUid && parentUid == selfUid)
                {
                    throw new Error(`STOP! Don't move block to itself =>         ${parentUid} ${childObjToMoveUID.string}`);
                }
                RAP.moveBlock(parentUid, order, selfUid);
            }
            catch (err)
            {
                debugger;
            }
        }
    }
}
async function addAllMissingBlocks()
{
    // 0.
    const accObj = {
        accStr: '',
        nextStr: this.accStr,

        accKeys: [],
        accHierarchyUids: [],
    };

    // 1.
    return await Rec_addAllMissingBlocks(window.YT_GIF_SETTINGS_PAGE, accObj);


    // ♾️ 🧱🧱🧱
    async function Rec_addAllMissingBlocks(nextObj, accObj = {})
    {
        // 0.
        let { accStr } = accObj;
        const { tab, nextStr } = accObj;

        accStr = accStr + '\n' + tab + nextStr;
        let HierarchyUids = [];


        for (const property in nextObj)
        {
            let nestedPpt = nextObj[property];
            if (nextObj.hasOwnProperty(property) && typeof nextObj[property] === "object" && nextObj[property] != null && !(nestedPpt instanceof Array))
            {

                // 1.
                if (property == 'baseKey')
                {
                    if (nestedPpt.examined == false)
                    {
                        nestedPpt = await createBaseKey(nestedPpt);
                    }

                    HierarchyUids = [...HierarchyUids, nestedPpt?.uid];
                }


                // 2.
                const nextAccObj = {
                    parentKey: property,

                    accKeys: [...accObj.accKeys, property],

                    accHierarchyUids: UTIL_K.pushSame(accObj.accHierarchyUids, ...HierarchyUids), // this is weird

                    accStr: accStr,
                    tab: `\t`.repeat(0),
                    nextStr: nestedPpt.string || '',
                };


                accStr = await Rec_addAllMissingBlocks(nextObj[property], nextAccObj); // recursion with await - 🤯


                // 3.
                if (nestedPpt.examined == false)
                {
                    nestedPpt = await createInlineSetting(nextAccObj, nestedPpt);
                }
            }
        }

        // 🔚
        return accStr;


        // 1.
        async function createBaseKey(nestedPpt)
        {
            let preStr = null;
            const prntKeyToInlineKey = accObj.parentKey;

            if (nestedPpt.baseValue != undefined) // in most cases it't children will add up information about it
            {
                preStr = validThirdParameterSplit(nestedPpt);
            }
            else // conventional - property that wraps others
            {
                preStr = nestedPpt.string;
            }

            const manualStt = {
                m_uid: accObj.accHierarchyUids[accObj.accHierarchyUids.length - 1] || TARGET_UID,
                m_strArr: (preStr)
                    ? [prntKeyToInlineKey, preStr] : [prntKeyToInlineKey],
                m_order: nestedPpt.order,
            };
            nestedPpt = await UIBlockCreation(nestedPpt, manualStt);
            return nestedPpt;
        }
        // 3.
        async function createInlineSetting(nextAccObj, nestedPpt)
        {
            const manualStt = {
                m_uid: HierarchyUids[HierarchyUids.length - 1],
                m_strArr: [
                    nextAccObj.accKeys[nextAccObj.accKeys.length - 1],
                    validThirdParameterSplit(nestedPpt)
                ],
                m_order: nestedPpt.order,
            };

            nestedPpt = await UIBlockCreation(nestedPpt, manualStt);
            return nestedPpt;
        }
        /* 🚙 */
        async function UIBlockCreation(keyObj, manual = {})
        {
            const { m_order, m_uid, m_join, m_strArr } = manual;
            const { uid, string } = fmtSettings(m_strArr, m_join || keyObj.join);
            const { order: selfOrder } = keyObj;

            await RAP.createBlock(
                m_uid || TARGET_UID,
                m_order || selfOrder || 10000,
                string,
                uid,
            );
            await checkReorderBlockObj(m_uid, m_order, keyObj);
            return assertObjPpt_base(keyObj, string, uid);
            //#region local utils
            function fmtSettings(strArr = [], splitter = fmtSplit)
            {
                const manualUID = RAP.createUid();
                const preBlockStr = [`(${manualUID})`, ...strArr];
                const blockStr = preBlockStr.join(splitter);
                return {
                    uid: manualUID,
                    string: blockStr
                }
            }
            //#endregion
        }
        function validThirdParameterSplit(nestedPpt)
        {
            let thirdParameter = null;

            if (nestedPpt.join == fmtSplit)
            {
                const value = nestedPpt.sessionValue = nestedPpt.baseValue;
                thirdParameter = nestedPpt.caputuredValue = `${cptrPrfx}${value}${cptrSufx}`; // BIG BOI  <value>
            }
            else if (nestedPpt.join == PmtSplit)
            {
                thirdParameter = nestedPpt.string;
            }
            return thirdParameter;
        }
    }
}
/* 🚙 🚙 🚙*/
function assertObjPpt_base(baseKeyObj, string, uid)
{
    const obj = {
        examined: true,
        uid: uid,
        string: string
    }
    return Object.assign(baseKeyObj, obj);
}
async function checkReorderBlockObj(parentUid, selfOrder, childObjToMoveUID)
{
    const validOrder = childObjToMoveUID.order;
    const validUid = childObjToMoveUID.uid;
    try
    {
        if (parentUid == validUid)
        {
            throw new Error(`STOP! Don't move block to itself =>         ${parentUid} ${childObjToMoveUID.string}`);
        }
        if (selfOrder != validOrder)
        {
            debugger;
            await RAP.moveBlock(parentUid, validOrder, validUid);
        }
    }
    catch (err)
    {
        debugger;
    }
}
//#endregion



//#region sub OBJECTS
/*---------------------------------------------*/
function InlinePmt(blockContent = '')
{
    const promptObj = {
        inlineObj: true,
        string: blockContent,
    }
    return Object.assign(BasePmt(), promptObj);
}
function BasePmt(blockContent = '')
{
    const promptObj = {
        join: PmtSplit,
        inputType: pmt,
        string: blockContent,
    }
    return Object.assign(baseTmp(), promptObj);
}
/*--------------------------------*/
function BaseSetting(inputType)
{
    return baseTmp(inputType);
}
/*---------------------------------------------*/
function BaseDom(baseValue = '', inputType)
{
    const domObj = {
        domEl: '',
        baseValue: baseValue,
        inputType: inputType,
        inlineObj: false,
    }
    return Object.assign(subTemp(), domObj);
}
function dom(baseValue = '', inputType)
{
    const domObj = {
        domEl: '',
        baseValue: baseValue,
        inputType: inputType,
    }
    return Object.assign(subTemp(), domObj);
}
/*--------------------*/
function BaseInitSetting(baseValue = '', inputType)
{
    const subInputObj = {
        baseValue: baseValue,
        inputType: inputType,
        inlineObj: false,
    }
    return Object.assign(subTemp(), subInputObj);
}
function initSetting(baseValue = '', inputType)
{
    return subTemp(baseValue, inputType);
}
/*---------------------------------------------------------------*/
function subTemp(baseValue = '', inputType)
{
    const subSub = {
        baseValue: baseValue,
        sessionValue: null,
        caputuredValue: '<>',
        join: fmtSplit,
        inlineObj: true,
        UpdateSettingsBlockValue: function () { console.warn(`Update block not implemented... ${this.uid} ${this.string}`) }
    }
    return Object.assign(baseTmp(inputType), subSub);
}
function baseTmp(_inputType, _string = '')
{
    return {
        examined: false,

        uid: '',
        parentKey: '',
        string: _string,

        inputType: _inputType,

        indent: null,
        child: null,
        order: null,

        inlineObj: false,
    }
}
/*---------------------------------------------------------------*/
//#endregion



/* TODO LIST

add ☐ ☑
    read values from settings page ☐
        alert to the user that some settings values could cause trouble ☐

        damage control ☐
            if the written uid doesn't match with the acutal block uid,
                update it ☐
                    if the property_key does match with the settings-page-obj

    create a recursive fucc to add order to nested objs ☐

    code and page distinguishing between ☑ ☑
        radio
        checkbox
        string
        url
        rng

added
    notice if property doesn't exist ☑ ☑
        then create it ☑ ☑


bugs ☐ ☑
    major bugs when " : " or " / " are mixed up together
        they wont't be removed or deleted when the obj is updated

    checkReorderBlock won't work if the order is in the right spot
        nested under a wrong parent

    somewhat CRITICAL, sometimes the roam api loads blocks with the same order... yikes

    loading inlinePmts...
        they get discarted on the recycle bin
            sometimes under the LogStatus block

        possible fix...
            move basekey objects with it's children to the recycle bin

    when creating or renaming keys
        if they're and they had nested inline pmts, they get
        left hanging in the recycle bin

            tried two times and it seems that 'displaced parent'
            is the responsable for the problem

            now it seems to be that those blocks with "deprecated" keys
            in the recycle bin are taken in account, changed it's string
            and then moved back to the recycle bin... but with messed up data

FIXME
    tryToremoveBlock
        nested blocks, specially those inside addOrderPmt()
        get removed just to be readded by next func

    order & indent on non baseKeys plz


solved ☐ ☑
    the inputType ins't being updated on dom() objs ☑ ☑

    when changes are made to the window.YT_GIF_SETTINGS_PAGE ☑ ☑
        the first block prompt message block count isn't updating

    renaming, hard deleting sub properties... ☑ ☑
        they get deleted ☑
        and readded at the botttom ☑
        move around by user ☑

    moving around above the prompt mss, ☑ ☑
        the injected block if any ---- that block inherits that string

    deleting huge chunks of settings blocks
        and because of the settingsPageReach, if they get clauded beyond that threshold
        they instantlly become useless and just a waste of space
            implement
                a recylce bin block
                a toogle for full control of the page
                and alternetavely a two smart bin blocks
                    one for deprecated settings (keys)
                    and another one for uknown blocks, most defenetly user blocks, because they lack the keys
*/