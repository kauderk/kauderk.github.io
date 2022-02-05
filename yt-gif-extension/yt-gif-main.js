/*
    https://github.com/kauderk/kauderk.github.io/tree/main/yt-gif-extension/v0.1.1
    Bypass to the latest version v0.2.0
    v0.2.0 depends on the yt-gif-settings-page script, BIG BOI in it of itself, that a -conscious user update- feels the more appropiate.

    Major features are restricted: Persistent settings, yt player iterface language customization and iframe buffers.

    The yt-gif-app.js script is borrowing resources form v0.2.0
*/
(async function ()
{
    await LoadExternalResources();
    await createXload('https://kauderk.github.io/yt-gif-extension/v0.1.1/js/yt-gif-app.js');
})();

async function LoadExternalResources()
{
    if (
        typeof kauderk !== 'undefined' &&
        typeof kauderk.util !== 'undefined' &&
        typeof (kauderk.rap) != 'undefined' &&
        typeof (YT) != 'undefined'
    )
    {
        return null;
    }
    else
    {
        await loadYT_IFRAME_API();

        await createXload('https://kauderk.github.io/yt-gif-extension/resources/js/utils.js');
        await createXload('https://kauderk.github.io/yt-gif-extension/resources/js/utils-roam-alpha-api.js');

        return null;
    }
    function loadYT_IFRAME_API()
    {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/player_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
        return new Promise((resolve, reject) => { script.onload = () => resolve(script) })
    }
}
async function createXload(src)
{
    const obj = {
        src,
        id: `script-yt_gif-${src}`,
    }

    romoveIfany(obj.id);
    const script = createScript(obj);
    return await loadScript(script);

    function romoveIfany(id)
    {
        const scriptAlready = document.querySelectorAll(`[id='${id}']`);
        if (scriptAlready) // well well well - we don't like duplicates - lol
        {
            for (const el of scriptAlready)
            {
                el.parentElement.removeChild(el);
            }
        }
    }
    function createScript({ src, id })
    {
        const script = document.createElement("script");
        script.src = src + "?" + new Date().getTime();
        script.id = id;
        script.async = false;
        script.type = "text/javascript";
        document.getElementsByTagName('head')[0].appendChild(script);
        return script;
    }
    async function loadScript(script)
    {
        return new Promise((resolve, reject) =>
        {
            //Script finished loading
            script.addEventListener('load', () => resolve(script))
        })
    }
}