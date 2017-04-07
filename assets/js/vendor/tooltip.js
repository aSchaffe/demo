/**
 * Created by axelschaffrath on 10.03.17.
 */
$(function () {
    //Alle Hyperlinks auswählen und mit einem mouseover versehen
    $('[data-tooltip]').on('mouseenter' , function ( e ) {
        var $self   = $(this);
        var titel   = $self.attr('data-tooltip');
        var $target = $(e.target);
        var tooltip = '#tooltip';
        var arrow   = '.arrow';

        if ( !$('div').is('#tooltip') ) {
            $('<div></div>')
                .attr('id', 'tooltip')
                .appendTo('body');
        }

        //Den Title des Hyerlinks auslesen und leeren
        if ( $self.attr('title') ) {
            $self.attr('title' , null);
        }
        $(tooltip).finish()
            .html(titel + '<span class="arrow"></span>');

        //Position des a Elements im Dokument (auf der Seite)
        var pos          = $target.offset();
        var x            = e.target.offsetLeft;
        var y            = Math.round(pos.top);
        var targetWidth  = Math.round($target.outerWidth());
        var tooltipWidth = Math.round($(tooltip).outerWidth());
        var halfWidth    = (tooltipWidth - targetWidth) / 2;
        var body         = 'body';
        var bodyWidth    = $(body).width();

        //Position  X von Link + Breite Quickinfo größer als window Breite dann Ausrichtung rechtsbündig
        (x + tooltipWidth) > bodyWidth ? x = Math.round(bodyWidth - tooltipWidth) : x = (Math.round(pos.left)) - halfWidth;
        if ( x <= $('.icon').offset().left ) {
            x = Math.round($('.icon').offset().left);
        }

        $(tooltip).css({
            left: x + 'px' ,
            top: (y - ($(tooltip).height())) + 'px'
        }).finish()
            .fadeIn(200);

        $(arrow).css('left' , (Math.round($target.offset().left)) - $(tooltip).offset().left + ( targetWidth / 2 ) + 'px')
            .fadeIn(200);

        $self.on('mouseleave' , function () {

            if ($self.is('a, img')) {
                $self.attr('title' , $(tooltip).text());
            }
            $(tooltip).fadeOut(200 , function () {
                $(this).html(null)
                    .css({
                        left: '' ,
                        top: '' ,
                        display: ''
                    });
            });
        });

        return false;
    });
});