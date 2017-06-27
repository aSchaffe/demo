/**
 * Created by Axel Schaffrath on 02.06.2017.
 */
var Tooltip = (function (window, document, undefined) {
    // set private variable
    var _selector = 'tooltip',
        _thisTooltip,
        _targetText,
        _targetSelector,
        _target,
        _targetParent;

    // set init default css
    var _defaults = {
        left: 'auto',
        top: 'auto',
        opacity: 0,
        zIndex: 9999,
        position: 'absolute',
        display: 'block'
    };

    // get x and y position off elements
    function getPosition(elem) {
        var x = 0,
            y = 0;

        while (elem != null && (elem.tagName || '').toLowerCase() != 'html') {
            x += elem.offsetLeft || 0;
            y += elem.offsetTop || 0;
            elem = elem.offsetParent;
        }

        return {x: parseInt(x, 10), y: parseInt(y, 10)};
    }

    // set fade out tooltip box
    function fadeOut(elem) {
        if (typeof elem !== 'undefined') {
            var op = 1;
            var timer = setInterval(function () {
                if (op <= 0) {
                    clearInterval(timer);
                    elem.remove();
                } else {
                    elem.style.opacity = op;
                    elem.style.filter = 'alpha(opacity=' + op * 100 + ")";
                    op -= 0.1;
                }
            }, 30);
        }
    }

    // set fade in tooltip box
    function fadeIn(elem) {
        setTimeout(function () {
            var op = 0;
            var timer = setInterval(function () {
                if (op >= 1) {
                    clearInterval(timer);
                } else {
                    elem.style.opacity = op;
                    elem.style.filter = 'alpha(opacity=' + op * 100 + ")";
                    op += 0.1;
                }
            }, 10);
        }, 200);
    }

    // build and fade in tooltip box
    var _tooltip = function (selector) {
        if (typeof _thisTooltip !== 'undefined') {
            _thisTooltip.remove();
        }
        var arrow = document.createElement('span'),
            tooltip = document.createElement('div'),
            text = document.createTextNode(_targetSelector);

        tooltip.appendChild(text);
        tooltip.appendChild(arrow);
        arrow.className = 'arrow';
        tooltip.setAttribute('id', selector);
        _targetParent.appendChild(tooltip);
        tooltip.style.opacity = _defaults.opacity;
        tooltip.style.zIndex = _defaults.zIndex;
        tooltip.style.display = _defaults.display;
        tooltip.style.position = _defaults.position;

        fadeIn(tooltip);
    };

    // finish tooltip box get, calculate and set x and y position
    var _tooltipShow = function (event) {
        event = event || window.event;
        _target = event.target;
        _targetSelector = _target.getAttribute('data-tooltip');
        _targetParent = _target.parentElement.parentElement;
        _targetText = _target.getAttribute('title');
        _targetText ? _target.removeAttribute('title') : '';
        _tooltip(_selector);
        _thisTooltip = document.getElementById(_selector);

        // calculate left and top position
        if (typeof _thisTooltip !== 'undefined') {
            var tooltipWidth = Math.round(_thisTooltip.clientWidth);
            var targetWidth = Math.round(_target.clientWidth);
            var halfWidth = (tooltipWidth - targetWidth) / 2;
            var tooltipWrap = document.getElementById('tooltip-container');
            var wrapWidht = Math.round(tooltipWrap.clientWidth);

            // right position
            // get and calculate target and tooltip element position if tooltip element position > wrapper width
            if (((getPosition(_target).x + tooltipWidth) - getPosition(tooltipWrap).x) > tooltipWrap.clientWidth) {
                x = Math.round((getPosition(tooltipWrap).x + wrapWidht) - tooltipWidth);
            } else {
                // get target and tooltip element width for left position inside wrapper
                x = getPosition(_target).x - halfWidth;
            }

            // get and calculate top of target and tooltip position
            y = getPosition(_target).y - (_thisTooltip.clientHeight);

            if (x <= getPosition(tooltipWrap).x) {
                // left position
                // get and calculate target and tooltip element position if tooltip element position < wrapper porsition
                x = Math.round(getPosition(tooltipWrap).x + 1);
            }

            // set calculated left and top position
            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';

            // get, calculate and set position of arrow element
            var arrowPos = document.getElementsByClassName('arrow')[0];
            arrowPos.style.left = Math.round((getPosition(_target).x - getPosition(_thisTooltip).x) + (targetWidth / 2)) + 'px';
        }
    };

    // after mouseout event set title back with target content - hide and delete tooltip div
    var _tooltipHide = function (event) {
        event = event || window.event;
        event.target.setAttribute('title', _targetText);
        fadeOut(_thisTooltip);
    };

    return {
        // initial tooltop box after mouse event
        init: function (selector) {
            var anchor = document.querySelectorAll(selector);
            for (var i = 0; i < anchor.length; i++) {
                anchor[i].addEventListener('focus', _tooltipShow, false);
                anchor[i].addEventListener('mouseover', _tooltipShow, false);
                anchor[i].addEventListener('blur', _tooltipHide, false);
                anchor[i].addEventListener('mouseout', _tooltipHide, false);
            }
        }
    };
}(window, document));



