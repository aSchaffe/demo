/*
 * @author:		Axel Schaffrath
 * @copyright:	2017 info@axel-schaffrath.de
 * @module:		gallery slider, stickynav, modal box
 * @license:	LGPL
 */
/* jshint expr: true */

$(function () {
    if ($(window).width() < 768) {
        $(document).mobilMenue();
    }
    var slider = '.slideanim',
        sliderMore = '.slide-more',
        slide = 'slide',
        modifier = 'slide--',
        buttonMore = '.button__container';

    function slideIn(selector) {
        $(selector).children().each(function (i, el) {
            $(el).attr('class', slide + " " + modifier + (i + 1));
        });
    }

    //Callback with inner function
    var newContainer = $('<div class="inner-function"></div>');

    function outputFunction(item) {
        $('.container-fluid.gallery .row').append(newContainer);
        newContainer.html(item);
    }

    function getItem(inner) {
        return function () {
            outputFunction(inner);
        };
    }

    $(window).on('scroll', getItem('<p>Weitere Bilder werden mit der Methode <strong>$.get()</strong> sowie <strong>$.getJSON()</strong> beim Click des Buttons geladen.</p>'));

    $(buttonMore).hide();
    if ($(window).width() < 480) {
        $('#content').hide();
    } else {
        $(window).scroll(function () {
            $(slider).each(function () {
                var pos = $(this).offset().top;
                var winTop = $(window).scrollTop();
                if (pos < winTop + $('#mainnav').height() + 600) {
                    slideIn(slider);
                    setTimeout(function () {
                        $('div.bounce').remove();
                    }, 300);
                    setTimeout(function () {
                        $('.gallery__copy-text-inner').addClass('is-acitve');
                    }, 1000);
                }
            });
            $(buttonMore).fadeIn(1000);
        });
    }

    $(sliderMore).hide();
    if ($(window).width() < 480) {
        $('#content').hide();
    } else {
        $('button').on('click', function () {
            var button = $(this);
            var spinner = $('<div id="spinner"><img src="assets/images/loading.gif"/></div>');
            var src = [];
            var offset = button.offset();
            button.fadeOut('fast');
            newContainer.fadeOut('fast');
            $(sliderMore).find('img').each(function (i, el) {
                var $el = $(el);
                var dataSrc = $el.attr('data-src');
                src.push(dataSrc);
                $el.attr('src', dataSrc);
            });
            if (!src.length) {
                spinner.remove();
            } else {
                var responded = 0;
                var to = setTimeout(function () {
                    $('body').append(spinner);
                }, 200);

                function afterImgLoaded() {
                    responded++;
                    if (responded === src.length) {
                        clearTimeout(to);
                        spinner.fadeOut();
                        $(sliderMore).show();
                        slideIn(sliderMore);
                        $('html, body').animate({scrollTop: offset.top - 300}, 1000);
                    }
                }

                for (var i = 0; i < src.length; i++) {
                    var imgSrc = src[i];
                    $.get(imgSrc, afterImgLoaded);
                }
            }

            //AJAX request for image gallery
            $.getJSON('json/images.json', function (data) {
                $.each(data.items, function (i, item) {

                    function loadImages(selector) {
                        $(selector).append($('<figure>' +
                            '<img src="' + (item.src) + '" ' +
                            'title="' + (item.title) + '" ' +
                            'alt="' + (item.alt) + '" ' +
                            'width="' + (item.width) + '" ' +
                            'height="' + (item.height) + '"></figure>'), item
                        ).on(slideIn(sliderMore));
                    }

                    var blog = $('.gallery__last:last');
                    loadImages(blog);
                });
            });
        });
    }

    // Set margin top slide
    if ($(window).width() > 768) {
        $('button').on('click', function () {
            var highest_element = $('.slideanim:last').outerHeight();
            var lower_element = $('.slideanim:first').outerHeight();

            if (highest_element > lower_element) {
                $('.gallery').find('.gallery__first:last').css({
                    'margin-top': -(highest_element - lower_element) + 'px'
                });
            }

            if (highest_element < lower_element) {
                $('.gallery').find('.gallery__last:last').css({
                    'margin-top': +(highest_element - lower_element) + 'px'
                });
            }
        });
    } else {
        $('.gallery').find('.gallery__first:last').css({
            'margin-top': 0
        });
    }

    if ($(window).width() > 768) {
        //Sticky nav setting
        var mainNav = document.querySelector('#mainnav');
        var topOfNav = mainNav.offsetTop;

        window.innerWidth < 768 ? mainNav.style.display = 'none' : mainNav.style.display = '';

        function fixNav() {
            if (window.scrollY > topOfNav) {
                document.body.classList.add('fixed-nav');
                document.querySelector('#headline').style.marginTop = mainNav.clientHeight + 'px';

            } else {
                document.body.classList.remove('fixed-nav');
                document.querySelector('#headline').style.marginTop = '';
            }
        }

        window.addEventListener('scroll', fixNav);

        //Configuration mainnav
        var nav = '#mainnav';
        var navElements = {
            ul: $(nav).find('ul li ul'),
            item: '.nav-item',
            link: 'li > a',
            active: 'nav-active'
        };
        $(nav).find('ul').eq(0).css({
            left: $(window).width() / 2 + 'px',
            'margin-left': Math.round(-($(nav).find('ul').eq(0).width())) / 2 + 'px'
        });

        $(navElements.ul).hide();

        $("#mainnav ul li:has(ul)").hover(function () {
            $(this).find("ul").slideDown(300);
            $(navElements.link).on('click', function () {
                if ($(navElements.ul).is(':visible')) {
                    $(navElements.ul).slideUp(300);
                }
            });
        }, function () {
            $(this).find("ul").hide();
        });

        $('#mainnav ul li a[href^="#"]').on('click', function (event) {
            $('#mainnav ul li a').removeClass('nav-active');
            $('html, body').animate({
                scrollTop: $($(this).attr('href')).offset().top - $(nav).height()
            }, 'swing');
            $(this).addClass('nav-active');
            event.preventDefault();
        });
    }

    //Modal box
    var modalBox = {
        layer: $('.modal-container'),
        close: $('<a class="modal-close-btn"></a>'),
        open: $('a.modal-open-btn'),
        section: $('section'),
        bg: $('<div class="modal-bg"></div>')
    };

    $(modalBox.layer).css('left', function () {
        return Math.round(($(window).width() / 2 ) - ($(this).width() / 2), 0) + 'px';
    });

    $(modalBox.layer).hide();

    function slideModalBox(modal, modalbg) {
        $(modal).fadeOut(500);
        $(modalbg).fadeOut(500);
        setTimeout(function () {
            modalbg.remove();
            $(modal).removeClass('is-active');
        }, 700);
    }

    $(modalBox.layer).append(modalBox.close);

    $('a.modal-close-btn').on('click', function () {
        slideModalBox(modalBox.layer, modalBox.bg);
    });

    $(modalBox.open).on('click', function (event) {
        event.preventDefault();

        $(window).on('click', function () {
            slideModalBox(modalBox.layer, modalBox.bg);
        });
        event.stopPropagation();

        $(this).each(function () {
            var modalId = $('html, body').find('' + $(this).data("target"));
            if (typeof modalId !== 'undefined') {
                $(modalId).fadeIn(500).addClass('is-active');
                $('html, body').animate({
                    scrollTop: modalId.offset().top - $('#mainnav').height()
                }, 'slow');
                $('body').append(modalBox.bg);
                $(modalBox.bg).hide().fadeIn(500);

                if ($(modalId).hasClass('is-active')) {
                    $(modalId).on('click', function (ev) {
                        $(window).on('click', function () {
                            if (!$(ev.target).is(modalId)) {
                            } else {
                                ev.preventDefault();
                            }
                        });
                        ev.stopPropagation();
                    });
                }
            }
        });
    });

    // //Checkbox confirm
    // $('fieldset.checkbox-container label').html('<span>Ich habe die <a href="datenschutz" target="_blank" title="Ich habe die Datenschutzbedingungen gelesen und stimme diesen zu!">Datenschutzbedingungen</a> gelesen und stimme diesen zu!<span class="mandatory">*</span></span>');
    //
    // var button = 'div.submit-container > input',
    //     input = 'input.checkbox',
    //     value = 'Daten ausfüllen ...',
    //     buttonClass = 'no-active';
    //
    // $(button).attr({
    //     title: 'Bitte bestätigen Sie die Datenschutzbestimmungen',
    //     disabled: true,
    //     value: value
    // });
    //
    // $(button).addClass(buttonClass);
    //
    // $(input).on('click', function () {
    //     if ($(this).is(':checked')) {
    //         $(button).removeAttr('disabled');
    //         $(button).removeClass(buttonClass);
    //         $('input.submit').attr({
    //             title: 'Anfrage senden ...',
    //             value: 'Anfrage senden ...'
    //         });
    //     } else {
    //         $(button).attr({
    //             title: 'Bitte bestätigen Sie die Datenschutzbestimmungen',
    //             disabled: true,
    //             value: value
    //         });
    //         $(button).addClass(buttonClass);
    //     }
    // });


    //Start Kraeuter-Bar
    var counter = 0;

    //Event-Handler für die Icons
    $('img[data-name]').on('click', iconClick);

    //Event-Handler Icon Widder nach dem Laden der Seite
    $('img[data-name="basilikum"]').trigger('click', iconClick);

    //Function nach auslösen des Events laut Aufgabenstellung
    function iconClick() {
        counter++;

        var $self = $(this);
        var dataAttr = $self.attr('data-name');
        var url = 'json/herbs.json';
        var title = '.information h3';
        var times = '.information strong';
        var description = '.information p';
        var images = '.image img';
        var $imgWidth = $('.image').innerWidth();


        function jsonGet() {
            $.getJSON(url, function (data) {
                $.each([dataAttr], function (i, items) {
                    $.each(data[items], function (index, item) {
                        $(title).text(item.herbs);
                        $(times).text(item.subdescription);
                        $(description).text(item.description);
                        $(images).attr('src', 'files/img/herbs/large/' + item.bild);
                    });

                });
            })
                .fail(function (jqXHR, status, error) {
                    $(description).html('Upps hier ist was falsch: ' + jqXHR.status + ' ' + error).show();
                });
        }

        if (counter > 1) {
            var information = '.information';
            counter--;
            setTimeout(function () {
                $(information).animate({
                    opacity: 0
                }, {
                    duration: 700,
                    easing: 'swing'
                });
            }, 300);
            $(images).parent()
                .animate({
                    'margin-left': -$imgWidth * 2
                }, {
                    duration: 500,
                    easing: 'swing',
                    complete: function () {
                        $(information).animate({
                            opacity: 1
                        }, {
                            duration: 500,
                            easing: 'swing'
                        });
                        setTimeout(function () {
                            jsonGet();
                            $(images).parent().css({
                                'margin-left': -$imgWidth * 2
                            })
                                .animate({
                                    'margin-left': 0
                                }, {
                                    duration: 700,
                                    easing: 'swing'
                                });
                        }, 500);
                    }
                });
        } else {
            jsonGet();
        }
        return false;
    }


    //Resize content
    $(window).on('resize', function () {
        var nav = '#mainnav';

        $(nav).find('ul').eq(0).css({
            left: $(window).width() / 2 + 'px',
            'margin-left': Math.round(-($(nav).find('ul').eq(0).width()), 0) / 2 + 'px'
        });

        $(modalBox.layer).css('left', function () {
            return Math.round(($(window).width() / 2 ) - ($(this).width() / 2), 0) + 'px';
        });

        if ($(window).width() > 999) {
            $('#mainnav').fadeIn('2000');

            var highest_element = $('.slideanim:last').height();
            var lower_element = $('.slideanim:first').height();

            if (highest_element > lower_element) {
                $('.gallery').find('.gallery__first:last').css({
                    'margin-top': -(highest_element - lower_element) + 'px'
                });
            }

            if (highest_element < lower_element) {
                $('.gallery').find('.gallery__last:last').css({
                    'margin-top': +(highest_element - lower_element) + 'px'
                });
            }
        } else {
            $('.gallery').find('.gallery__first:last').css({
                'margin-top': 0
            });
        }

        $(window).width() < 1200 ? $('.gallery__copy-text-inner').fadeOut('2000') : $('.gallery__copy-text-inner').fadeIn('2000');

        $(window).width() < 768 ? $('#content, #mainnav').fadeOut('2000') : $('#content, #mainnav').fadeIn('2000');
    });
});