(function ($) {
    $.fn.rotateTableCellContent = function (options) {
        /*
        Version 1.0
        7/2011
        Written by David Votrubec (davidjs.com) and
        Michal Tehnik (@Mictech) for ST-Software.com
        */

        var cssClass = ((options) ? options.className : false) || "vertical";

        var cellsToRotate = $('.' + cssClass, this);

        var betterCells = [];
        cellsToRotate.each(function () {
            var cell = $(this)
            , newHTML = cell.html()
            , height = cell.height()
            , width = cell.width()
            , newDiv = $('<div>', { height: width, width: height })
            , newInnerDiv = $('<div>', { html: newHTML, 'class': 'rotated' });

            newInnerDiv.css('-webkit-transform-origin', (width / 2) + 'px ' + (width / 2) + 'px');
            newInnerDiv.css('-moz-transform-origin', (width / 2) + 'px ' + (width / 2) + 'px');
            newDiv.append(newInnerDiv);

            betterCells.push(newDiv);
        });

        cellsToRotate.each(function (i) {
            $(this).html(betterCells[i]);
        });
    };
})(jQuery);

$(document).ready(function(){
    // rotate
    $('table').rotateTableCellContent();
    var i,empty = [];
    var tr = $('table tr');
    if (typeof check !=="undefined"){
        for (i=1; i<tr.length; i++){
            $(tr[i]).children().each(function(j){
                empty[j] = empty[j] || $(this).text().length;
            });
        }
    }else{
        for (i=2; i<tr.length; i++){
            $(tr[i]).children().each(function(j){
                empty[j] = empty[j] || $(this).text().length;
            });
        }
    }
    
    for (i=0; i<tr.length; i++){
         $(tr[i]).children().each(function(j){
             if (!empty[j]) $(this).remove();
        });
    }
});