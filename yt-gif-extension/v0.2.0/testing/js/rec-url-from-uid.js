await InputBlockVideoParams('A2ZKodXwg');
await InputBlockVideoParams('jmFbeY934');
await InputBlockVideoParams('Xq0KBPFrW');

async function InputBlockVideoParams(tempUID)
{
    let indentFunc = 0;
    const endObj = await TryToFindURL_Rec(tempUID)
    console.log('\n'.repeat(6)); // debugging

    async function TryToFindURL_Rec(uid, parentObj)
    {
        const objRes = await TryToFindURL(uid);

        let tone = 'black'
        if (parentObj?.innerAliasesUids?.includes(uid) && (!!objRes.urls?.[0])) // yt gif alias
            tone = 'purple'
        else if (objRes?.innerAliasesUids.length > 0) // has aliases
            tone = 'blue'
        else if (objRes.components.length > 0) // yt gif component
            tone = 'green'

        console.log("%c" + cleanIndentedBlock(), `color:${tone}`);


        if (objRes.innerUIDs?.length > 0)
        {
            indentFunc += 1;
            for (const i of objRes.innerUIDs)
            {
                const { objRes: objResIn, parentObj } = await TryToFindURL_Rec(i, objRes);
            }
            indentFunc -= 1;
        }

        return { uid, objRes, parentObj };

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