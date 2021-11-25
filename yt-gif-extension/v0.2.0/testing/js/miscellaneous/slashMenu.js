
const addedTargetClass = 'bp3-text-overflow-ellipsis';
const emulationClass = 'slash-menu-emulation';
let cloneSubResuslt = null;


const TEMP_SLASH_MENU_OBSERVERS = {
    masterMutationObservers: [],
    CleanMasterObservers: function ()
    {
        const mutObjRes = cleanObserverArr(this.masterMutationObservers);
        this.masterMutationObservers = mutObjRes.observer;

        console.log(`${mutObjRes.counter} mutation, master observers cleaned - slash menu`);
        function cleanObserverArr(observer)
        {//https://www.codegrepper.com/code-examples/javascript/how+to+do+a+reverse+loop+in+javascript#:~:text=www.techiedelight.com-,how%20to%20reverse%20loop%20in%20javascript,-javascript%20by%20Dark
            let counter = 0;
            for (let i = observer.length - 1; i >= 0; i--)
            {
                observer[i].disconnect();
                observer.splice(i, 1);
                counter++;
            }
            return {
                observer,
                counter
            }
        }
    },
}
window.SLASH_MENU_OBSERVERS = (!window.SLASH_MENU_OBSERVERS) ? TEMP_SLASH_MENU_OBSERVERS : window.SLASH_MENU_OBSERVERS;
window.SLASH_MENU_OBSERVERS.CleanMasterObservers();

const targetNode = document.body;
const config = { childList: true, subtree: true };
const observer = new MutationObserver(mutation_callback);
observer.observe(targetNode, config);

window.SLASH_MENU_OBSERVERS.masterMutationObservers.push(observer);


function mutation_callback(mutationsList, observer)
{
    const found = [];
    const removed = [];

    for (const { addedNodes, removedNodes } of mutationsList)
    {
        for (const node of addedNodes)
        {
            if (!node.tagName) continue; // not an element

            if (node.classList.contains(addedTargetClass) && !node.classList.contains(emulationClass))
            {
                found.push(node);
            }
            else if (node.firstElementChild)
            {
                found.push(...node.getElementsByClassName(addedTargetClass));
            }
        }

        for (const node of removedNodes)
        {
            if (!node.tagName) continue; // not an element

            if (node.classList.contains(addedTargetClass) && !node.classList.contains(emulationClass))
            {
                removed.push(node);
            }
            else if (node.firstElementChild)
            {
                removed.push(...node.getElementsByClassName(addedTargetClass));
            }
        }
    }

    if (removed.length == 0 && found.length == 0) return;


    const timeNode = (node) => node.innerHTML.includes('Time');
    const YTtimeNode = (node) => node.innerHTML.includes('YT GIF');
    const validTimeNode = (node) => timeNode(node) && !YTtimeNode(node);

    const dontUnfocusBlocks = [...document.querySelectorAll('body > div.rm-autocomplete__results.bp3-elevation-3 > .dont-unfocus-block .bp3-text-overflow-ellipsis')];
    const emulations = [...document.querySelectorAll(`body > div.rm-autocomplete__results.bp3-elevation-3 > [class*="${emulationClass}"]`)];
    const LastTimeNode = dontUnfocusBlocks.reverse().find(node => validTimeNode(node));
    const AnyTimeNodeExist = dontUnfocusBlocks.filter(node => validTimeNode(node)).length != 0;


    for (const node of found)
    {
        const clone = node?.parentNode?.cloneNode(true);
        if (clone?.querySelector('.bp3-text-overflow-ellipsis')?.innerHTML &&
            clone?.querySelector('.rm-icon-key-prompt')?.innerHTML &&
            clone?.querySelector('.bp3-icon')?.className)
        {
            cloneSubResuslt = clone;
        }


        const emulations = [...document.querySelectorAll(`body > div.rm-autocomplete__results.bp3-elevation-3 > [class*="${emulationClass}"]`)];


        if (validTimeNode(node))
        {
            const parent = node.parentNode;

            if (cloneSubResuslt && emulations.length == 0)
            {
                const start = createSlashMenuEmulation_video({
                    cloneFrom: cloneSubResuslt,
                    emulationSufix: '-start',
                    prompt: 'YT GIF Timestamp - start',
                    shortutPrompt: 'Ctrl + Alt + s',
                });
                parent.parentNode.insertBefore(start, parent);


                const end = createSlashMenuEmulation_video({
                    cloneFrom: cloneSubResuslt,
                    emulationSufix: '-end',
                    prompt: 'YT GIF Timestamp - end',
                    shortutPrompt: 'Ctrl + Alt + d',
                });
                parent.parentNode.insertBefore(end, parent);
            }

            if (LastTimeNode)
            {
                const parent = LastTimeNode.parentNode;
                emulations.forEach(el => parent.parentNode.insertBefore(el, parent));
            }
        }
    }

    for (const node of removed)
    {
        if (timeNode(node) && !AnyTimeNodeExist)
        {
            emulations.forEach(x => x.remove());
            return;
        }
    }


    function createSlashMenuEmulation_video({ cloneFrom, emulationSufix, prompt, shortutPrompt, iconSufix })
    {
        iconSufix = iconSufix || 'video';
        const el = cloneFrom.cloneNode(true);

        el.classList.add(emulationClass + emulationSufix);
        el.querySelector('.bp3-text-overflow-ellipsis').innerHTML = prompt;
        el.querySelector('.rm-icon-key-prompt').innerHTML = shortutPrompt;
        el.querySelector('.bp3-icon').className = `bp3-icon bp3-icon-${iconSufix}`;
        return el;
    }
};