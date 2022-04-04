var kauderk = window.kauderk || {};

kauderk.rap = ((rap) =>
{
    /* DISCLAIMER - THE MAJORITY OF THIS FUNCTIONS I TOOK THEM FROM ...
    https://github.com/yangkennyk/Roam42-Mirror/blob/5f9217e7f89c46b8cc409726aca744d1eca106e9/common/commonDatalog.js
    https://github.com/dvargas92495/roam42/blob/35f75e3bfbcaea1cecb79250175f4730df3128b5/common/commonDatalog.js
    https://github.com/dvargas92495/roam42/blob/7b20c8a80eda4ef8641916db4c252c7dbe58ba58/common/commonFunctions.js
    https://davidbieber.com/snippets/2020-12-22-datalog-queries-for-roam-research/
    https://www.zsolt.blog/2021/01/Roam-Data-Structure-Query.html
    https://www.putyourleftfoot.in/introduction-to-the-roam-alpha-api
    https://www.putyourleftfoot.in/roampagesearch
    https://github.com/c3founder/Roam-Enhancement/blob/main/enhancedUtility.js
    https://github.com/dvargas92495/roam42/blob/35f75e3bfbcaea1cecb79250175f4730df3128b5/common/commonDatalog.js
    >>>> "Why not use those already?" Well, I learned some things in the process. I'd like to think that way. 
    Also, this piece of code is less dependent on external resources.
    */

    rap.isBlockRef = async (uid) =>
    {
        try
        {
            if (uid.startsWith("(("))
            {
                uid = uid.slice(2, uid.length);
                uid = uid.slice(0, -2);
            }

            var block_ref = await window.roamAlphaAPI.q(`
              [:find (pull ?e [:block/string])
                  :where [?e :block/uid "${uid}"]]`);

            return (block_ref.length > 0 && block_ref[0][0] != null) ? true : false;
        } catch (e) { return ''; }
    }
    rap.getBlockByPhrase = async (search_phrase) =>
    {
        var blocks = await window.roamAlphaAPI.q(`[:find (pull ?e [:block/uid :block/string] ) :where [?e :block/string ?contents][(clojure.string/includes? ?contents "${search_phrase}")]]`);
        return blocks;
    }

    const mouseOverEvents = ['mouseover'];
    rap.simulateMouseOver = (element) =>
    {
        mouseOverEvents.forEach(mouseEventType =>
            element.dispatchEvent(new MouseEvent(mouseEventType, { view: window, bubbles: true, cancelable: true, buttons: 1 }))
        );
    }
    rap.setSideBarState = async (state) =>
    {
        switch (state)
        {
            case 1: //open left
                if (document.querySelector('.rm-open-left-sidebar-btn'))
                { //not open.. so open
                    rap.simulateMouseOver(document.getElementsByClassName("rm-open-left-sidebar-btn")[0]);
                    setTimeout(async () =>
                    {
                        document.getElementsByClassName("rm-open-left-sidebar-btn")[0].click();
                    }, 100);
                }
                break;
            case 2: //close left
                if (!document.querySelector('.rm-open-left-sidebar-btn'))
                { //open.. so close
                    document.querySelector(".roam-sidebar-content .bp3-icon-menu-closed").click()
                    rap.simulateMouseOver(document.getElementsByClassName("roam-article")[0]);
                }
                break;
            case 3: //open right 
                await roamAlphaAPI.ui.rightSidebar.open()
                break;
            case 4: //close right
                await roamAlphaAPI.ui.rightSidebar.close()
                break;
        }
    }

    rap.updateBlock = async (block_uid, block_string, block_expanded = true) =>
    {
        block_uid = block_uid.replace('((', '').replace('))', '');
        return window.roamAlphaAPI.updateBlock(
            { block: { uid: block_uid, string: block_string.toString(), open: block_expanded } });
    }
    rap.moveBlock = async (parent_uid, block_order, block_to_move_uid) =>
    {
        return window.roamAlphaAPI.moveBlock(
            {
                location: { "parent-uid": parent_uid, order: block_order },
                block: { uid: block_to_move_uid }
            });
    }
    rap.sleep = m => new Promise(r => setTimeout(r, m));
    rap.createBlock = async (parent_uid, block_order, block_string, manualUID = false) =>
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
        await rap.sleep(10); //seems a brief pause is need for DB to register the write
        return {
            uid: newUid,
            parentUid: parent_uid,
            order: block_order,
            string: block_string,
        };
    }
    rap.SetNumberedViewWithUid = async (uid) =>
    {
        //https://github.com/dvargas92495/roam-js-extensions/blob/c7092e40f6602a97fb555ae9d0cda8d2780ba0f2/src/entries/mouseless.ts#:~:text=%60%5B%3Afind%20(pull%20%3Fb%20%5B%3Achildren/view-type%5D)%20%3Awhere%20%5B%3Fb%20%3Ablock/uid%20%22%24%7Buid%7D%22%5D%5D%60
        const newViewType = "numbered";
        window.roamAlphaAPI.updateBlock({
            block: { uid, "children-view-type": newViewType },
        });
    }
    rap.CollapseDirectcChildren = async (block_uid, block_expanded) =>
    {
        const firstGen = await rap.allChildrenInfo(block_uid);
        const children = rap.sortObjectsByOrder(firstGen[0][0].children);

        for (const child of children)
        {
            await rap.ExpandBlock(child.uid, block_expanded);
        }
    }
    rap.ExpandBlock = async (block_uid, block_expanded) =>
    {
        return await window.roamAlphaAPI.updateBlock(
            { block: { uid: block_uid, open: block_expanded } });
    }
    rap.getBlockOrPageInfo = async (blockUid) =>
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
    rap.getBlockInfoByUID = async (blockUid) =>
    {
        return await window.roamAlphaAPI.q(`[:find (pull ?b [:block/string]):where [?b :block/uid "${blockUid}"]]`);
    }
    rap.getBlockInfoByUIDM = async (uid, withChildren = false, withParents = false) =>
    {
        try
        {
            let q = `[:find (pull ?page
                         [:node/title :block/string :block/uid :block/heading :block/props 
                          :entity/attrs :block/open :block/text-align :children/view-type
                          :block/order
                          ${withChildren ? '{:block/children ...}' : ''}
                          ${withParents ? '{:block/parents ...}' : ''}
                         ])
                      :where [?page :block/uid "${uid}"]  ]`;
            var results = await window.roamAlphaAPI.q(q);
            if (results.length == 0) return null;
            return results;
        } catch (e)
        {
            return null;
        }
    }
    rap.sortObjectsByOrder = (o) =>
    {
        return o.sort((a, b) => a.order - b.order);
    }
    rap.getBlockParentUids = async (uid) =>
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
            return rap.getPageNamesFromBlockUidList(UIDS)
        }
        catch (e) 
        {
            return '';
        }
    }
    rap.getBlockParentUids_custom = async (uid) =>
    {
        try
        {
            var parentUIDs = await window.roamAlphaAPI.q(`[:find (pull ?block [{:block/parents [:block/uid]}]) :in $ [?block-uid ...] :where [?block :block/uid ?block-uid]]`, [uid])[0][0];
            var UIDS = parentUIDs?.parents?.map(e => e.uid)
            return rap.getPageNamesFromBlockUidList(UIDS)
        }
        catch (e) 
        {
            return [];
        }
    }
    rap.getPageNamesFromBlockUidList = async (blockUidList) =>
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
    rap.navigateToUiOrCreate = async (destinationPage, openInSideBar = false, sSidebarType = 'outline') =>
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

        let uid = await rap.getPageUid(destinationPage);

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
                await rap.getOrCreatePageUid(destinationPage)

                await sleep(50);

                uid = await await rap.getPageUid(destinationPage);
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
    }
    /* -------------------------------------------------------------------- */
    rap.openBlockInSidebar = (blockUid, windowType = 'outline') =>
    {
        //windowType = block, outline, graph
        return window.roamAlphaAPI.ui.rightSidebar.addWindow({ window: { type: windowType, 'block-uid': blockUid } })
    }
    rap.getPageUid = (pageTitle) =>
    {
        const res = window.roamAlphaAPI.q(
            `[:find (pull ?page [:block/uid])
        :where [?page :node/title \"${pageTitle}\"]]`)
        return res.length ? res[0][0].uid : null
    }
    rap.deleteBlock = (blockUid) =>
    {
        return window.roamAlphaAPI.deleteBlock({ "block": { "uid": blockUid } });
    }
    rap.createUid = () =>
    {
        return roamAlphaAPI.util.generateUID();
    }
    rap.createPage = (pageTitle) =>
    {
        let pageUid = rap.createUid()
        const status = window.roamAlphaAPI.createPage(
            {
                "page":
                    { "title": pageTitle, "uid": pageUid }
            })
        return status ? pageUid : null
    }
    rap.createChildBlock = (parentUid, order, childString, childUid) =>
    {
        return window.roamAlphaAPI.createBlock(
            {
                location: { "parent-uid": parentUid, order: order },
                block: { string: childString.toString(), uid: childUid }
            })
    }
    rap.getOrCreatePageUid = (pageTitle, initString = null) =>
    {
        let pageUid = rap.getPageUid(pageTitle)
        if (!pageUid)
        {
            pageUid = rap.createPage(pageTitle);
            if (initString)
                rap.createChildBlock(pageUid, 0, initString, rap.createUid());
        }
        return pageUid;
    }
    rap.allChildrenInfo = (blockUid) =>
    {
        let results = window.roamAlphaAPI.q(
            `[:find (pull ?parent 
                [* {:block/children [:block/string :block/uid :block/order]}])
      :where
          [?parent :block/uid \"${blockUid}\"]]`)
        return (results.length == 0) ? undefined : results
    }
    return rap;
})(kauderk.rap || {});