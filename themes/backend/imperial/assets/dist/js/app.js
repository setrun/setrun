;(function($, Setrun){

    "use strict";

    /**
     *
     */
    Setrun.component('helpers', {
        clearFilter : function () {
            var href = document.location.href.split('?')[0];
            history.pushState({}, '', href);
            this.pjaxReload();
        },

        pjaxReload : function () {
            $.pjax.reload({container: '#'+ $('[data-pjax-container]').attr('id')});
        },

        slugify : function (str, fn) {
            var  string = str || false,
                url    = typeof window['getSlugifyUrl'] !== 'undefined' ?  window['getSlugifyUrl'] : false;
            if (string && url) {
                Setrun.fn.request({string:string}, function (res) {
                    if (typeof res.slug !== 'undefined' && typeof fn === 'function') {
                        fn(res.slug);
                    }
                }, url);
            }
        }
    });

    var Component = {};

    Component.autoload = true;

    /**
     * Event handlers
     * @type {object}
     */
    Component.handlers = {
        formSubmitHandle : {
            ev : 'beforeSubmit'
        },
        pjaxCompleteHandle : {
            ev: 'pjax:complete'
        },
        clearFilterHandle : {
            el: '#clear-filter',
            ev: 'click'
        },
        popoverHandler : {
            el : '.kv-editable-popover',
            ev : 'show.bs.modal'
        },
        fieldValueHandle : {
            el: '.field-value .kv-editable-value',
            ev: 'click'
        },
        ajaxCompleteHandle : {
            ev: 'ajaxComplete'
        },
        afterValidateHandle : {
            el : '.form',
            ev : 'afterValidate'
        }
    };

    /**
     * Init function
     * @return {void}
     */
    Component.init = function()
    {
        this.initChosen();
        $('body').tooltip({
            selector: '[title]'
        });
        $('[data-toggle="popover"]').popover({
            placement : 'top'
        });
        if (this.checkEmptyRow()){
            $.pjax.disable();
        }
    };

    /**
     *
     * @param e
     * @returns {boolean}
     */
    Component.formSubmitHandle = function (e) {
        var $form   = $(e.target),
            data    = [],
            options = {};

        $form.trigger($.Event('form:before'));
        data = $form.serialize();

        options.onBefore = function(){
            $form.find('button').attr('disabled', true);
            $form.trigger($.Event('form-request:before'));

        };
        options.onComplete = function(){
            $form.find('button').removeAttr('disabled');
            $form.trigger($.Event('form-request:complete'));
        };
        options.onSuccess = function(res){
            $form.trigger($.Event('form-request:success'), [res]);
            if (Setrun.fn.lang('formSuccess')) {
                //$.growl.notice({title:"", message: Setrun.fn.lang('formSuccess'), location: 'br'});
            }
        };
        options.onError = function(res){
            $form.find('button').removeAttr('disabled');
            $form.trigger($.Event('form-request:error'), [res]);
            if (typeof res.errors === 'object') {
                $.each(res.errors, function (key, value) {
                    $form.yiiActiveForm('updateAttribute', key, [value]);
                    //$.growl.error({title:"", message:'ff', location: 'br'});
                });
            }
        };
        Setrun.fn.request(data, options);
        return false;
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
     * Create a handler for the clear filters
     * @param {object} e Event object
     */
    Component.clearFilterHandle = function (e)
    {
        Setrun.helpers().clearFilter();
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
     *
     * @param e
     * @param xhr
     * @param settings
     */
    Component.ajaxCompleteHandle = function (e, xhr, settings) {
        if (typeof settings.url !== 'undefined' && settings.url.indexOf('sorting') > 0) {
            Setrun.helpers().pjaxReload();
        }
    };

    /**
     *
     * @param e
     * @param messages
     */
    Component.afterValidateHandle = function (e, messages) {
        $.map(messages, function (value, key) {
            if (typeof value[0] !== 'undefined') {
                $.growl.error({title:'', message: value[0], location: 'br'});
            }
        });
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

    /**
     *
     * @returns {boolean}
     */
    Component.checkEmptyRow = function () {
        return $('[data-pjax-container] td .empty').length === 1;
    };

    Setrun.component('theme/backend', Component);
    Component = null;
})(jQuery, Setrun);