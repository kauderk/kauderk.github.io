targetClass = 'bp3-text-overflow-ellipsis';

const targetNode = document.querySelector('body');
const config = { childList: true, subtree: true };
const observer = new MutationObserver(mutation_callback);
observer.observe(targetNode, config);

function mutation_callback(mutationsList, observer)
{
    const found = [];
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
        console.log(node);
    }
};