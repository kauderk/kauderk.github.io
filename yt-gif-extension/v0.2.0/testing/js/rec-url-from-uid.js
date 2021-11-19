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

    printUrlsMap(accValFor);
    printUrlsMap(accValFunc);

    // print urls accValFor
    function printUrlsMap(obj)
    {
        for (let [key, value] of obj.entries())
        {
            printUrls(value);
        }
    }

    console.log(accStr);

    function printUrls(obj)
    {
        for (const url of obj.urls)
        {
            console.log(`${'\t'.repeat(obj.indent)}${obj.uid} : ${url} : ${obj.urls.indexOf(url)}`);
        }
    }

    async function TryToFindURL_Rec(uid, parentObj, accStr = '')
    {
        const objRes = await TryToFindURL(uid);

        if (objRes.innerUIDs?.length > 0)
        {
            indentFunc += 1;
            for (const i of objRes.innerUIDs.reverse())
            {
                const { objRes: innerObjRes, parentObj, accStr: innerAccStr } = await TryToFindURL_Rec(i, objRes, accStr);

                const isAlias = parentObj.innerAliasesUids?.includes(i);
                const ytGifAlias = isAlias && (!!innerObjRes.urls?.[0]);
                const debuggingLog = `
                    parent: <${uid}>
                    self: ${i}
                    inners: ${innerObjRes.innerUIDs?.join(' ') || 'Fuids'}
                    alias?: ${isAlias}
                    yt-gif-alias?: ${isAlias && (!!innerObjRes.urls?.[0])}
                    ${Number(++innerFor)} ->                    `;

                accStr = printPasses(innerAccStr, indentFunc, debuggingLog + innerObjRes.rawText);

                innerObjRes.indent = indentFunc;
                accValFor.set(`${debuggingLog} ${innerObjRes.rawText}`, innerObjRes);

                const obj = innerObjRes;
                console.log(`${'\t'.repeat(obj.indent)}${obj.uid}`);
                printUrls(obj);
            }
            indentFunc -= 1;
        }
        else
        {
            if (!parentObj)
            {
                const debuggingLog = `
                    self: <${uid}>
                    inners: ${objRes.innerUIDs?.join(' ') || 'Fuids'}
                    ${Number(++funcCnt)} ->                     `;
                accStr = printPasses(accStr, indentFunc, debuggingLog + objRes.rawText);

                objRes.indent = indentFunc;
                accValFunc.set(`${debuggingLog} ${objRes.rawText}`, objRes);

                const obj = objRes;
                console.log(`${'\t'.repeat(obj.indent)}${obj.uid}`);
                printUrls(obj);
            }
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