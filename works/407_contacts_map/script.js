$(function(){
    
    (function(){
        
        function coords(str) {
            return str.split(',');
        }
        
        function init(options) {
            options.center = coords(options.center);
        
            $.each(options.data, function(key, item) {
                item.coords = coords(item.coords);
            });
        
            if (options.type == 'google') {
        
                google.maps.event.addDomListener(window, 'load', function() {
        
                    var map = new google.maps.Map(document.getElementById(options.id), {
                        zoom: parseInt(options.zoom),
                        scrollwheel: false,
                        center: new google.maps.LatLng(options.center[0], options.center[1])
                    });
        
                    $.each(options.data, function(key, item) {
        
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(item.coords[0], item.coords[1]),
                            map: map,
                            title: item.name
                        });
        
                        var infowindow = new google.maps.InfoWindow({
                            content: '<div class="baloon-content">' +
                                '<h3 style="margin: 0; padding-bottom: 3px;">' + item.name + '</h3>' +
                                item.desc +
                                '</div>'
                        });
        
                        google.maps.event.addListener(marker, 'click', function() {
                            infowindow.open(map, marker);
                        });
        
                    });
                });
        
            } else {
        
                ymaps.ready(function() {
        
                    var map = new ymaps.Map(options.id, {
                        center: options.center,
                        zoom: options.zoom,
                        behaviors: ['drag', 'rightMouseButtonMagnifier'],
                    });
        
                    map.controls.add(
                        new ymaps.control.ZoomControl()
                    );
        
                    var MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
                        '<div class="baloon-content" style="padding: 0 10px;">' +
                        '<h3 style="margin: 0;">$[properties.name]</h3>' +
                        '<p>$[properties.desc]</p>' +
                        '</div>'
                    );
        
                    var myCollection = new ymaps.GeoObjectCollection();
        
                    $.each(options.data, function(key, item) {
                        myCollection.add(new ymaps.Placemark(
                            item.coords,
                            item, {
                                balloonContentLayout: MyBalloonContentLayoutClass
                            }
                        ));
                    });
        
                    map.geoObjects.add(myCollection);
        
                });
            }
        }
        
        window.mjsMap = init;
        
    })();
    
});