/**
 * Created by Annie Fu on 9/13/2015.
 */
var test = "";
$(document).ready(function() {
    geocoder  = new google.maps.Geocoder();
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

function swap_contents() {
    window.location.assign("map.html");
}
function check_address() {
    console.log(test);
    geocoder.geocode({'address': test}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.lat();
            var lng = results[0].geometry.location.lng();
            var point = new Parse.GeoPoint({latitude: lat, longitude: lng});

            var query = new Parse.Query(Spot);
            console.log(point);
            var within_range = query.withinMiles("Location", point, 10);

            within_range.find({
                    success: function (matches) {
                        console.log(matches.length);
                        for (var i = 0; i < matches.length; i++) {
                            swap_contents();
                            var item = matches[i].get("Address");
                            console.log(item);

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



