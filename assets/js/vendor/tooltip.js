/**
 * Created by Axel Schaffrath on 02.06.2017.
 */
var Tooltip = (function ( window , document , undefined ) {
    //set private variable
    var _selector = 'tooltip' ,
        _thisTooltip ,
        _targetText ,
        _targetData ,
        _target;

    var _defaults = {
        left: 'auto' ,
        top: 'auto' ,
        opacity: 0 ,
        zIndex: 9999 ,
        position: 'absolute' ,
        display: 'block'
    };

    //read and clear title anchor
    var _init = function ( selector ) {
        var anchor = document.querySelectorAll(selector);
        for ( var i = 0 ; i < anchor.length ; i++ ) {
            anchor[i].addEventListener('focus' , _tooltipShow , false);
            anchor[i].addEventListener('mouseover' , _tooltipShow , false);
            anchor[i].addEventListener('blur' , _tooltipHide , false);
            anchor[i].addEventListener('mouseout' , _tooltipHide , false);
        }
    };

    function getPosition( elem ) {
        var x = 0 ,
            y = 0;

        while ( elem != null && (elem.tagName || '').toLowerCase() != 'html' ) {
            x += elem.offsetLeft || 0;
            y += elem.offsetTop || 0;
            elem = elem.offsetParent;
        }

        return { x: x , y: y };
    }

    // fade out
    function fadeOut( elem ) {
        if ( _thisTooltip ) {
            var op    = 1;  // initial opacity
            var timer = setInterval(function () {
                if ( op <= 0 ) {
                    clearInterval(timer);
                    elem.style.display = 'none';
                    elem.remove();
                    op = 0;
                } else {
                    elem.style.opacity = op;
                    elem.style.filter  = 'alpha(opacity=' + op * 100 + ")";
                    op -= 0.01;
                }
            });
        }
    }

    // fade in
    function fadeIn( elem ) {
        var op    = 0;  // initial opacity
        var timer = setInterval(function () {
            if ( op >= 1 ) {
                clearInterval(timer);
                op = 1;
            } else {
                elem.style.opacity = op;
                elem.style.filter  = 'alpha(opacity=' + op * 100 + ")";
                op += 0.01;
            }
        });
    }

    //create new tooltip tooltip if it is not avalible
    var _tooltiptooltip = function ( selector ) {
        if ( _thisTooltip ) {
            _thisTooltip.remove();
        }
        if ( !document.getElementById(selector) ) {
            var arrow   = document.createElement('span') ,
                tooltip = document.createElement('div') ,
                text    = document.createTextNode(_targetData) ,
                body    = document.querySelector('body');

            tooltip.appendChild(text);
            tooltip.appendChild(arrow);
            arrow.className = 'arrow';
            tooltip.setAttribute('id' , selector);
            body.appendChild(tooltip);
            tooltip.style.opacity  = _defaults.opacity;
            tooltip.style.zIndex   = _defaults.zIndex;
            tooltip.style.display  = _defaults.display;
            tooltip.style.position = _defaults.position;

            fadeIn(tooltip);
        }
    };


    var _tooltipShow = function ( event ) {
        _target         = event.target;
        var targetTitle = _target.getAttribute('title') ,
            targetData  = _target.getAttribute('data-tooltip');
        _targetData     = targetData;
        _targetText     = targetTitle;

        _tooltiptooltip(_selector);
        _thisTooltip = document.getElementById(_selector);

        targetTitle ? _target.removeAttribute('title') : '';

        var tooltipWidth = Math.round(_thisTooltip.clientWidth);
        var targetWidth  = Math.round(_target.clientWidth);
        var halfWidth    = (tooltipWidth - targetWidth) / 2;
        var tooltipWrap  = document.getElementById('tooltip-container');
        var wrapWidht    = Math.round(tooltipWrap.clientWidth);

        if ( _thisTooltip ) {
            if ( ((getPosition(_target).x + tooltipWidth) - getPosition(tooltipWrap).x) > tooltipWrap.clientWidth ) {
                x = Math.round((getPosition(tooltipWrap).x + wrapWidht) - tooltipWidth);
            } else {
                x = getPosition(_target).x - halfWidth;
            }

            y = getPosition(_target).y - (_thisTooltip.clientHeight);
        }

        if ( x <= getPosition(tooltipWrap).x ) {
            x = Math.round(getPosition(tooltipWrap).x + 1);
        }

        tooltip.style.left = x + 'px';
        tooltip.style.top  = y + 'px';

        var arrowPos        = document.getElementsByClassName('arrow')[0];
        arrowPos.style.left = Math.round((getPosition(_target).x - getPosition(_thisTooltip).x) + (targetWidth / 2)) + 'px';
    };

    var _tooltipHide = function ( event ) {
        event.target.setAttribute('title' , _targetText);
        fadeOut(_thisTooltip);
    };

    return {
        //set div tooltip for tooltip
        init: _init
    };
}(window , document));



