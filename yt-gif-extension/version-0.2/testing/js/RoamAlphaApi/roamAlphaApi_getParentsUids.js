
let UID = ccc.util.getPageUid('October 22nd, 2021');
let text = GetAllNestedTextFromUID(UID);
return text;

function GetAllNestedTextFromUID(UID)
{
    let info = getPageInfo(UID, true);
    if (!info)
        return 'Page is empty';

    let results = info[0][0];
    return RecursiveGetChildrenText(results, '');

}
function RecursiveGetChildrenText(o, accStr)
{
    let next = o.string || o.title;
    let tab = '';
    let parentsHirarchy = getBlockParentUids(o.uid);
    for (let i = 0; i < parentsHirarchy.length; i++)
    {
        tab = '\t' + tab;
    }
    accStr = accStr + '\n' + tab + next;

    if (o.children)
    {
        var object = getPageInfo(o.uid);
        var children = sortObjectsByOrder(object[0][0].children);

        for (var i = 0; i < children.length; i++)
        {
            let childObj = children[i];


            accStr = RecursiveGetChildrenText(childObj, accStr);
        }
    }

    return accStr;
}
function getPageInfo(blockUid)
{
    const results = window.roamAlphaAPI.q(`[:find (pull ?e [ :node/title :block/string :block/children :block/uid :block/order { :block/children ... } ] ) :where [ ?e :block/uid \"${blockUid}\" ] ]`);
    return (results.length == 0) ? undefined : results
}

function sortObjectsByOrder(o)
{
    return o.sort((a, b) => a.order - b.order);
}

function getBlockParentUids(uid)
{
    try
    {
        var parentUIDs = window.roamAlphaAPI.q(`[:find (pull ?block [{:block/parents [:block/uid]}]) :in $ [?block-uid ...] :where [?block :block/uid ?block-uid]]`, [uid])[0][0];
        var UIDS = parentUIDs.parents.map(e => e.uid)
        UIDS.shift();
        return getPageNamesFromBlockUidList(UIDS)
    } catch (e) { return ''; }
}
function getPageNamesFromBlockUidList(blockUidList)
{
    //blockUidList ex ['sdfsd', 'ewfawef']
    var rule = '[[(ancestor ?b ?a)[?a :block/children ?b]][(ancestor ?b ?a)[?parent :block/children ?b ](ancestor ?parent ?a) ]]';
    var query = `[:find  (pull ?block [:block/uid :block/string])(pull ?page [:node/title :block/uid])
                                     :in $ [?block_uid_list ...] %
                                     :where
                                      [?block :block/uid ?block_uid_list]
                                     [?page :node/title]
                                     (ancestor ?block ?page)]`;
    var results = window.roamAlphaAPI.q(query, blockUidList, rule);
    return results;
}