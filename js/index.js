var token = 'EAAAAUaZA8jlABAIZBuFWjZASNGxjd2RANBdiJDPyVv5eHg8XAcbvuatQ8ZBUCkfz9JsYvwkE8KG5R4cy08htjZAuOQfc70gKe9LWFdhLylJ0OO6TeSWgZAkE6rcAZBZAloAb4TE2ZBFQZBKZBRVUP7g4hjGaKEdIPyn3fTm86wrx66nHwZDZD';
var id_group;

// function unpublishedPhoto(pic_url) {
//     FB.api("/180006272410535/photos", "POST",
// 	    {
// 	        access_token: token,
// 	        published: false,
// 	        url: pic_url
// 	    },
// 	    function(response) {
// 	        console.log(response);
// 	    });
// }

function multipicsPost() {
	var arr = new Array();
	var pics = document.getElementsByClassName("pics");

	unpublishedPhoto(pics, 0);

	function unpublishedPhoto(_pics, _cur) {
		if (_pics[_cur]) {
			FB.api("/180006272410535/photos", "POST",
			    {
			        access_token: token,
			        published: false,
			        url: _pics[_cur].src
			    },
			    function(response) {
			        console.log(response);
			        arr.push({media_fbid: response.id});
			        unpublishedPhoto(_pics, _cur+1);
			    }
			);
		}
		else {
			FB.api("/180006272410535/feed", "POST",
			    {
			        access_token: token,
			        message: "post",
			        attached_media: arr
			    },
			    function(response) {
			        console.log(response);
			    }
			);
		}
	}
}






function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:"image/png"});
}