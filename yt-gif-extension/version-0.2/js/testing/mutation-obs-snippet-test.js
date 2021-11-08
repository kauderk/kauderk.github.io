
const test_targetNode = document.querySelector('body');
const test_config = { childList: true, subtree: true };
const test_observer = new MutationObserver(test_mutation_callback);
debugger;
function test_mutation_callback(mutationsList, observer)
{
    const targetClass = 'rm-xparser-default-yt-gif';
    const found = [];
    debugger;
    for (const { addedNodes } of mutationsList)
    {
        for (const node of addedNodes)
        {
            if (!node.tagName) continue; // not an element

            if (node.classList.contains(targetClass))
            {
                found.push(node);
            }
            else if (node.firstElementChild)
            {
                // javascript is crazy and i don't get how or what this is doing... man...
                found.push(...node.getElementsByClassName(targetClass));
            }
        }
    }
    for (const node of found)
    {
        if (isNotZoomPath(node))
        {
            debugger;
            //window.YT_GIF_OBSERVERS.masterIntersectionObservers.push(ObserveIntersectToSetUpPlayer(node, 'valid entries MutationObserver'));
        }
    }
};
debugger;
window.YT_GIF_OBSERVERS.masterMutationObservers.push(test_observer);