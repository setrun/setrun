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
            $.pjax.reload({container: '#'+ $('[data-pjax-container]').attr('id'), 'timeout' : 3000});
        },

        slugify : function (str, fn) {
            var  string = str || false,
                url    = typeof window.getSlugifyUrl !== 'undefined' ?  window.getSlugifyUrl : false;
            if (string && url) {
                Setrun.fn.request({string:string}, function (res) {
                    if (typeof res.slug !== 'undefined' && typeof fn === 'function') {
                        fn(res.slug);
                    }
                }, url);
            }
        },
        notyErrors : function (object) {
            if (typeof object.errors !== 'undefined') {
                Noty.closeAll();
                $.each(object.errors, function (key, value) {
                    Setrun.noty.error(value);
                });
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
        },
        deleteItemHandle : {
            el : '.delete-item',
            ev : 'click'
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
            $btn    = $form.find('button'),
            data    = [],
            options = {};

        if (!$btn.hasClass('submit-ajax')) {
            return true;
        }

        $form.trigger($.Event('form:before'));
        data = $form.serialize();

        options.onBefore = function(){
            $btn.attr('disabled', true);
            $form.trigger($.Event('form-request:before'));

        };
        options.onComplete = function(){
            setTimeout(function () {
                $btn.removeAttr('disabled');
            }, 500);
            $form.trigger($.Event('form-request:complete'));
        };
        options.onSuccess = function(res){
            var message = null;
            $form.trigger($.Event('form-request:success'), [res]);
            if (Setrun.fn.lang('formSuccess')) {
                message = Setrun.fn.lang('formSuccess');
            }
            if (message) {
                Setrun.noty.success(message);
            }
        };
        options.onError = function(res){
            var timeout = 50;
            setTimeout(function () {
                $btn.removeAttr('disabled');
            }, 500);
            $form.trigger($.Event('form-request:error'), [res]);
            if (typeof res.errors === 'object') {
                Noty.closeAll();
                $.each(res.errors, function (key, value) {
                    $form.yiiActiveForm('updateAttribute', key, [value]);
                    setTimeout(function () {
                        Setrun.noty.error(value);
                    }, timeout);
                    timeout = timeout + 50;
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
        var timeout = 50;
        Noty.closeAll();
        $.map(messages, function (value, key) {
            if (typeof value[0] !== 'undefined') {
                setTimeout(function () {
                    Setrun.noty.error(value[0]);
                }, timeout);
                timeout = timeout + 50;
            }
        });
    };

    Component.deleteItemHandle = function (e) {
        var $target = $(e.target),
            $el     = $target.is('a') ? $target : $target.parent(),
            url     = $el.attr('href'),
            message = $el.data('confirm-message'),
            options = {};

        options.onSuccess = function (res) {
            $el.parents('tr').remove();
            Setrun.helpers().pjaxReload();
        };
        options.onError = function (res) {
            Setrun.helpers().notyErrors(res);
        };

        if (confirm(message)) {
            Setrun.fn.request({}, options, url);
        }

        return false;
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

    Setrun.noty = (function ($) {
        var pub = {
            defaults: {
                layout: 'bottomLeft',
                type: 'success',
                timeout: 3000
            },
            init: function () {
            },
            success: function (msg, type, layout, timeout) {
                return pub.alert(msg, 'success', layout, timeout);
            },
            error: function (msg, type, layout, timeout) {
                return pub.alert(msg, 'error', layout, timeout);
            },
            alert: function (msg, type, layout, timeout) {
                if (typeof msg === 'undefined' || msg === null || msg === false) {
                    return false;
                }
                msg = $.trim(msg);
                if (msg === '') {
                    return false;
                }
                if (typeof window.Noty === 'undefined') {
                    alert(msg);
                } else {
                    type = type || pub.defaults.type;
                    layout = layout || pub.defaults.layout;
                    timeout = timeout || pub.defaults.timeout;
                    new Noty({
                        text: msg,
                        type: type,
                        layout: layout,
                        timeout: timeout
                    }).show();
                }
            }
        };

        return pub;
    }(jQuery));
})(jQuery, Setrun);