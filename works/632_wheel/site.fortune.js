const fortuneWheel = function($self) {

    let $block = $self.find('.decor-wrap-popup .fortune-wheel');
    if ($block.length) {
        $block.each(function() {
            let $this = $(this);
            var parent = $this.closest('.lpc-block');
            var parentId = parent.attr('id');

            var padding = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                w = 460 - padding.left - padding.right,
                h = 460 - padding.top - padding.bottom,
                r = Math.min(w, h) / 2,
                rotation = 0,
                oldrotation = 0,
                picked = 100000,
                oldpick = [],
                rotate = 0,
                spinDuration = 5000,
                color = d3.scale.category20(); //category20c()
            var form = parent.find('form');
            var sendText = parent.find('.question__after-send').data('send-text');
            var checkPopupBlock = parent.attr('data-popup-block');
            var popupBlockBtn = parent.find('.lpc-popup-fortune__custom-btn');

            function hexToRgb(hex) {
                // Удаляем возможный символ #
                hex = hex.replace(/^#/, '');

                // Проверяем наличие корректной длины
                if (hex.length !== 6) {
                    throw new Error('Неправильный формат шестнадцатеричного цвета. Ожидается формат "#RRGGBB".');
                }

                // Разбиваем на составляющие R, G и B
                const r = parseInt(hex.slice(0, 2), 16);
                const g = parseInt(hex.slice(2, 4), 16);
                const b = parseInt(hex.slice(4, 6), 16);

                return {
                    r,
                    g,
                    b
                };
            }

            function getContrastColor(rgbStr) {
                let customBg = hexToRgb(rgbStr);
                let textColor = Math.round((customBg.r * 299 + customBg.g * 587 + customBg.b * 114) / 1000);
                return (textColor > 150) ? '#000' : '#000';
            }

            var data = $this.data("labels");
            data = data.replace(/,$/, '');
            data = JSON.parse('[' + data + ']');

            var infiniteRotate = $this.data("infinite")

            var svg = d3.select('#' + parentId + ' .fortune-wheel')
                .append("svg")
                .data([data])
                .attr("width", w + padding.left + padding.right)
                .attr("height", h + padding.top + padding.bottom);

            var container = svg.append("g")
                .attr("class", "chartholder")
                .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");

            container.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 230)
                .style({
                    "fill": "var(--primary-color-base)"
                });

            var vis = container
                .append("g");

            if (infiniteRotate) {
                vis.attr("class", "infinite-rotate");
            }

            if (data.length % 2 === 0 && data.length / 2 % 2 !== 0) {
                rotate = 360 / data.length / 2;
                vis.style({
                    "rotate": rotate + "deg"
                });
            }

            var pie = d3.layout.pie().sort(null).value(function(d) {
                return 1;
            });

            // declare an arc generator function
            var arc = d3.svg.arc().outerRadius(r);

            // select paths, use arc generator to draw
            var arcs = vis.selectAll("g.slice")
                .data(pie)
                .enter()
                .append("g")
                .attr("class", "slice");


            arcs.append("path")
                .attr("fill", function(d, i) {
                    return i % 2 ? 'var(--primary-color-base)' : 'var(--primary-color-l-5)';
                })
                .attr("d", function(d) {
                    return arc(d);
                });

            // add the text
            arcs.append("text")
                .attr("text-anchor", "middle")
                .attr("class", "lp-header-text-3")
                .style({
                    "fill": function() {
                        // Получаем fill у path, к которому относится текущий текстовый элемент
                        let pathFill = d3.select(this.parentNode).select("path").attr("fill");
                        let pathFillColor = getComputedStyle(document.documentElement).getPropertyValue(pathFill.match(/var\((.*?)\)/)?.[1])
                        
                        console.log(pathFillColor)
                        
                        return getContrastColor(pathFillColor);
                    }
                })
                .text(function(d, i) {
                    return data[i].label;
                });


            function beforeSubmitActions(event) {
                event.preventDefault();
                container.call(spin);
            }


            function firstStepSpin(event) {
                event.preventDefault();
                container.call(popupspin);

                setTimeout(function() {
                    parent.find('.lpc-popup-fortune__step-1').hide();
                    parent.find('.lpc-popup-fortune__step-2').show();
                }, 3000);

            }

            if (checkPopupBlock) {
                popupBlockBtn.on('click', firstStepSpin);
                
                localStorage.setItem('wheelActivated', 1)

                form.on('submit', popupSubmit);

                $('.lpc-popup-fortune__finish-btn').on('click', function() {
                    $(this).closest('.lp-popup-wrapper').find('.js-close-popup').trigger('click');
                });
            } else {
                form.on('submit', beforeSubmitActions);
            }


            wrap(arcs.selectAll("text"), 140);

            function wrap(text, width) {

                text.each(function() {
                    var text = d3.select(this),
                        words = text.text().split(/\s+/).reverse(),
                        word,
                        line = [],
                        lineNumber = 0,
                        lineHeight = 1, // ems
                        y = text.attr("y"),
                        dy = 0,
                        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
                    while (word = words.pop()) {
                        line.push(word);
                        tspan.text(line.join(" "));
                        if (tspan.node().getComputedTextLength() > width) {
                            line.pop();
                            tspan.text(line.join(" "));
                            line = [word];
                            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", Math.sqrt(++lineNumber) * lineHeight + dy + "em").text(word);
                        }
                        text.attr("transform", function(d) {
                            d.innerRadius = 0;
                            d.outerRadius = r;
                            d.angle = (d.startAngle + d.endAngle) / 2;
                            return "rotate(" + (d.angle * 180 / Math.PI - 90 + 1.75 - lineNumber * 2) + ")translate(" + (d.outerRadius - 90) + ")";
                        })
                    }
                });
            }


            function spin(d) {

                container.on("click", null);

                //all slices have been seen, all done
                //console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
                if (oldpick.length == data.length) {
                    container.on("click", null);
                    return;
                }

                var ps = 360 / data.length,
                    pieslice = Math.round(1440 / data.length),
                    rnd = Math.random();
                
                
				if(rnd%2 == 0){
					if(rnd > 2) {
						rnd = rnd-1
					} else {
						rnd = rnd+1
					}
				}
				
                var rng = Math.floor(rnd * 1440) + 360;

                rotation = (Math.round(rng / ps) * ps);

                picked = Math.round(data.length - (rotation % 360) / ps);
                picked = picked >= data.length ? (picked % data.length) : picked;


                if (oldpick.indexOf(picked) !== -1) {
                    d3.select(this).call(spin);
                    return;
                } else {
                    oldpick.push(picked);
                }

                rotation += 90 - Math.round(ps / 2) - rotate;

                if (infiniteRotate) {
                    setTimeout(function() {
                        vis.attr("class", "stop-rotate");
                    }, 2600);
                }


                vis.transition()
                    .style({
                        "animation-duration": "2.9s"
                    })
                    .duration(spinDuration)
                    .attrTween("style", rotTween)
                    .each("end", function() {

                        //mark question as seen
                        d3.select('#' + parentId + ' .slice:nth-child(' + (picked + 1) + ') path')
                            .attr("fill", "var(--primary-color-d-10)");

                        d3.select('#' + parentId + ' .slice:nth-child(' + (picked + 1) + ') text').style({
                            "fill": function() {
                                // Получаем fill у path, к которому относится текущий текстовый элемент
                                let pathFillColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color-d-10')
                                return getContrastColor(pathFillColor);
                            }
                        })

                        //populate question
                        $('#' + parentId).find('[data-alias="prize"]').val(data[picked].label);

                        $('#' + parentId + ' .lp-form-tpl__button').click();

                        d3.select('#' + parentId + ' .question__after-send h2')
                            .text(sendText + ' ' + data[picked].label);

                        $('#' + parentId + ' .question__before-send').hide();
                        $('#' + parentId + ' .question__after-send').show("slow").fadeOut;
                        $('#' + parentId + ' .question-message').hide();


                        $('#' + parentId + ' form').hide();


                        //container.on("click", spin);
                    });

            }

            function popupSubmit(d) {
                $('#' + parentId + ' .lp-form-tpl__button').click();

                /*d3.select('#'+parentId + ' .question__after-send h2')
                .text(sendText + ' ' + data[picked].label);*/

                $('#' + parentId + ' .question__before-send').hide();
                $('#' + parentId + ' .question__after-send').hide()
                $('#' + parentId + ' .question-message').hide();
                $('#' + parentId + ' form').hide();

                setTimeout(function() {
                    $('#' + parentId + ' .lpc-popup-fortune__step-2').addClass('_last-step');
                    $('#' + parentId + ' .lpc-popup-fortune__finish-btn').show();
                }, 950);

            }

            function popupspin(d) {

                container.on("click", null);

                //all slices have been seen, all done
                if (oldpick.length == data.length) {
                    container.on("click", null);
                    return;
                }

                var ps = 360 / data.length,
                    pieslice = Math.round(1440 / data.length),
                    rnd = Math.floor(Math.random()*1440);
               
                var rng = rnd + 360;


                rotation = (Math.round(rng / ps) * ps);
				if (Math.round((rotation%360)/ps)%2 == 0){
					rotation += ps;
				}
                picked = Math.round(data.length - (rotation % 360) / ps);
                picked = picked >= data.length ? (picked % data.length) : picked;


                if (oldpick.indexOf(picked) !== -1) {
                    d3.select(this).call(spin);
                    return;
                } else {
                    oldpick.push(picked);
                }

                //rotation += 90 - Math.round(ps / 2) - rotate;
                rotation += 90 - Math.round(ps / 2);

                if (infiniteRotate) {
                    vis.attr("class", "stop-rotate");
                }


                vis.transition()
                    .duration(spinDuration)
                    .attrTween("style", rotTween)
                    .each("end", function() {

                        //mark question as seen
                        d3.select('#' + parentId + ' .slice:nth-child(' + (picked + 1) + ') path')
                            .attr("fill", "var(--primary-color-d-10)");

                        d3.select('#' + parentId + ' .slice:nth-child(' + (picked + 1) + ') text').style({
                            "fill": function() {
                                // Получаем fill у path, к которому относится текущий текстовый элемент
                                let pathFillColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color-d-10')
                                return getContrastColor(pathFillColor);
                            }
                        })

                        //populate question
                        $('#' + parentId).find('[data-alias="prize"]').val(data[picked].label);

                        /*if(!checkPopupBlock) {
						$('#'+parentId + ' .lp-form-tpl__button').click();
						
						d3.select('#'+parentId + ' .question__after-send h2')
                		.text(sendText + ' ' + data[picked].label);
	                        
						$('#'+parentId + ' .question__before-send').hide();
						$('#'+parentId + ' .question__after-send').show();
						$('#'+parentId + ' .question-message').hide();

	                        
						$('#'+parentId + ' form').hide();
						}*/

                        d3.select('#' + parentId + ' .question__after-send h2')
                            .text(sendText + ' ' + data[picked].label);

                        $('#' + parentId + ' .question__after-send').show();
                        $('#' + parentId + ' .lpc-popup-fortune__step-2').show();

                        //container.on("click", spin);
                    });

            }

            //make arrow
            svg.append("g")
                .attr("transform", "translate(" + (w - 42) + "," + ((h / 2) - 25) + ")")
                .append("path")
                .attr("class", "wheel-indicator")
                .attr("d", "M40.0261 10.6195L11.9636 23.1737C10.386 23.8795 10.386 26.1192 11.9637 26.825L40.0261 39.3793C41.3491 39.9712 42.8428 39.003 42.8428 37.5536V12.4451C42.8428 10.9957 41.3491 10.0276 40.0261 10.6195Z")
                .style({
                    "fill": "white"
                });

            //draw spin circle
            container.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 20)
                .attr("stroke", "#fff")
                .attr("stroke-width", "7")
                .attr("class", "inner-circle")
                .style({
                    "fill": "var(--primary-color-base)"
                });

            container.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 230)
                .attr("stroke", "#fff")
                .attr("class", "outer-circle")
                .attr("stroke-width", "10")
                .style({
                    "fill": "transparent"
                });

            function rotTween(to) {
                var i = d3.interpolate(oldrotation % 360, rotation);
                return function(t) {
                    return "transform: rotate(" + i(t) + "deg)";
                };
            }
        });
    }
};


const adaptiveBlock = function() {

    let decorWrap = document.querySelector(".decor-wrap2");

    if (decorWrap) {

        let decorWrapWidth = decorWrap.offsetWidth;

        if (decorWrapWidth < 480) {
            decorWrap.setAttribute("data-media-source", "media-xs");

        } else if (decorWrapWidth < 768) {
            decorWrap.setAttribute("data-media-source", "media-sm");

        } else if (decorWrapWidth < 960) {
            decorWrap.setAttribute("data-media-source", "media-md");

        } else if (decorWrapWidth < 992) {
            decorWrap.setAttribute("data-media-source", "media-lg");

        } else if (decorWrapWidth < 1280) {
            decorWrap.setAttribute("data-media-source", "media-lg");

        } else if (decorWrapWidth >= 1280) {
            decorWrap.setAttribute("data-media-source", "media-xl");

        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
	let wheelTimePopup = $('.decor-wrap-popup').data('time');
	if(!localStorage.getItem('wheelActivated')) {
	    adaptiveBlock()
	    fortuneWheel($('body'))
	    
	    setTimeout(function(){
	    	$('.decor-wrap-popup').addClass('active')
	    	localStorage.setItem('wheelActivated', 1)
	    }, wheelTimePopup)
	
	    window.onresize = () => {
	        adaptiveBlock()
	    }
	
	    document.querySelector('.lpc-popup-fortune__finish-btn').addEventListener('click', (e) => {
	        document.location.reload()
	    })
	
	    document.querySelector('.lpc-popup-fortune__note').addEventListener('click', (e) => {
	        e.preventDefault()
	        window.addonStub.showMessage('Переход на страницу с полным текстом правил акций либо всплывающее окно с текстом правил');
	    })
	}
	
	$('.decor-wrap-popup .decor-wrap-popup-in .decor-wrap-close').on('click', function(){
		$('.decor-wrap-popup').removeClass('active')
	})
})