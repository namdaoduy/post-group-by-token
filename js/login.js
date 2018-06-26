var token = 'EAAAAUaZA8jlABAIZBuFWjZASNGxjd2RANBdiJDPyVv5eHg8XAcbvuatQ8ZBUCkfz9JsYvwkE8KG5R4cy08htjZAuOQfc70gKe9LWFdhLylJ0OO6TeSWgZAkE6rcAZBZAloAb4TE2ZBFQZBKZBRVUP7g4hjGaKEdIPyn3fTm86wrx66nHwZDZD';

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

function statusChangeCallback(r) {
    if (r.status === 'connected') {
        window.location = '../';
    }
    else {
        
    }
}

window.onload = function() {
    checkLoginState();
}

function sample() {
    FB.api("/me?fields=name,picture", {access_token: token}, 
    function(response) {
        console.log(response);
    });
}

function sampleGroup() {
    FB.api("/180006272410535/feed", "POST", 
    {
        access_token: token,
        message: "ahihihi",
    },
    function(response) {
        console.log(response);
    });
}