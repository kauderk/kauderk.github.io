async function readAndStoreSettings(text, targetUID)
{
    async function brachRemovalRootorSubObj()
    {
        const rgxBase = /\(([^\)]+)\)( : )(\b\w+\b)| |:|(\b.*\b)/gm;
        const { pass, str } = sameStr();
        const firstKey = rgxBase.exec(str);
        rgxBase.lastIndex = 0;


        if (pass) // is first level
        {
            console.log("go" + children.string);
            return await RemoveIfInvalidSetting(firstKey[3], [], firstKey[1]);
        }
        else // nested obj and key hirarchy needed to validate it
        {
            const subkey = rgxBase.exec(child.string);
            rgxBase.lastIndex = 0;
            return await RemoveIfInvalidSetting(firstKey[3], [subkey[3]], subkey[1]);
        }

        function sameStr()
        {
            let pass = false;
            let str = '';
            for (const j of firstLevel.children)
            {
                if (child.string == j.string)
                {
                    str = j.string;
                    pass = true;
                    debugger;
                }
            }
            return {
                pass,
                str
            };
        }



    }

    async function RemoveIfInvalidSetting(level, keyCombo = [], incomingUID)
    {
        let removed = false;
        let list = [];

        if (!isValidNestedKey(UISettings, level, ...keyCombo) && incomingUID)
        {
            //await ccc.util.deleteBlock(uid);
            list.push(keyCombo);
            removed = true;
            debugger;

            console.log(`${level} ${keyCombo.toString()} removed`);
        }
        return {
            wasRemoved: removed,
            removedList: list
        };
    }

    function isValidNestedKey(obj, level, ...rest)
    {
        if (obj === undefined) return false
        if (rest.length == 0 && obj.hasOwnProperty(level)) return true
        return isValidNestedKey(obj[level], ...rest)
    }
}


/*
    for (const parentKey in UISettings)
    {
        UISettings[parentKey].string = '';
        UISettings[parentKey].uid = '';

        for (const childKey1 in UISettings[parentKey])
        {
            if (typeof childKey1 !== 'object') continue;

            for (const childKey2 in UISettings[parentKey][childKey1])
            {
                UISettings[parentKey][childKey1][childKey2].string = '';
                UISettings[parentKey][childKey1][childKey2].uid = '';
            }
        }
    }
    */