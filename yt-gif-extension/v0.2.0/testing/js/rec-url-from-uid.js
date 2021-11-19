await InputBlockVideoParams('_58aMsOfr');
await InputBlockVideoParams('A2ZKodXwg');
await InputBlockVideoParams('jmFbeY934');
await InputBlockVideoParams('Xq0KBPFrW');

async function InputBlockVideoParams(tempUID)
{
    let indentFunc = 0;
    let blockinOrder = -1;
    let componentInOrder = -1;
    let aliasComponentInOrder = -1;
    let componentsInOrder = new Map();
    const incrementIf = function (condition) { return condition ? Number(++this.order) : -1 };

    const results = { /* [all].condition: () => { }, inOrder: -1 */
        'component alias': {
            tone: 'purple',
            order: -1,
            incrementIf: incrementIf,
        },
        'has any aliases': {
            tone: 'blue'
        },
        'component': {
            tone: 'green',
            order: -1,
            incrementIf: incrementIf,
        },
        'any': {
            condition: () => true,
            tone: 'black',
        },
        'any component': {
            order: -1,
            incrementIf: incrementIf,
        }
    }


    const endObj = await TryToFindURL_Rec(tempUID);
    console.log(componentsInOrder);
    console.log('\n'.repeat(6)); // debugging


    async function TryToFindURL_Rec(uid, parentObj)
    {
        const objRes = await TryToFindURL(uid);

        results['component alias'].condition = () => parentObj?.innerAliasesUids?.includes(uid) && (!!objRes.urls?.[0]);
        results['has any aliases'].condition = () => objRes?.innerAliasesUids.length > 0;
        results['component'].condition = () => objRes.components.length > 0;
        const key = Object.keys(results).find(x => results[x].condition());


        console.log("%c" + cleanIndentedBlock(), `color:${results[key].tone}`);
        componentsInOrder.set(assertUniqueKey_while(uid), objRes.urls.join(' ') || 'no component url');


        if (objRes.innerUIDs?.length > 0)
        {
            indentFunc += 1;
            for (const i of objRes.innerUIDs)
            {
                const awaitingObj = await TryToFindURL_Rec(i, objRes);
            }
            indentFunc -= 1;
        }

        return { uid, objRes, parentObj };

        function assertUniqueKey_while(uid)
        {
            let similarCompoentCnt = 1;
            // const inOrder = kauderk.util.includesAtlest(['component', 'component alias'], key, null);
            // if (inOrder) blockinOrder += 1;
            // const keyInOrder = (inOrder) ? blockinOrder : -1;

            // if (key === 'component') componentInOrder += 1;
            // const keyInComponentOrder = (key === 'component') ? componentInOrder : -1;

            // if (key === 'component alias') aliasComponentInOrder += 1;
            // const keyInAliasComponentOrder = (key === 'component alias') ? aliasComponentInOrder : -1;

            // the urls will merge with the map.key.urls, the order will build on each other, thus that's roam's output

            const keyAnyComponetInOrder = results['any component'].incrementIf(kauderk.util.includesAtlest(['component', 'component alias'], key, null));
            const keyInComponentOrder = results['component'].incrementIf(key === 'component');
            const keyInAliasComponentOrder = results['component alias'].incrementIf(key === 'component alias');

            let baseKey = [indentFunc, uid, key, keyAnyComponetInOrder, keyInComponentOrder, keyInAliasComponentOrder];
            //let baseKey = [indentFunc, uid, key, keyInOrder, keyInComponentOrder, keyInAliasComponentOrder];
            let assertUniqueKey = [similarCompoentCnt, ...baseKey].join(' ') + 'ﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠ';


            while (componentsInOrder.has(assertUniqueKey))
            {
                similarCompoentCnt += 1; // make it unique
                assertUniqueKey = [similarCompoentCnt, ...baseKey].join(' ') + 'ﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠ';
            }
            return assertUniqueKey;
        }

        function cleanIndentedBlock()
        {
            const tab = '\t'.repeat(indentFunc);
            const cleanLineBrakes = objRes.rawText.replace(/(\n)/gm, ". ");
            const indentedBlock = tab + cleanLineBrakes.replace(/.{70}/g, '$&\n' + tab);
            return indentedBlock;
        }
    }


    async function TryToFindURL(desiredUID)
    {
        const info = await kauderk.rap.getBlockInfoByUID(desiredUID);
        const rawText = info[0][0]?.string || "F";

        // {{[[component]]: xxxyoutube-urlxxx }}
        const components = [...rawText.matchAll(/{{(\[\[)?((yt-gif|video))(\]\])?.*?(\}\}|\{\{)/gm)].map(x => x = x[0]) || [];
        // (((xxxuidxxx))) || ((xxxuidxxx))
        const innerUIDs = rawText.match(/(?<=\(\()([^(].*?[^)])(?=\)\))/gm);
        // [xxxanything goesxxx](((xxxuidxxx)))
        const aliasesPlusUids = [...rawText.matchAll(/\[(.*?(?=\]))]\(\(\((.*?(?=\)))\)\)\)/gm)];

        // has something else
        const innerAliasesUids = [...aliasesPlusUids].map(x => x = x[2]) || []; // [xxnopexxx]('((xxxyesxxx))')

        // block references alone
        const blockReferencesAlone = innerUIDs?.filter(x => !innerAliasesUids.includes(x));


        let urls = [];
        for (const i of components)
        {
            // xxxyoutube-urlxxx
            urls = kauderk.util.pushSame(urls, i.match(/(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(.*?(?=\s|\}|\]|\)))/)?.[0]);
        }

        return { uid: desiredUID, components, urls, innerUIDs, aliasesPlusUids, innerAliasesUids, blockReferencesAlone, rawText, info };
    };
}