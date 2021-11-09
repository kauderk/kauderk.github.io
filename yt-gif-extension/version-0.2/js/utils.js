var kauderk = window.kauderk || {};

kauderk.util = ((util) =>
{
    util.span = (classList = []) =>
    {
        const span = document.createElement('span');
        span.classList.add(...classList);
        return span;
    }
    util.getUniqueSelector = (elSrc) =>
    {
        // https://stackoverflow.com/questions/3620116/get-css-path-from-dom-element#:~:text=Doing%20a%20reverse%20CSS%20selector%20lookup%20is%20an%20inherently%20tricky%20thing.%20I%27ve%20generally%20come%20across%20two%20types%20of%20solutions%3A
        if (!(elSrc instanceof Element)) return;
        var sSel,
            aAttr = ['name', 'value', 'title', 'placeholder', 'data-*'], // Common attributes
            aSel = [],
            // Derive selector from element
            getSelector = function (el)
            {
                // 1. Check ID first
                // NOTE: ID must be unique amongst all IDs in an HTML5 document.
                // https://www.w3.org/TR/html5/dom.html#the-id-attribute
                if (el.id)
                {
                    aSel.unshift('#' + el.id);
                    return true;
                }
                aSel.unshift(sSel = el.nodeName.toLowerCase());
                // 2. Try to select by classes
                if (el.className)
                {
                    aSel[0] = sSel += '.' + el.className.trim().replace(/ +/g, '.');
                    if (uniqueQuery()) return true;
                }
                // 3. Try to select by classes + attributes
                for (var i = 0; i < aAttr.length; ++i)
                {
                    if (aAttr[i] === 'data-*')
                    {
                        // Build array of data attributes
                        var aDataAttr = [].filter.call(el.attributes, function (attr)
                        {
                            return attr.name.indexOf('data-') === 0;
                        });
                        for (var j = 0; j < aDataAttr.length; ++j)
                        {
                            aSel[0] = sSel += '[' + aDataAttr[j].name + '="' + aDataAttr[j].value + '"]';
                            if (uniqueQuery()) return true;
                        }
                    } else if (el[aAttr[i]])
                    {
                        aSel[0] = sSel += '[' + aAttr[i] + '="' + el[aAttr[i]] + '"]';
                        if (uniqueQuery()) return true;
                    }
                }
                // 4. Try to select by nth-of-type() as a fallback for generic elements
                var elChild = el,
                    sChild,
                    n = 1;
                while (elChild = elChild.previousElementSibling)
                {
                    if (elChild.nodeName === el.nodeName) ++n;
                }
                aSel[0] = sSel += ':nth-of-type(' + n + ')';
                if (uniqueQuery()) return true;
                // 5. Try to select by nth-child() as a last resort
                elChild = el;
                n = 1;
                while (elChild = elChild.previousElementSibling) ++n;
                aSel[0] = sSel = sSel.replace(/:nth-of-type\(\d+\)/, n > 1 ? ':nth-child(' + n + ')' : ':first-child');
                if (uniqueQuery()) return true;
                return false;
            },
            // Test query to see if it returns one element
            uniqueQuery = function ()
            {
                return document.querySelectorAll(aSel.join('>') || null).length === 1;
            };
        // Walk up the DOM tree to compile a unique selector
        while (elSrc.parentNode)
        {
            if (getSelector(elSrc)) return aSel.join(' > ');
            elSrc = elSrc.parentNode;
        }
    }
    util.innerElsContains = (selector, text) =>
    {
        // https://stackoverflow.com/questions/37098405/javascript-queryselector-find-div-by-innertext#:~:text=return%20Array.prototype.filter.call(elements%2C%20function(element)%7B
        var elements = document.querySelectorAll(selector);
        return Array.prototype.filter.call(elements, function (element)
        {
            return RegExp(text).test(element.textContent);
        });
    }
    /**
     * Returns copy of itself with subOjects that directly include the filterKey
     * @param {String} subKeyAsFilter 
     * @returns {Object} Filtered sub properties
     */
    util.FilterSubObjByKey = (subKeyAsFilter, refObj) =>
    {
        return Object.keys(refObj)
            .filter(key => refObj[key].hasOwnProperty(subKeyAsFilter))
            .reduce((accObj, key) =>
            {
                accObj[key] = refObj[key];
                return accObj;
            }, {});
    }

    util.pushSame = (arr = [], el) =>
    {
        arr.push(el);
        return arr;
    }
    util.pushSpreadSame = (arr = [], el) =>
    {
        arr.push([...el]); /// THIS IS CRAZY!!!!!!! //accObjPath: pushSpreadSame(accObj.accObjPath, [property, nestedPpt]),
        return arr;
    }
    util.Rec_IsValidNestedKey = (obj, level, ...rest) =>// 🐌
    {
        if (obj === undefined) 
        {
            return false
        }
        if (rest.length == 0 && obj.hasOwnProperty(level))
        {
            return true
        }
        return Rec_IsValidNestedKey(obj[level], ...rest)
    }
    /* ----------------------------------------------- */
    util.RemoveElsEventListeners = (withEventListeners) =>
    {
        for (const el of withEventListeners)
        {
            el.replaceWith(el.cloneNode(true));
        }
    }
    util.RemoveAllChildren = (node) =>
    {//https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript#:~:text=var%20cNode%20%3D%20node.cloneNode(false)%3B
        const cNode = node.cloneNode(false);
        node.parentNode.replaceChild(cNode, node);
        return node;
    }

    util.print = (str = 'hi') =>
    {
        console.log(str);
    }

    // linearly maps value from the range (a..b) to (c..d)
    util.mapRange = (value, a, b, c, d) =>
    {
        // first map value from (a..b) to (0..1)
        value = (value - a) / (b - a);
        // then map it from (0..1) to (c..d) and return it
        return c + value * (d - c);
    }

    util.linkClickPreviousElement = (el) =>
    {
        el.previousElementSibling.setAttribute('for', el.id); // link clicks
    }

    util.applyIMGbg = (wrapper, url) =>
    {
        wrapper.style.backgroundImage = `url(${util.get_youtube_thumbnail(url)})`;
    }
    util.removeIMGbg = (wrapper) =>
    {
        wrapper.style.backgroundImage = 'none';
    }


    util.NoCash = (url) =>
    {
        return url + "?" + new Date().getTime()
    }


    util.inViewportEls = (els) =>
    {
        let matches = [],
            elCt = els.length;

        for (let i = 0; i < elCt; ++i)
        {
            let el = els[i],
                b = el.getBoundingClientRect(),
                c;

            if (b.width > 0 && b.height > 0 &&
                b.left + b.width > 0 && b.right - b.width < window.outerWidth &&
                b.top + b.height > 0 && b.bottom - b.width < window.outerHeight &&
                (c = window.getComputedStyle(el)) &&
                c.getPropertyValue('visibility') === 'visible' &&
                c.getPropertyValue('opacity') !== 'none')
            {
                matches.push(el);
            }
        }
        return matches;
    }
    util.inViewportElsHard = (els) =>
    {
        let matches = [];

        for (const el of els)
        {
            if (util.isElementVisible(el))
            {
                matches.push(el);
            }
        }
        return matches;
    }
    util.isElementVisible = (elem) =>
    {
        // https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom#:~:text=function%20isElementVisible(elem)%20%7B%0A%20%20%20%20if%20(!(elem%20instanceof%20Element))%20throw%20Error(%27DomUtil%3A%20elem%20is%20not%20an%20element.%27)%3B%0A%20%20%20%20const%20style%20%3D%20getComputedStyle(elem)%3B
        if (!(elem instanceof Element)) throw Error('DomUtil: elem is not an element.');
        const style = getComputedStyle(elem);
        if (style.display === 'none') return false;
        if (style.visibility !== 'visible') return false;
        if (style.opacity === 0) return false;
        if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
            elem.getBoundingClientRect().width === 0)
        {
            return false;
        }
        var elementPoints = {
            'center': {
                x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
                y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
            },
            'top-left': {
                x: elem.getBoundingClientRect().left,
                y: elem.getBoundingClientRect().top
            },
            'top-right': {
                x: elem.getBoundingClientRect().right,
                y: elem.getBoundingClientRect().top
            },
            'bottom-left': {
                x: elem.getBoundingClientRect().left,
                y: elem.getBoundingClientRect().bottom
            },
            'bottom-right': {
                x: elem.getBoundingClientRect().right,
                y: elem.getBoundingClientRect().bottom
            }
        }

        for (index in elementPoints)
        {
            var point = elementPoints[index];
            if (point.x < 0) return false;
            if (point.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
            if (point.y < 0) return false;
            if (point.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
            let pointContainer = document.elementFromPoint(point.x, point.y);
            if (pointContainer !== null)
            {
                do
                {
                    if (pointContainer === elem) return true;
                } while (pointContainer = pointContainer.parentNode);
            }
        }
        return false;
    }





    util.emptyEl = (classList, el) =>
    {
        if (classList)
            el.classList.add(classList);
        return el;
    }
    util.toggleClasses = (bol, classNames, el) =>
    {
        if (bol)
        {
            el.classList.add(...classNames);
        }
        else
        {
            el.classList.remove(...classNames);
        }
    }


    util.exitFullscreen = () =>
    {
        if (document.exitFullscreen)
        {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen)
        {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen();
        }
    }
    util.closestBlockID = (el) =>
    {
        return el?.closest('.rm-block__input')?.id
    }
    util.allIframeIDprfx = () =>
    {
        return document.querySelectorAll(`[id*=${iframeIDprfx}]`);
    }
    util.allIframeStyle = (style) =>
    {
        return document.querySelectorAll(`[${style}]`);
    }



    util.isTrue = (value) =>
    {
        if (typeof (value) === 'string')
            value = value.trim().toLowerCase();

        switch (value)
        {
            case true:
            case 'true':
            case 1:
            case '1':
            case 'on':
            case 'yes':
                return true;
            default:
                return false;
        }
    }
    util.isValidUrl = (value) =>
    {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
    }
    util.isValidFetch = async (url) =>
    {
        try
        {
            const response = await fetch(url, { cache: "no-store" });
            if (!response.ok)
                throw new Error('Request failed.');
            return [response, null];
        }
        catch (error)
        {
            console.log(`Your custom link ${url} is corrupt. ;c`);
            return [null, error];
        };
    }
    util.FetchText = async (url) =>
    {
        const [response, err] = await util.isValidFetch(util.NoCash(url)); // firt time fetching something... This is cool
        if (response)
            return await response.text();
    }
    util.get_youtube_thumbnail = (url, quality) =>
    {
        //https://stackoverflow.com/questions/18681788/how-to-get-a-youtube-thumbnail-from-a-youtube-iframe
        if (url)
        {
            var video_id, thumbnail, result;
            if (result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/))
            {
                video_id = result.pop();
            }
            else if (result = url.match(/youtu.be\/(.{11})/))
            {
                video_id = result.pop();
            }

            if (video_id)
            {
                if (typeof quality == "undefined")
                {
                    quality = 'high';
                }

                var quality_key = 'maxresdefault'; // Max quality
                if (quality == 'low')
                {
                    quality_key = 'sddefault';
                } else if (quality == 'medium')
                {
                    quality_key = 'mqdefault';
                } else if (quality == 'high')
                {
                    quality_key = 'hqdefault';
                }

                var thumbnail = "https://img.youtube.com/vi/" + video_id + "/" + quality_key + ".jpg";
                return thumbnail;
            }
        }
        return false;
    }


    util.isValidCSSUnit = (value) =>
    {
        //  valid CSS unit types
        const CssUnitTypes = ['em', 'ex', 'ch', 'rem', 'vw', 'vh', 'vmin',
            'vmax', '%', 'cm', 'mm', 'in', 'px', 'pt', 'pc'];

        // create a set of regexps that will validate the CSS unit value
        const regexps = CssUnitTypes.map((unit) =>
        {
            // creates a regexp that matches '#unit' or '#.#unit' for every unit type
            return new RegExp(`^[0-9]+${unit}$|^[0-9]+\\.[0-9]+${unit}$`, 'i');
        });

        // attempt to find a regexp that tests true for the CSS value
        const isValid = regexps.find((regexp) => regexp.test(value)) !== undefined;

        return isValid;
    }

    util.ChangeElementType = (element, newtype) =>
    {
        let newelement = document.createElement(newtype);

        // move children
        while (element.firstChild) newelement.appendChild(element.firstChild);

        // copy attributes
        for (var i = 0, a = element.attributes, l = a.length; i < l; i++)
        {
            newelement.attributes[a[i].name] = a[i].value;
        }

        // event handlers on children will be kept. Unfortunately, there is
        // no easy way to transfer event handlers on the element itself,
        // this would require a full management system for events, which is
        // beyond the scope of this answer. If you figure it out, do it here.

        element.parentNode.replaceChild(newelement, element);
        return newelement;
    }



    return util;
})(kauderk.util || {});