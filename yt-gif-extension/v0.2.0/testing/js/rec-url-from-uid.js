async function InputBlockVideoParams(tempUID)
{
    let accValFor = new Map();
    let accValFunc = new Map();
    let funcCnt = 0;
    let innerFor = 0;
    let indentFunc = 0;
    //debugger;
    const { objRes, parentObj, accStr } = await TryToFindURL_Rec(tempUID)

    console.log(accValFor.entries(), accValFunc.entries());

    console.log(accStr);

    async function TryToFindURL_Rec(uid, parentObj, accStr = '')
    {
        const objRes = await TryToFindURL(uid);
        const debuggingLog = `self: <${uid}> | inners: ${objRes.innerUIDs?.join(' ') || 'Fuids'} | ${Number(++funcCnt)} -> `;

        accValFunc.set(`${debuggingLog} ${objRes.rawText}`, objRes);

        objRes.innerAliasesUids = [...objRes.aliasesPlusUids].map(x => x = x[2]);


        if (objRes.innerUIDs?.length > 0)
        {
            indentFunc += 1;
            for (const i of objRes.innerUIDs.reverse())
            {
                const { objRes: innerObjRes, parentObj, accStr: innerAccStr } = await TryToFindURL_Rec(i, objRes, accStr);

                const isAlias = parentObj.innerAliasesUids.includes(i);
                const debuggingLog = `parent: <${uid}> | self: ${i} | inners: ${innerObjRes.innerUIDs?.join(' ') || 'Fuids'} | alias?: ${isAlias} | yt-gif-alias?: ${isAlias && (!!innerObjRes.urls?.[0])} | ${Number(++innerFor)} -> `;

                accStr = printPasses(innerAccStr, indentFunc, debuggingLog + innerObjRes.rawText);

                accValFor.set(`${debuggingLog} ${innerObjRes.rawText}`, innerObjRes);
            }
            indentFunc -= 1;
        }
        else
        {
            if (!parentObj)
                accStr = printPasses(accStr, indentFunc, debuggingLog + objRes.rawText);
        }

        return { uid, objRes, parentObj, accStr };

        function printPasses(accStr, indent, rawText)
        {
            accStr = accStr || 'EMPTY!';

            const tab = '\t'.repeat(indent);

            accStr = accStr + '\n'.repeat(6) + tab + rawText;
            return accStr;
        }
    }


    async function TryToFindURL(desiredUID)
    {
        const info = await kauderk.rap.getBlockInfoByUID(desiredUID);
        if (!info[0]) debugger;
        const rawText = info[0][0]?.string || "F";
        if (rawText == "F") debugger;

        // {{[[component]]: xxxyoutube-urlxxx }}
        const components = [...rawText.matchAll(/{{(\[\[)?((yt-gif|video))(\]\])?.*?(\}\}|\{\{)/gm)].map(x => x = x[0]) || [];
        // (((xxxuidxxx))) || ((xxxuidxxx))
        const innerUIDs = rawText.match(/(?<=\(\()([^(].*?[^)])(?=\)\))/gm);
        // [xxxanything goesxxx](((xxxuidxxx)))
        const aliasesPlusUids = [...rawText.matchAll(/\[(.*?(?=\]))]\(\(\((.*?(?=\)))\)\)\)/gm)];

        let urls = [];
        for (const i of components)
        {
            // xxxyoutube-urlxxx
            urls = kauderk.util.pushSame(urls, i.match(/(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(.*?(?=\s))/)?.[0]);
        }

        return { components, urls, innerUIDs, aliasesPlusUids, rawText, info };
    };
}