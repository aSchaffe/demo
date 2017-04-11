/**
 * Created by axelschaffrath on 10.03.17.
 */
(function ( $ , document ) {
    ////////////////////////////////////////////
    //begin configuration off basic nav-elements
    $.fn.mobilMenue = function () {
        var $navSetting = (function () {
            var $mainNav = $('nav.mobil-nav');
            var $mainUl  = $mainNav.find('ul:eq(0)');
            var navWidht = Math.round($('nav.mobil-nav').outerWidth());
            var $state   = {
                hidden: 'hidden' ,
                active: 'active'
            };

            $mainUl.addClass('mainnav');

            //set scroll animation for main + sub ul.element
            function scrolling( scroll ) {
                var linkHeight = Math.round($('nav > ul').eq(0).find('li.active > a[href^="#"]').outerHeight());

                $('html, body').animate({
                    scrollTop: scroll.offset().top - linkHeight
                } , 300 , 'swing');
            }

            function slideSub( up ) {
                up.find('li.' + $state.active)
                    .removeClass($state.active)
                    .addClass($state.hidden)
                    .children('ul:visible')
                    .slideUp(300 , 'swing');
            }

            return {
                //set default style for nav tag
                default: function ( settings ) {
                    $mainNav.css({
                        display: settings.display ,
                        position: settings.position ,
                        right: settings.right ,
                        left: settings.left ,
                        top: settings.top ,
                        bottom: settings.bottom ,
                        height: settings.height ,
                        opacity: settings.opacity ,
                        width: settings.width
                    });
                } ,
                ////set scroll function to top off all a.elements after click event
                // scroll: function (selector) {
                //     $mainNav.find($link).on('click', function () {
                //         $navSetting.animations($(this).closest('ul'));
                //         scrollTo(selector);
                //     });
                //     function scrollTo(to) {
                //         scrolling(to);
                //     }
                // },
                ////set scroll function to top of a.element with ul child after click event
                // scrollSub: function (to) {
                //     scrolling(to);
                // },
                //toggle function ul.element next level after click event off target a
                animations: function ( e , elem , active , hidden ) {
                    elem.animate({
                        opacity: 'toggle' ,
                        height: 'toggle'
                    } , {
                        duration: 300 ,
                        easing: 'swing' ,
                        complete: function () {
                            if ( $(this).is(':hidden') ) {
                                elem.parent()
                                    .removeClass(active)
                                    .addClass(hidden);

                            } else {
                                elem.parent()
                                    .removeClass(hidden)
                                    .addClass(active);
                            }
                            if ( !$(e.target).is('ul.mainnav li ul li a[href="#"]') ) {
                                scrolling($(this));
                            }
                        }
                    });
                } ,
                //set window background
                bckgrnd: function ( bgclass ) {
                    var $bg   = $('<div class="' + bgclass + '"></div>');
                    var $into = $('body');

                    $bg.appendTo($into)
                        .css({
                            opacity: 0 ,
                            display: 'block'
                        })
                        .animate({
                            opacity: 0.45
                        } , 300);
                } ,
                //set close nav
                open: function () {
                    var $self = $(this);

                    $navSetting.bckgrnd('menue-bg' , $self);

                    var $spacer       = $('.btn-mobil-nav');
                    var $spacerDiv    = $('body').prepend('<div class="spacer"></div>');
                    var $spacerHeight = $spacer.outerHeight(true);

                    $spacerDiv.find('.spacer').css('height' , $spacerHeight + 'px');

                    var $mainNavHeader = $('<button>x</button>')
                        .prependTo('nav.mobil-nav')
                        .wrap('<div class="menue-header"></div>');

                    $mainNavHeader.show();
                    $navSetting.default({
                        display: 'block' ,
                        top: 0
                    });
                    $('nav.mobil-nav')
                        .removeClass('is-hidden')
                        .addClass('is-active')
                        .animate({
                            left: 0
                        } , {
                            duration: 300 ,
                            easing: 'swing'
                        });

                    $navSetting.close();
                } ,
                //set start mobil-nav
                start: function () {
                    //begin settings off html elements
                    $navSetting.default({
                        left: -navWidht ,
                        position: 'absolute'
                    });

                    var mobilMen = '<div class="btn-mobil-nav"><a href="/" title="Mobile Menü öffnen">Menü</a></div>';
                    var mobilBtn = '.btn-mobil-nav';
                    $('body').prepend(mobilMen);

                    var $subNav       = $('ul li ul');
                    var $subNavParent = $subNav.parent();

                    $subNavParent.addClass($state.hidden);
                    $subNav.find('li:has(ul)').addClass($state.hidden);

                    $('ul li:has(ul) > a[href^="#"]').on('click' , function ( event ) {
                        $navSetting.animations(event , $(this).siblings() , $state.active , $state.hidden);
                        slideSub($(this).closest('ul'));
                        return false;
                    });

                    $(mobilBtn).on('click' , function () {
                        var $self = $(this);

                        $navSetting.open();
                        $self.hide();
                        return false;
                    });
                } ,
                //set close nav
                close: function () {
                    var $menueBg  = '.menue-bg';
                    var $menueBtn = 'button';
                    var $self     = $('.menue-header, .menue-bg');

                    $.each($self , function ( i , elem ) {
                        $(this).on('click' , function ( e ) {
                            var $target = $(e.target);
                            if ( $target.is($menueBtn) || $target.is($menueBg) ) {
                                closeNav();
                            }
                            return false;
                        });
                    });

                    function closeNav() {
                        $($menueBg)
                            .animate({
                                opacity: 0
                            } , {
                                duration: 300 ,
                                easing: 'swing' ,
                                complete: function () {
                                    slideSub($('.mobil-nav ul'));
                                    $(this)
                                        .css({
                                            display: 'none'
                                        })
                                        .remove();
                                }
                            });

                        $('.mobil-nav')
                            .finish()
                            .animate({
                                left: -navWidht ,
                                opacity: 'toggle'
                            } , {
                                duration: 300 ,
                                easing: 'swing' ,
                                complete: function () {
                                    $(this).removeClass('is-active').addClass('is-hidden');
                                    removeDiv($('.spacer') , $('.btn-mobil-nav') , $('.menue-header'));
                                }
                            });
                    }

                    function removeDiv( a , b , c ) {
                        a.remove();
                        b.show();
                        c.fadeOut(300 , 'swing').remove();
                    }
                }
            }
        })();
        //End basic configuration off nav-elements
        //////////////////////////////////////////
        return $navSetting.start();
    };
})(jQuery , document);