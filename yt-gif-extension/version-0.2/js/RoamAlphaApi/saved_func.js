function assignChildrenOrder()
{
    for (const parentKey in window.UISettings)
    {
        let childrenOrderCounter = -1;
        for (const childKey in window.UISettings[parentKey])
        {
            for (const subKey in window.UISettings[parentKey][childKey])
            {
                if (subKey != 'order')
                {
                    break;
                }

                const subOrder = window.UISettings[parentKey][childKey][subKey];
                if (!subOrder)
                {
                    debugger;
                    //window.UISettings[parentKey][childKey].order = Number(++childrenOrderCounter);
                }
            }
        }
    }
}