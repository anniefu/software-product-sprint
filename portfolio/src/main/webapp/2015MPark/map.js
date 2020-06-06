/**
 * Created by Annie Fu on 9/13/2015.
 */
var test = "";
$(document).ready(function() {
    $(".header div i").click(function () {
        console.log("click");
        test = $("input:text").val();
        check_address();
    });
});

function key_pressed(e) {
    console.log("key press");
    if (e.which == 13) {
        test = $("input:text").val();
        check_address();
        return false;

    }
}
var map;
var markerArray = [];

function clearMarkers() {
    for(var i = 0; i < markerArray.length; ++i) {
        markerArray[i].setMap(null);
    }
    markerArray.length = 0;
}


function check_address() {
    console.log(test);
    geocoder.geocode({'address': test}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.lat();
            var lng = results[0].geometry.location.lng();
            var point = new Parse.GeoPoint({latitude: lat, longitude: lng});

            var query = new Parse.Query(Spot);
            console.log(query.length);
            console.log(point);
            var within_range = query.withinMiles("Location", point, 10);


            within_range.find({
                    success: function (matches) {
                        clearMarkers();
                        console.log(matches.length);
                        for (var i = 0; i < matches.length; i++) {
                            var item = matches[i].get("Location");
                            var contentString = '<div id="content">'+
                                    '<h3>' +
                                matches[i].get("Address") +
                                    '</h3>' +
                                    '<div id="bodyContent">' +
                                    '<p>' +
                                    'Monthly price: $' +
                                    matches[i].get("Price") +
                                    '</p>' +
                                        '</div>' +
                                '</div>';
                            console.log(contentString);


                            var fullString = '<div id="content">'+
                                '<h3>' +
                                matches[i].get("Address") +
                                '</h3>' +
                                '<div id="bodyContent">' +
                                '<p>' +
                                'Monthly price: $' +
                                matches[i].get("Price") +
                                '</p>' +
                                '<p>' +
                                'Date range: ' +
                                matches[i].get("StartDate") +
                                ' - ' +
                                matches[i].get("EndDate") +
                                '</p>' +
                                '<p>' +
                                'E-mail: ' +
                                matches[i].get("Email") +
                                '</p>' +
                                '<p>' +
                                'Phone number: ' +
                                matches[i].get("Phone") +
                                '</p>' +
                                '</div>' +
                                '</div>';

                            var myLatLng = new google.maps.LatLng(item.latitude, item.longitude);
                            var marker = new google.maps.Marker({
                                position: myLatLng,
                                map: map,
                                animation: google.maps.Animation.DROP,
                                html: contentString,
                                html2: fullString
                            });

                            marker.addListener('click', function() {
                                infoWindow.close();
                                fullWindow.setContent(this.html2);
                                fullWindow.open(map, this);

                            });
                            marker.addListener('mouseover', function() {
                                var check_map = fullWindow.getMap();
                                if(check_map == "undefined" || fullWindow.getContent() != this.html2){
                                    infoWindow.setContent(this.html);
                                    infoWindow.open(map, this);

                                }

                            });

                            marker.addListener('mouseout', function() {
                                infoWindow.close();
                            });

                            if(i == 0){
                                map.setZoom(14);
                                map.panTo(marker.position);
                            }

                            markerArray.push(marker);
                        }
                    },
                    error: function (object, error) {
                        alert("Error");
                    }
                }
            );
        }
    });
}


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: {lat: 42.275, lng: -83.735}
    });
    geocoder = new google.maps.Geocoder();
    infoWindow = new google.maps.InfoWindow({});
    fullWindow = new google.maps.InfoWindow({});



}

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}