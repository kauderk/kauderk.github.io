/*

add ☐ ☑
    alert to the user that some settings values could cause trouble

    code and page distinguishing between
        radio
        checkbox
        string
        url

        
added
    notice if property doesn't exist ☑ ☑
        then create it ☑ ☑
        

bugs ☐ ☑
    

solved ☐ ☑
    when changes are made to the window.UISettings
        the first block prompt message block count isn't updating ☑ ☑

*/

const targetPage = 'roam/js/kauderk/yt-gif/settings';
let TargetUID = await ccc.util.getPageUid(targetPage);

let orderCounter = 0; //  used as incremented, base counter and recursive conditional
const rad = 'radio', chk = 'checkbox', str = 'string', url = 'url';


window.UISettings = {
    /* permutations - checkbox */
    display: {
        baseKey: addOrder(),
        clip_life_span_format: dom('1'),
    },
    previousTimestamp: {
        baseKey: addOrder(),
        /* one a time */
        strict_start_timestamp: dom('1'),
        start_timestamp: dom(),
        fixed_start_timestamp: dom(),
    },
    previousVolume: {
        baseKey: addOrder(),
        /* one a time */
        strict_start_volume: dom('1'),
        start_volume: dom(),
        fixed_start_volume: dom(),
    },
    experience: {
        baseKey: addOrder(),
        sound_when_video_loops: dom('1'),
        awaiting_for_mouseenter_to_initialize: dom(),
        awaiting_with_video_thumnail_as_bg: dom('1'),
    },
    fullscreenStyle: {
        baseKey: addOrder(),
        smoll_vid_when_big_ends: dom('1'),
        mute_on_exit_fullscreenchange: dom(),
        pause_on_exit_fullscreenchange: dom(),
    },
    /* one at a time - radio */
    muteStyle: {
        baseKey: addOrder(),
        strict_mute_everything_except_current: dom('1'),
        muted_on_mouse_over: dom(),
        muted_on_any_mouse_interaction: dom(),
    },
    playStyle: {
        baseKey: addOrder(),
        strict_play_current_on_mouse_over: dom('1'),
        play_on_mouse_over: dom(),
        visible_clips_start_to_play_unmuted: dom(),
    },
    range: {
        baseKey: addOrder(),
        /*seconds up to 60*/
        timestamp_display_scroll_offset: dom('5'),
        /* integers from 0 to 100 */
        end_loop_sound_volume: dom('50'),
    },
    InAndOutKeys: {
        baseKey: addOrder(),
        /* middle mouse button is on by default */
        ctrlKey: sub('1'),
        shiftKey: sub(),
        altKey: sub(),
    },
    defaultValues: {
        baseKey: addOrder(),
        video_volume: sub(40),
        /* 'dark' or 'light' */
        css_theme: sub('dark'),
        /* empty means 50% - only valid css units like px  %  vw */
        player_span: sub('50%'),
        /* distinguish between {{[[video]]:}} from {{[[yt-gif]]:}} or 'both' which is also valid*/
        override_roam_video_component: sub(),
        /* src sound when yt gif makes a loop, empty if unwanted */
        end_loop_sound_src: sub('https://freesound.org/data/previews/256/256113_3263906-lq.mp3'),
    },
}



//#region crazy obj code ... javascript are you ok?
function addOrder()
{
    return base(Number(++orderCounter));
}
function base(order = '0')
{
    const base = {
        order: order,
    }
    return Object.assign(baseTmp(), base);
}

function dom(baseValue = '')
{
    const dom = {
        domEl: '',
    }
    return Object.assign(baseTmp(), subTemp(baseValue), dom);
}
function sub(baseValue = '')
{
    return Object.assign(baseTmp(), subTemp(baseValue));
}

function baseTmp()
{
    return {
        uid: '',
        string: '',
        examined: false,
    }
}
function subTemp(baseValue = '')
{
    const subSub = {
        baseValue: baseValue,
        sessionValue: null,
    }
    return Object.assign(baseTmp(), subSub);
}
function PromptMssg()
{
    return `The first ${orderCounter + 1} blocks will be added/removed automatically. The last parameters are customizable. 👋`;
}
//#endregion

const initSettingsPageMessage = PromptMssg();


if (TargetUID == null) // BrandNewInstallation
{
    TargetUID = await navigateToUiOrCreate(targetPage);
    await BrandNewInstallation(TargetUID);

    async function BrandNewInstallation(TargetUID)
    {
        for (const parentKey in window.UISettings)
        {
            const parentInfo = fmtSettings([parentKey]);
            const addedRoot = await createBlock(TargetUID, 100000, parentInfo.string, parentInfo.uid);

            window.UISettings[parentKey].baseKey.uid = addedRoot.uid; // LEVEL 0
            window.UISettings[parentKey].baseKey.string = addedRoot.string; // LEVEL 0

            for (const childKey in window.UISettings[parentKey])
            {
                for (const subKey in window.UISettings[parentKey][childKey]) // FIRST LEVEL > Sub properties
                {
                    if (subKey != 'sessionValue')
                        continue;

                    const baseValue = window.UISettings[parentKey][childKey].baseValue;

                    const SubPropertyInfo = fmtSettings([childKey, baseValue]);
                    const addedSubInfo = await createBlock(addedRoot.uid, 100000, SubPropertyInfo.string, SubPropertyInfo.uid);

                    window.UISettings[parentKey][childKey].uid = addedSubInfo.uid; // LEVEL 0 > sub
                    window.UISettings[parentKey][childKey].string = addedSubInfo.string; // LEVEL 0 > sub
                    window.UISettings[parentKey][childKey].sessionValue = baseValue; // LEVEL 0 > sub
                }
            }
        }
    }
}
else // Read and store Session Values
{
    const entirePageText = await Read_Write_SettingsPage(TargetUID);
    const addedBlocks = await addMissingSettings(TargetUID);
    // I want to think of this expensive calculations as looping through a 2d grid array
    // My monkey brain will never be able to compute THAT or even this

    async function addMissingSettings(TargetUID)
    {
        let addedBlocks = [];
        for (const parentKey in window.UISettings)
        {
            const examined = window.UISettings[parentKey].baseKey.examined;
            if (!examined)
            {
                const respectOrder = window.UISettings[parentKey].baseKey.order;
                const parentInfo = fmtSettings([parentKey]);
                const addedRoot = await createBlock(TargetUID, respectOrder, parentInfo.string, parentInfo.uid);

                window.UISettings[parentKey].baseKey.uid = addedRoot.uid;
                window.UISettings[parentKey].baseKey.string = addedRoot.string;
                window.UISettings[parentKey].baseKey.examined = true;

                addedBlocks.push(addedRoot.string);
            }

            for (const childKey in window.UISettings[parentKey])
            {
                for (const subKey in window.UISettings[parentKey][childKey]) // FIRST LEVEL > Sub properties
                {
                    if (subKey != 'sessionValue')
                        continue;

                    const examined = window.UISettings[parentKey][childKey].examined;
                    if (!examined)
                    {
                        const addedRoot = window.UISettings[parentKey].baseKey;
                        const baseValue = window.UISettings[parentKey][childKey].baseValue;
                        const respectOrder = window.UISettings[parentKey].baseKey.order;

                        const SubPropertyInfo = fmtSettings([childKey, baseValue]);
                        const addedSubInfo = await createBlock(addedRoot.uid, respectOrder, SubPropertyInfo.string, SubPropertyInfo.uid);

                        window.UISettings[parentKey][childKey].uid = addedSubInfo.uid; // LEVEL 0 > sub
                        window.UISettings[parentKey][childKey].string = addedSubInfo.string; // LEVEL 0 > sub
                        window.UISettings[parentKey][childKey].sessionValue = baseValue; // LEVEL 0 > sub

                        addedBlocks.push(addedSubInfo.string);

                        window.UISettings[parentKey][childKey].examined = true;
                    }
                }
            }
        }
        return addedBlocks;
    }

    console.log(entirePageText);
    console.log(window.UISettings);
    console.log(addedBlocks);
}
await createUpdatePromptMssIfMissing(TargetUID);
await SetNumberedViewWithUid(TargetUID);
await CollapseDirectcChildren(TargetUID, false);
return '';




async function createUpdatePromptMssIfMissing(parentUID)
{
    const child0UID = await ccc.util.getNthChildUid(parentUID, 0);
    const child0Str = await ccc.util.blockString(child0UID);
    const prePromptMssg = PromptMssg();

    if (child0Str != prePromptMssg)
    {
        ccc.util.updateBlockString(child0UID, prePromptMssg);
    }
}





async function Read_Write_SettingsPage(UID)
{
    const ChildrenHierarchy = await getBlockOrPageInfo(UID, true);

    if (!ChildrenHierarchy)
    {
        return 'Page is empty';
    }

    //accumulativeString
    return await Rec_Read_Write_SettingsPage(ChildrenHierarchy[0][0], '');
}

async function Rec_Read_Write_SettingsPage(nextObj, accStr, nextUID, keyFromLevel0)
{
    const { tab, nextStr, indent } = await NestedString(nextObj);
    const { uid, key, value } = getSettingsFromString(nextStr);

    if (!SuccesfullKeyUpt(indent)) // remove it
    {
        const uidToDelete = uid || nextUID;
        if (uidToDelete)
        {
            await removingBlock(uidToDelete);
        }
    }
    else
    {
        accStr = accStr + '\n' + tab + nextStr; // outside of here, you'll the page after the delitions
    }


    if (nextObj.children)
    {
        const object = await getBlockOrPageInfo(nextObj.uid);
        const children = sortObjectsByOrder(object[0][0].children);

        for (const child of children)
        {
            if (child.order > orderCounter) // stop here
                return accStr;

            accStr = await Rec_Read_Write_SettingsPage(child, accStr, uid, key);
        }
    }

    return accStr;

    //#region local uitils
    function getSettingsFromString(nextStr)
    {
        //const rgxBase = new RegExp(/\(([^\)]+)\)( : )(\b\w+\b)| |:|(\b.*\b)/, 'gm');
        //const rgxBase = new RegExp(/\(([^\)]+)\)( : )(\b\w+\b)| |:|(\b.*\b)/, 'gm');
        const rgxUid = new RegExp(/\(([^\)]+)\)/, 'gm'); //(XXXXXXXX)
        // const rgxKey = new RegExp(/(?<=\)\s:\s)(\b\w+\b)/, 'gm'); //) : XXXXXXXXX
        // (?<=\S : )([^\s]*)

        // big monkey brain .. uga buga
        // split the string by " : " and compare keys and values [1], [2]
        // uga buga

        let splitedStr = nextStr.split(' : '); // deconstruct
        const firstWords = splitedStr.map(word => word.split(' ')[0]); // get only the first word inside between ' : '
        const rawUid = rgxUid.exec(firstWords[0]);

        return {
            uid: rawUid ? rawUid[1] : undefined,
            key: firstWords[1],
            value: firstWords[2],
        }
    }

    function SuccesfullKeyUpt(indent)
    {
        if (indent == 0)
        {
            if (RecIsValidNestedKey(window.UISettings, key)) // LEVEL 0 block upt
            {
                window.UISettings[key].baseKey.string = nextStr;
                window.UISettings[key].baseKey.uid = uid;
                window.UISettings[key].baseKey.examined = true;
                return true;
            }
        }
        else if (indent == 1)
        {
            if (RecIsValidNestedKey(window.UISettings, keyFromLevel0, [key])) // nested LEVEL 1 block upt
            {
                window.UISettings[keyFromLevel0][key].string = nextStr;
                window.UISettings[keyFromLevel0][key].uid = uid;
                window.UISettings[keyFromLevel0][key].examined = true;
                window.UISettings[keyFromLevel0][key].sessionValue = value;
                return true;
            }
        }
        return false;
    }

    function RecIsValidNestedKey(obj, level, ...rest)
    {
        if (obj === undefined) 
        {
            return false
        }
        if (rest.length == 0 && obj.hasOwnProperty(level))
        {
            return true
        }
        return RecIsValidNestedKey(obj[level], ...rest)
    }
    async function removingBlock(uid)
    {
        if (uid == TargetUID) return;
        // the nature of the recursive func makes it
        // so the page can't be avoided, you don't want that - return

        console.log(`"${nextStr}" <= invalid YT GIF setting was removed!`);
        await ccc.util.deleteBlock(uid);
    }
    //#endregion
}

async function NestedString(obj)
{
    const nextStr = obj.string || obj.title || '';
    const parentsHierarchy = await getBlockParentUids(obj.uid);
    let nestLevel = parentsHierarchy.length;
    let tab = '\t';
    return {
        tab: tab.repeat(nestLevel),
        nextStr,
        indent: nestLevel,
    }
}




function fmtSettings(strArr = [])
{
    const manualUID = roamAlphaAPI.util.generateUID();
    const preBlockStr = [`(${manualUID})`, ...strArr];
    const blockStr = preBlockStr.join(' : ');
    return {
        uid: manualUID,
        string: blockStr
    }
}
async function batchCreateBlocks(parent_uid, starting_block_order, string_array_to_insert)
{
    parent_uid = parent_uid.replace('((', '').replace('))', '');
    let addedInfo = [];
    await string_array_to_insert.forEach(async (item, counter) =>
    {
        addedInfo.push(await createBlock(parent_uid, counter + starting_block_order, item.toString()))
    });
    return addedInfo;
}

async function createBlock(parent_uid, block_order, block_string, manualUID = false)
{
    parent_uid = parent_uid.replace('((', '').replace('))', '');
    let newUid = (!manualUID) ? roamAlphaAPI.util.generateUID() : manualUID; // polymorphism man...

    await window.roamAlphaAPI.createBlock(
        {
            location: {
                "parent-uid": parent_uid,
                order: block_order
            },
            block: {
                string: block_string.toString(),
                uid: newUid
            }
        });
    await roam42.common.sleep(10); //seems a brief pause is need for DB to register the write
    return {
        uid: newUid,
        parentUid: parent_uid,
        order: block_order,
        string: block_string,
    };
}






async function SetNumberedViewWithUid(uid)
{
    //https://github.com/dvargas92495/roam-js-extensions/blob/c7092e40f6602a97fb555ae9d0cda8d2780ba0f2/src/entries/mouseless.ts#:~:text=%60%5B%3Afind%20(pull%20%3Fb%20%5B%3Achildren/view-type%5D)%20%3Awhere%20%5B%3Fb%20%3Ablock/uid%20%22%24%7Buid%7D%22%5D%5D%60
    const newViewType = "numbered";
    window.roamAlphaAPI.updateBlock({
        block: { uid, "children-view-type": newViewType },
    });
}
async function CollapseDirectcChildren(block_uid, block_expanded)
{
    const firstGen = await ccc.util.allChildrenInfo(block_uid);
    const children = sortObjectsByOrder(firstGen[0][0].children);

    for (const child of children)
    {
        await ExpandBlock(child.uid, block_expanded);
    }
}
async function ExpandBlock(block_uid, block_expanded)
{
    return await window.roamAlphaAPI.updateBlock(
        { block: { uid: block_uid, open: block_expanded } });
}






async function getBlockOrPageInfo(blockUid)
{
    const results = await window.roamAlphaAPI.q(`[:find (pull ?e [ :node/title :block/string :block/children :block/uid :block/order { :block/children ... } ] ) :where [ ?e :block/uid \"${blockUid}\" ] ]`);
    /*const Reading =
        `[:find 
            (pull 
                ?e 
                    [ 
                        :node/title 
                        :block/string 
                        :block/children 
                        :block/uid 
                        :block/order 
                        { 
                            :block/children ... 
                        } 
                    ] 
            ) 
            :where 
                [ 
                    ?e 
                    :block/uid \"${blockUid}\" 
                ] 
         ]`
        ;*/
    return (results.length == 0) ? undefined : results
}

function sortObjectsByOrder(o)
{
    return o.sort((a, b) => a.order - b.order);
}

async function getBlockParentUids(uid)
{
    try
    {
        var parentUIDs = await window.roamAlphaAPI.q(`[:find (pull ?block [{:block/parents [:block/uid]}]) :in $ [?block-uid ...] :where [?block :block/uid ?block-uid]]`, [uid])[0][0];
        /*var Reading = await window.roamAlphaAPI.q(
            `[:find 
                (pull 
                    ?block 
                        [
                            {
                                :block/parents
                                [
                                    :block/uid
                                ]
                            }
                        ]
                ) 
                :in $ 
                    [
                        ?block-uid ...
                    ] 
                :where 
                    [
                        ?block 
                        :block/uid ?block-uid
                    ]
             ]`
            , [uid])[0][0];*/
        var UIDS = parentUIDs.parents.map(e => e.uid)
        UIDS.shift();
        return getPageNamesFromBlockUidList(UIDS)
    }
    catch (e) 
    {
        return '';
    }
}
async function getPageNamesFromBlockUidList(blockUidList)
{
    //blockUidList ex ['sdfsd', 'ewfawef']
    var rule = '[[(ancestor ?b ?a)[?a :block/children ?b]][(ancestor ?b ?a)[?parent :block/children ?b ](ancestor ?parent ?a) ]]';
    var query = `[:find  (pull ?block [:block/uid :block/string])(pull ?page [:node/title :block/uid])
                                     :in $ [?block_uid_list ...] %
                                     :where
                                      [?block :block/uid ?block_uid_list]
                                     [?page :node/title]
                                     (ancestor ?block ?page)]`;
    var results = await window.roamAlphaAPI.q(query, blockUidList, rule);
    return results;
}


async function navigateToUiOrCreate(destinationPage, openInSideBar = false, sSidebarType = 'outline')
{
    //sSidebarType = block, outline, graph
    const prefix = destinationPage.substring(0, 2);
    const suffix = destinationPage.substring(destinationPage.length - 2, destinationPage.length);
    if (sSidebarType == 'outline' && (prefix == '((' && suffix == '))')) 
    {
        //test if block ref to open in block mode
        sSidebarType = 'block'; //chnage to block mode
    }
    if ((prefix == '[[' && suffix == ']]') || (prefix == '((' && suffix == '))'))
    {
        // [[ ]] or (( ))
        destinationPage = destinationPage.substring(2, destinationPage.length - 2);
    }

    let uid = await ccc.util.getPageUid(destinationPage);

    if (uid == null)
    {
        //test if UID for zooming in, if not create page
        uid = await getPageInfo(destinationPage);
        if (uid == null)
        {
            //not a page, nor UID so create page
            if (destinationPage.length > 255)
            {
                destinationPage = destinationPage.substring(0, 254);
            }
            await ccc.util.getOrCreatePageUid(destinationPage)
            //await ccc.util.getOrCreatePageUid(destinationPage, initSettingsPageMessage);
            await sleep(50);

            uid = await await ccc.util.getPageUid(destinationPage);
        }
        else
        {
            uid = destinationPage; //seems to be a UID, zoom it
        }
    }


    if (openInSideBar == false)
    {
        document.location.href = baseUrl().href + '/' + uid;
    }
    else
    {
        await roamAlphaAPI.ui.rightSidebar.addWindow(
            {
                window:
                {
                    "block-uid": uid,
                    type: sSidebarType
                }
            }
        );
    }
    return uid;

    function sleep(afterMiliseconds)
    {
        return new Promise(resolve => setTimeout(resolve, afterMiliseconds))
    }

    function baseUrl()
    {
        const url = new URL(window.location.href);
        const parts = url.hash.split('/');
        url.hash = parts.slice(0, 3).concat(['page']).join('/');
        return url;
    };

    async function getPageInfo(blockUid)
    {
        const results = await window.roamAlphaAPI.q(`[:find (pull ?e [ :node/title :block/string :block/children :block/uid :block/order { :block/children ... } ] ) :where [ ?e :block/uid \"${blockUid}\" ] ]`);
        return (results.length == 0) ? undefined : results
    }
} //navigateUIToDate

