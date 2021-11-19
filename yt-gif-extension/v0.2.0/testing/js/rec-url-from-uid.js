await InputBlockVideoParams('_58aMsOfr');
await InputBlockVideoParams('A2ZKodXwg');
await InputBlockVideoParams('jmFbeY934');
await InputBlockVideoParams('Xq0KBPFrW');
await InputBlockVideoParams('5NzOtM4Rv');
await InputBlockVideoParams('_58aMsOfr');
await InputBlockVideoParams('TGfJr35iO');
await InputBlockVideoParams('m4JcmUA4t');

async function InputBlockVideoParams(tempUID, indexOfComponent)
{
    let indentFunc = 0;
    let componentsInOrderMap = new Map();

    const orderObj = {
        order: -1,
        incrementIf: function (condition) { return condition ? Number(++this.order) : 'ﾠ' }
    };
    const results = {
        'component alias': {
            tone: 'purple',
        },
        'has any aliases': {
            tone: 'blue'
        },
        'component': {
            tone: 'green',
        },
        'any': {
            condition: () => true,
            tone: 'black',
        },
        'any component': {
        },
    }

    // filter result keys that include 'component' word and assign it a orderObj
    Object.keys(results).filter(key => key.includes('component'))
        .forEach(key => Object.assign(results[key], orderObj));


    const FirstObj = await TryToFindURL_Rec(tempUID);
    console.log(componentsInOrderMap);
    console.log('\n'.repeat(6)); // debugging

    // loop through componentsInOrderMap keys
    for (let [key, value] of componentsInOrderMap.entries())
    {
        const deconstructKey = key.split(' ');
        if (deconstructKey[4] == indexOfComponent)
        {
            return value;
        }
    }




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
            if (objRes.urls.includes(i)) // either component or component alias // set in the order in which roam renders them
            {
                componentsInOrderMap.set(assertUniqueKey_while(uid), i || 'no component url');
            }

            if (objRes.innerUIDs.includes(i))
            {
                indentFunc += 1;
                const awaitingObj = await TryToFindURL_Rec(i, objRes);
                indentFunc -= 1;
            }
        }

        return { uid, objRes, parentObj };

        function assertUniqueKey_while(uid)
        {
            // the order in which the components are rendered within the block
            const keyAnyComponetInOrder = results['any component'].incrementIf(kauderk.util.includesAtlest(['component', 'component alias'], key, null));
            const keyInComponentOrder = results['component'].incrementIf(key === 'component');
            const keyInAliasComponentOrder = results['component alias'].incrementIf(key === 'component alias');

            const baseKey = [indentFunc, uid, keyAnyComponetInOrder, keyInComponentOrder, keyInAliasComponentOrder, key];

            let similarCount = 0; // keep track of similarities
            const preKey = () => [similarCount, ...baseKey].join(' ') + 'ﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠ';
            let uniqueKey = preKey();

            while (componentsInOrderMap.has(uniqueKey))
            {
                similarCount += 1; // try to make it unique
                uniqueKey = preKey();
            }

            return uniqueKey;
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
        const innerUIDs = rawText.match(/(?<=\(\()([^(].*?[^)])(?=\)\))/gm) || [];
        // [xxxanything goesxxx](((xxxuidxxx)))
        const aliasesPlusUids = [...rawText.matchAll(/\[(.*?(?=\]))]\(\(\((.*?(?=\)))\)\)\)/gm)];

        // aliases alone
        const innerAliasesUids = [...aliasesPlusUids].map(x => x = x[2]) || []; // [xxnopexxx]('((xxxyesxxx))')

        // block references alone
        const blockReferencesAlone = innerUIDs?.filter(x => !innerAliasesUids.includes(x));

        // componets with block references exlude aliases // set in the order in which roam renders them
        const urlsWithUids = [...[...rawText.matchAll(/{{(\[\[)?((yt-gif|video))(\]\])?.*?(\}\}|\{\{)|(?<=\(\()([^(].*?[^)])(?=\)\))/gm)]
            .map(x => x = x[0])]
            .map(x => components.includes(x) ? x = x.match(/(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(.*?(?=\s|\}|\]|\)))/)?.[0] : x);


        let urls = [];
        for (const i of components)
        {
            // xxxyoutube-urlxxx
            urls = kauderk.util.pushSame(urls, i.match(/(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(.*?(?=\s|\}|\]|\)))/)?.[0]);
        }

        return { uid: desiredUID, components, urls, innerUIDs, urlsWithUids, aliasesPlusUids, innerAliasesUids, blockReferencesAlone, rawText, info };
    };
}