await getUrlMap('0qV8_pWLL');
await getUrlMap('qdIfrsS6i');

async function getUrlMap(tempUID)
{
    let indentFunc = 0;
    let componentsInOrderMap = new Map();
    let keepTrackOfUids = [];
    let keepTrackOfUidsMap = new Map();

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



        console.log("%c" + cleanIndentedBlock(), `color:${results[hasKey]?.tone || 'black'}`);


        for (const i of objRes.urlsWithUids) // looping through RENDERED urls (components) and uids (references)
        {
            results['is component'].condition = () => objRes?.urls.includes(i);
            results['is alias'].condition = () => objRes?.innerAliasesUids.includes(i);
            results['is block referece'].condition = () => objRes?.blockReferencesAlone.includes(i);
            const isKey = Object.keys(results).filter(x => x.includes('is')).find(x => results[x].condition());


            if (isKey == 'is component' // it contains the url
                && !parentObj?.isKey?.includes('alias') // but adding nested ones
                && !parentObj?.hasKey?.includes('alias') // is irrelant

                || (isKey == 'is alias' && i != tempUID)) // though for each 'parent block' a point of referece for it's aliases is alright
            {
                componentsInOrderMap.set(assertUniqueKey_while(uid, indentFunc, isKey).uniqueKey, i);
            }

            if (objRes.innerUIDs.includes(i))
            {
                if (keepTrackOfUids.includes(i) || i == tempUID)
                {
                    keepTrackOfUids.push(i);
                    if (isKey == 'is block referece') // it is rendered, so execute it's rec func
                        await ExecuteIndented_Rec(isKey, i);

                    continue;
                }
                else
                {
                    keepTrackOfUids.push(i);
                    await ExecuteIndented_Rec(isKey, i);
                }
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

        function assertUniqueKey_while(uid, indent, resultKey)
        {
            // the order in which the components are rendered within the block
            const keyAnyComponetInOrder = results['has any components'].incrementIf(UTILS.includesAtlest(['has components', 'has components aliases'], resultKey, null));
            const keyInComponentOrder = results['has components'].incrementIf(resultKey === 'has components');
            const keyInAliasComponentOrder = results['has components aliases'].incrementIf(resultKey === 'has components aliases');
            const keyIsAlias = results['is alias'].incrementIf(resultKey === 'is alias');
            const keyIsComponent = results['is component'].incrementIf(resultKey === 'is component');
            const keyIsBlockRef = results['is block referece'].incrementIf(resultKey === 'is block referece');

            const baseKey = [indent, uid, keyAnyComponetInOrder, keyInComponentOrder, keyInAliasComponentOrder, resultKey, keyIsAlias, keyIsComponent];

            let similarCount = 0; // keep track of similarities
            const preKey = () => [similarCount, ...baseKey].join(' ') + 'ﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠ';
            let uniqueKey = preKey();


            while (componentsInOrderMap.has(uniqueKey))
            {
                debugger;
                similarCount += 1; // try to make it unique
                uniqueKey = preKey();
            }
            similarCount = 0;

            return { uniqueKey, original: preKey(), indent, resultKey };
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