;(function($, Setrun){
    "use strict";

    var Component = {};

    /**
     * Event handlers
     * @type {object}
     */
    Component.handlers = {
        pjaxCompleteHandle : {
            ev: 'pjax:complete'
        },
        popoverHandler : {
            el : '.kv-editable-popover',
            ev : 'show.bs.modal'
        },
        fieldValueHandle : {
            el: '.field-value .kv-editable-value',
            ev: 'click'
        }
    };

    /**
     * Init function
     * @return {void}
     */
    Component.init = function()
    {
        this.initChosen();
    };

    /**
     * Create a handler for the listen pjax:complete
     * @param {object} e Event object
     */
    Component.pjaxCompleteHandle = function(e)
    {
        this.initChosen();
    };

    /**
     *
     * @param e
     */
    Component.popoverHandler = function (e) {
        $.each($('.kv-editable-popover'), function(){
            if ($(this).is(':visible')) {
                $(this).popoverX('hide');
            }
        });
    };

    /**
     * Create a handler for get field value of ajax
     * @param {object} e Event object
     */
    Component.fieldValueHandle = function (e)
    {
        var $el        = $(e.target),
            $container = $el.parent(),
            id         = $container.find('input[name="id"]').val(),
            field      = $container.find('input[name="attribute"]').val();

        Setrun.fn.request({field:field, id:id}, function(res){
            $container.find('.kv-editable-input').val(res.value);
        }, getFieldUrl);
    };

    /**
     * Init jquery.chosen plugin
     * @return {void}
     */
    Component.initChosen = function ()
    {
        $('select').chosen({
            disable_search_threshold: 10,
            placeholder_text_single:   ' ',
            placeholder_text_multiple: ' '
        });
    };

    Setrun.component('theme_backend', Component);
    Component = null;
})(jQuery, Setrun);