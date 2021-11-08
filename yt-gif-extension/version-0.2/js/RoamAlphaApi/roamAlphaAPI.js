

function workingForBlocks()
{
    function sortObjectsByOrder(o)
    {
        return o.sort(
            function (a, b) 
            {
                return a[0].order - b[0].order;
            }
        );
    }
    async function getChildren(o, s)
    {
        s = s + ' ' + o.string;
        if (o.children)
        {
            var b = await roam42.common.getBlockInfoByUID(o.uid, true);
            var c = await roam42.common.sortObjectsByOrder(b[0][0].children);
            for (var i = 0; i < c.length; i++)
                s = await getChildren(c[i], s);
        }
        return s;
    }


    let UID = '6udVTLgEw';
    async function GetAllNestedTextFromUID(UID)
    {
        let results = await roam42.common.getBlockInfoByUID(UID, true);
        results = sortObjectsByOrder(results);
        var text = await getChildren(results[0][0], '');
        return text;
    }

    let text = await GetAllNestedTextFromUID(UID);
    return text;
}

var resultObject = getInfoUID('6udVTLgEw');
async function getInfoUID(uid)
{
    const obj = await roam42.common.getBlockInfoByUID(uid, true);
    return obj;
}


function workingForOneLevelDeep()
{

    function sortObjectsByOrder(o)
    {
        return o.sort(
            function (a, b) 
            {
                return a[0].order - b[0].order;
            }
        );
    }
    async function getChildren(o, s)
    {
        s = s + ' ' + o.string;
        if (o.children)
        {
            var b = await ccc.util.allChildrenInfo(o.uid, true);
            console.log(b);
            var c = await roam42.common.sortObjectsByOrder(b[0][0].children);
            for (var i = 0; i < c.length; i++)
                s = await getChildren(c[i], s);
        }
        return s;
    }

    let UID = roam42.common.getPageUidByTitle('Test');
    UID = 'L03McCbid';
    UID = '6udVTLgEw';
    async function GetAllNestedTextFromUID(UID)
    {
        let results = await ccc.util.allChildrenInfo(UID, true);
        results = sortObjectsByOrder(results);
        var text = await getChildren(results[0][0], '');
        return text;
    }
    let text = await GetAllNestedTextFromUID(UID);
    return text;



}



function workingForAll()
{
    function GetAllNestedTextFromUID(UID)
    {
        let results = getPageInfo(UID, true);
        var text = getChildren(results[0][0], '');
        return text;
    }
    function getChildren(o, accStr)
    {
        let next = o.string || o.title;
        accStr = accStr + ' ' + next;
        if (o.children)
        {
            var object = getPageInfo(blockUid);
            var children = object[0][0].children;
            for (var i = 0; i < children.length; i++)
            {
                let childObj = children[i];
                accStr = getChildren(childObj, accStr);
            }
        }
        return accStr;
    }
    function getPageInfo(blockUid)
    {
        // let results = window.roamAlphaAPI.q(
        //     `[:find (pull ?parent 
        //         [* 
        //             {
        //                 :block/children 
        //                 [
        //                     :block/string 
        //                     :block/uid 
        //                     :block/order
        //                 ]
        //             }
        //         ])
        //         :where 
        //         [
        //             ?parent :block/uid \"${blockUid}\"
        //         ]
        //     ]`
        // );

        const results = window.roamAlphaAPI.q(
            `[:find (pull ?e 
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
                        ?e :block/uid \"${blockUid}\"
                    ]
            ]`
        );
        return (results.length == 0) ? undefined : results
    }

    let UID = ccc.util.getPageUid('Test');
    let text = GetAllNestedTextFromUID(UID);
    return text;
}


function workingForAll2()
{
    let UID = ccc.util.getPageUid('October 22nd, 2021');
    let text = await GetAllNestedTextFromUID(UID);
    return text;

    async function GetAllNestedTextFromUID(UID)
    {
        let results = getPageInfo(UID, true);
        results = sortObjectsByOrder(results);
        var text = getChildren(results[0][0], '');
        return text;
    }
    async function getChildren(o, accStr)
    {
        let next = o.string || o.title;
        accStr = accStr + '\n' + next;
        if (o.children)
        {
            var object = getPageInfo(o.uid);
            var children = await roam42.common.sortObjectsByOrder(object[0][0].children);
            //var children = object[0][0].children;
            for (var i = 0; i < children.length; i++)
            {
                let childObj = children[i];
                accStr = getChildren(childObj, accStr);
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
        return o.sort(
            function (a, b) 
            {
                return a[0].order - b[0].order;
            }
        );
    }
}


function workingForPages()
{

    let UID = ccc.util.getPageUid('October 22nd, 2021');
    let text = GetAllNestedTextFromUID(UID);
    return text;

    function GetAllNestedTextFromUID(UID)
    {
        let info = getPageInfo(UID, true);
        if (!info)
            return 'Page is empty';

        let results = info[0][0];
        return getChildren(results, '');

    }
    function getChildren(o, accStr)
    {
        let next = o.string || o.title;
        let tab = '';
        for (let i = 0; i < o.order; i++)
        {
            tab + '\t';
        }
        console.log(o.order);
        accStr = tab + accStr + '\n' + next;

        if (o.children)
        {
            var object = getPageInfo(o.uid);
            var children = sortObjectsByOrder(object[0][0].children);

            for (var i = 0; i < children.length; i++)
            {
                let childObj = children[i];
                accStr = getChildren(childObj, accStr);
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
}