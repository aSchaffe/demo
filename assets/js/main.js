$(document).ready(function () {
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

    $(buttonMore).hide();
    if ($(window).width() < 480) {
        $('#content').hide();
    } else {
        $(window).scroll(function () {
            setTimeout(function () {
                $('div.bounce').remove();
            }, 500);
            $(slider).each(function () {
                var pos = $(this).offset().top;
                var winTop = $(window).scrollTop();
                if (pos < winTop + 130) {
                    slideIn(slider);
                }
            });
            $(buttonMore).show();
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
            button.hide('fast');
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
                        ).bind(slideIn(sliderMore));
                    }

                    var blog = $('.gallery__last:last');
                    loadImages(blog);
                });
            });

            $('.inner-function').fadeOut('slow');

        });
    }

    //Callback with inner function
    var newContainer = $('<div class="inner-function"></div>');

    function outputFunction(item) {
        $('.row').eq(1).append(newContainer);
        $('.inner-function').html(item);
    }

    function getItem(inner) {
        return function () {
            outputFunction(inner)
        }
    }

    $(window).on('scroll', getItem('<p>Weitere Bilder werden mit der Methode <strong>$.get()</strong> sowie <strong>$.getJSON()</strong> beim Click des Buttons geladen.</p>'));

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

    //Sticky Nav confi
    var mainNav = document.querySelector('#mainnav');
    var topOfNav = mainNav.offsetTop;

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
        'margin-left': -($(nav).find('ul').eq(0).width() / 2) + 'px'
    });

    $(navElements.ul).hide();

    $("#mainnav ul li:has(ul)").hover(function () {
        $(this).find("ul").slideDown('300');

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

    //Modal box
    var modalBox = {
        layer: $('#modal'),
        close: $('a.modal-close-btn'),
        open: $('a.button--modal'),
        section: $('section'),
        bg: $('<div class="modal-bg"></div>')
    };

    $(modalBox.layer).css('left', function () {
        return ($(this).offset().left) + ($(this).width() / 2) + 'px'
    });

    $(modalBox.layer).hide();

    function slidemodalBox() {
        $(modalBox.layer).fadeOut(300);
        setTimeout(function () {
            modalBox.bg.remove();
            $(modalBox.layer).removeClass('is-active');
        }, 200);
    }

    if (!$(event.target).hasClass('div.modal-container.is-active')) {
        $(window).on('click', function () {
            slidemodalBox();
        });
    }

    $(modalBox.close).on('click', function (e) {
        e.stopPropagation();
        slidemodalBox();
        // $('html, body').animate({
        //     scrollTop: $(this).offset().top - $('#mainnav').height()
        // }, 'slow');
    });

    $(modalBox.open).on('click', function (event) {
        event.stopPropagation();
        event.preventDefault();
        // $('html, body').find(modalBox.layer).fadeOut().removeClass('is-active');
        $('html, body').find(modalBox.layer).fadeIn(300).addClass('is-active');
        modalBox.bg.remove();
        setTimeout(function () {
            $('body').append(modalBox.bg);
        }, 200);
        $('html, body').animate({
            scrollTop: $(this).closest(modalBox.section).find(modalBox.layer).offset().top - $('#mainnav').height()
        }, 'slow');
    });

    //Resize content
    $(window).on('resize', function () {
        var nav = '#mainnav';

        $(nav).find('ul').eq(0).css({
            left: $(window).width() / 2 + 'px',
            'margin-left': -($(nav).find('ul').eq(0).width() / 2) + 'px'
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

        if ($(window).width() < 1200) {
            $('.gallery__copy-text-inner').fadeOut('2000');
        } else {
            $('.gallery__copy-text-inner').fadeIn('2000');
        }
        if ($(window).width() < 768) {
            $('#content, #mainnav').fadeOut('2000');
        } else {
            $('#content, #mainnav').fadeIn('2000');
        }
    });
});