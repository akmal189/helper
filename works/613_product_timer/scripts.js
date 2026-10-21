$(function(){
	
    var grTimerTemplate = function(wrap){
        var timerBlocksFirst = $(wrap+'.gr-timer'),
        $htmlLang = window._s3Lang.code;
        
        $(wrap).addClass('timer-init');
        
        if ($htmlLang=='de' || $htmlLang=='en') {
            timerDays = 'days';
            timerHours = 'hours';
            timerMinutes = 'minutes';
            timerSeconds = 'seconds'
        } else {
            timerDays = 'Дней';
            timerHours = 'Часов';
            timerMinutes = 'Минут';
            timerSeconds = 'Секунд'
        };

        var outputFormat =  '<span class="gr-timer-elem gr-timer-days"> <span class="gr-timer-number">%d </span> <em>' + timerDays + '</em> </span> <span class="gr-timer-delim">:</span> <span class="gr-timer-elem"> <span class="gr-timer-number">%h </span> <em>' + timerHours + '</em> </span> <span class="gr-timer-delim">:</span> <span class="gr-timer-elem"> <span class="gr-timer-number">%m </span> <em>' + timerMinutes + '</em> </span> <span class="gr-timer-delim">:</span> <span class="gr-timer-elem"> <span class="gr-timer-number">%s </span> <em>' + timerSeconds + '</em> </span>' ;

        if (timerBlocksFirst.length) {
            timerBlocksFirst.timer({
                format_in: "%d.%M.%y %h:%m:%s",
                format_out: outputFormat,
                wrapChar: 'ins class="timerWrapChar"',
                language: $htmlLang,
                update_time: 1000,
                onEnd: function() {
                    $(this).hide();
                }
            });
        }
    };
    grTimerTemplate('.timer-block__date:not(.timer-init)');

    $(document).on('ajaxComplete', function(){
        var grTimerTemplate = function(wrap){
            var timerBlocksFirst = $(wrap+'.gr-timer'),
            $htmlLang = window._s3Lang.code;
            
            $(wrap).addClass('timer-init');
            
            if ($htmlLang=='de' || $htmlLang=='en') {
                timerDays = 'days';
                timerHours = 'hours';
                timerMinutes = 'minutes';
                timerSeconds = 'seconds'
            } else {
                timerDays = 'Дней';
                timerHours = 'Часов';
                timerMinutes = 'Минут';
                timerSeconds = 'Секунд'
            };
    
            var outputFormat =  '<span class="gr-timer-elem gr-timer-days"> <span class="gr-timer-number">%d </span> <em>' + timerDays + '</em> </span> <span class="gr-timer-delim">:</span> <span class="gr-timer-elem"> <span class="gr-timer-number">%h </span> <em>' + timerHours + '</em> </span> <span class="gr-timer-delim">:</span> <span class="gr-timer-elem"> <span class="gr-timer-number">%m </span> <em>' + timerMinutes + '</em> </span> <span class="gr-timer-delim">:</span> <span class="gr-timer-elem"> <span class="gr-timer-number">%s </span> <em>' + timerSeconds + '</em> </span>' ;
    
            if (timerBlocksFirst.length) {
                timerBlocksFirst.timer({
                    format_in: "%d.%M.%y %h:%m:%s",
                    format_out: outputFormat,
                    wrapChar: 'ins class="timerWrapChar"',
                    language: $htmlLang,
                    update_time: 1000,
                    onEnd: function() {
                        $(this).hide();
                    }
                });
            }
        };
        grTimerTemplate('.timer-block__date:not(.timer-init)');
    })
})