await getUrlMap('0qV8_pWLL');

async function getUrlMap(tempUID)
{
    let indentFunc = 0;
    let componentsInOrderMap = new Map();
    let keepTrackOfUids = [];
    let keepTrackOfUidsMap = new Map();

    const orderObj = {
        order: -1,
        incrementIf: function (condition) { return condition ? Number(++this.order) : 'ﾠ' }
    };
    const results = { /* the order does matter */
        'component alias': {
            tone: 'purple',
        },
        'component': {
            tone: 'green',
        },
        'has any aliases': {
            tone: 'blue'
        },
        'any': {
            condition: () => true,
            tone: 'black',
        },
        'any component': {},
    }


    // filter result keys that include 'component' word and assign them an orderObj
    Object.keys(results).filter(key => key.includes('component'))
        .forEach(key => Object.assign(results[key], orderObj));


    const FirstObj = await TryToFindURL_Rec(tempUID);

    return componentsInOrderMap;


    async function TryToFindURL_Rec(uid, parentObj)
    {
        const objRes = await TryToFindURL(uid);

        results['component alias'].condition = () => parentObj?.innerAliasesUids?.includes(uid) && (!!objRes.urls?.[0]);
        results['has any aliases'].condition = () => objRes?.innerAliasesUids.length > 0;
        results['component'].condition = () => objRes.components.length > 0;
        const key = Object.keys(results).find(x => results[x].condition());


        console.log("%c" + cleanIndentedBlock(), `color:${results[key].tone}`);


        for (const i of objRes.urlsWithUids)
        {
            if (objRes.urls.includes(i))
            {
                componentsInOrderMap.set(assertUniqueKey_while(uid, indentFunc, key).uniqueKey, i);
            }

            if (objRes.innerUIDs.includes(i))
            {
                if (keepTrackOfUids.includes(i) || i == tempUID)
                {
                    keepTrackOfUids.push(i);
                    continue;
                }
                else
                {
                    indentFunc += 1;
                    keepTrackOfUids.push(i);
                    const awaitingObj = await TryToFindURL_Rec(i, objRes);
                    indentFunc -= 1;
                }
            }
        }

        return { uid, objRes, parentObj };

        function assertUniqueKey_while(uid, indent, resultKey)
        {
            // the order in which the components are rendered within the block
            const keyAnyComponetInOrder = results['any component'].incrementIf(UTILS.includesAtlest(['component', 'component alias'], resultKey, null));
            const keyInComponentOrder = results['component'].incrementIf(resultKey === 'component');
            const keyInAliasComponentOrder = results['component alias'].incrementIf(resultKey === 'component alias');

            const baseKey = [indent, uid, keyAnyComponetInOrder, keyInComponentOrder, keyInAliasComponentOrder, resultKey];

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