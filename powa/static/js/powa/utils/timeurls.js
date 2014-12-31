define(["jquery", "foundation-daterangepicker"], function($){
    return Backbone.View.extend({
        initialize: function(args){
            var now = moment(),
                self = this,
                params = this.parseUrl(window.location.search);
            this.format = "YYYY-MM-DD HH:mm:ss";
            this.$el = args.$el;
            this.$el.daterangepicker({
                timePicker: true,
                timePicker12Hour: false,
                timePickerIncrement: 1,
                opens: "left",
                ranges: {
                    'hour': [now.clone().subtract('hour', 1), now],
                    'day': [now.clone().subtract('day', 1), now],
                    'week': [now.clone().subtract('week', 1), now],
                    'month': [now.clone().subtract('month', 1), now],
                }
            }, function(start_date, end_date){
                self.pickerChanged(start_date, end_date);
            });
            this.daterangepicker = this.$el.data('daterangepicker');
            this.daterangepicker.hide();
            this.daterangepicker.container.removeClass('hide');
            this.daterangepicker.startDate = params["from"] ? moment(params["from"]) : moment().subtract("hour", 1);
            this.daterangepicker.endDate = params["to"] ? moment(params["to"]) : moment();
            this.daterangepicker.notify();
            this.start_date = this.daterangepicker.startDate;
            this.end_date = this.daterangepicker.endDate;
        },
        updateUrls : function(start_date, end_date){
                var params = this.parseUrl(window.location.search),
                    self = this;
                params["from"] = start_date.format();
                params["to"] = end_date.format();
                history.pushState({}, "", window.location.pathname + "?" + decodeURIComponent($.param(params, true)));

                $('[data-url-has-params]').each(function(){
                        var params = self.parseUrl(this.search);
                        params["from"] = start_date.format();
                        params["to"] = end_date.format();
                        $('#daterangepicker [data-role="start_date"]').val(start_date.format(self.format));
                        $('#daterangepicker [data-role="end_date"]').val(end_date.format(self.format));
                        this.search = $.param(params, true);
                });
        },
        pickerChanged: function(start_date, end_date){
            this.start_date = this.daterangepicker.start_date;
            this.end_date = this.daterangepicker.end_date;
            this.updateUrls(start_date, end_date);
            this.trigger("pickerChanged", start_date, end_date);
        },
        parseUrl : function(search){
                var params = {},
                pairs = search.replace(/^\?/,'').split('&');
                $.each(pairs, function(){
                    var kv = this.split("="),
                    key = kv[0],
                    value = decodeURIComponent(kv[1]);
                    if(key.length == 0){
                        return;
                    }
                    if(params[key]){
                        if(!$.isArray(params[key])){
                            params[key] = [params[key]];
                        }
                        params[key].push(value);
                    } else {
                        params[key] = value;
                    }
                });
                return params;
        }

        });
});