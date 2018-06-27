var token = "";
var id_post = "";
var post_list = [];
var selected_group_list = [];
var checked_group_list = [];
var all_group_list = [];
var count;
var interval;

function saveAccessToken() {
	var t = document.getElementById("access-token").value;
	if (t.indexOf("EAAA", 0) < 0) {
		console.log("Wrong access token");
		return -1;
	}
	else {
		localStorage.setItem("access_token", t);
		loadAccessTokenFromDB();
	}
}

function loadAccessTokenFromDB() {
	token = localStorage.getItem("access_token");
}

function btnAccessToken() {
	FB.api("/me", {access_token: document.getElementById("access-token").value},
		function(response) {
			let hello = document.querySelector("#sec-token h4");
			if (response.name) {
				saveAccessToken();
				hello.innerHTML = "Xin chào " + response.name + "!";
				hello.setAttribute("style", "color: #84ba10;");
				document.querySelectorAll("section[id^='sec-']").forEach(function(obj) {
					obj.classList.remove("hide");
				});
				setTimeout(function() {
					location.href = "#sec-post";
				}, 2000);
			}
			else {
				hello.innerHTML = "Access Token không đúng!";
				hello.setAttribute("style", "color: #fc6b61;")
			}
		}
	);
}

function multipicsPost(id_group) {
	var arr = new Array();
	var pics = new Array();
	var mess = "";
	var priv = {"value" : "SELF"};

	log('Đang post lên group ' + id_group + ' ...');

	FB.api("/" + id_post, {access_token: token},
	    function(response) {
	        console.log(response);
	        mess = response.message;
	        FB.api("/" + id_post + "?fields=attachments", {access_token: token},
			    function(response) {
			        console.log(response);
			        var data = JSON.stringify(response);
			        var start = 0;
			        var end = 0;
			        while (1) {
			        	start = data.indexOf("https://scontent.xx", end);
			        	if (start < 0)
			        		break;
			        	else {
			        		end = data.indexOf("\"", start);
			        		var url = data.slice(start, end);
			        		console.log(url);
			        		pics.push(url);
			        	}
			        }
			        unpublishedPhoto(pics, 0);
			    }
			);
	    }
	);

	function unpublishedPhoto(_pics, _cur) {
		if (_pics[_cur]) {
			FB.api("/" + id_group + "/photos", "POST",
			    {
			        access_token: token,
			        published: false,
			        url: _pics[_cur]
			    },
			    function(response) {
			        console.log(response);
			        arr.push({media_fbid: response.id});
			        unpublishedPhoto(_pics, _cur+1);
			    }
			);
		}
		else {
			FB.api("/" + id_group + "/feed", "POST",
			    {
			        access_token: token,
			        message: mess,
			        attached_media: arr
			    },
			    function(response) {
			        console.log(response);
			        log('Post thành công lên group ' + id_group + ' !');
			        if (id_group == "me") {
			        	FB.api("/" + response.id , "POST",
						    {
						    	access_token: token,
						        privacy: priv
						    },
						    function(response) {
						        console.log(response);
						    }
						);
			        }
			        
			    }
			);
		}
	}
}

function getPostList() {
	FB.api("/me/feed?limit=5",{access_token: token},
	    function(response) {
	        console.log(response);
	        var cont_post = document.getElementById("post-list");
	        cont_post.innerHTML = "";
	        post_list = [];
	        for (let obj of response.data) {
	        	post_list.push(obj.id);
	        	cont_post.innerHTML += '<option value="' + obj.id + '">' +
	        		(obj.message ? obj.message : obj.story).slice(0, 30) + '...</option>';
	        }
	    }
	);
}

function setPostID() {
	id_post = document.getElementById("post-list").value;
}

function getGroupList() {
	FB.api("/me/groups?limit=300",{access_token: token},
	    function(response) {
	        console.log(response);
	        var cont_group = document.getElementById("all-group-list");
	        cont_group.innerHTML = "";
	        all_group_list = [];
	        for (let obj of response.data) {
	        	all_group_list.push(obj);
	        	cont_group.innerHTML += '<li onclick="selectGroup(this)" id="' + obj.id + '">' + obj.name + '</li>';
	        }
	    }
	);
}

function filterGroup() {
    var input, filter, ul, li, a, i;
    input = document.getElementById('search-bar');
    filter = input.value.toUpperCase();
    ul = document.getElementById("all-group-list");
    li = ul.getElementsByTagName('li');
    for (i = 0; i < li.length; i++) {
        if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function selectGroup(obj) {
	if (document.querySelectorAll("#group-list tr[id='" + obj.id + "']").length == 0) {
		var cont_group = document.getElementById("group-list");
		cont_group.innerHTML += '<tr id="' + obj.id + '"><td class="gr-name">' + obj.innerHTML + 
			'</td><td><input type="checkbox" checked></td><td><i class="fas fa-times" onclick="delGroup(this)"></i></td></tr>';
	}
}

function delGroup(ele) {
	var tr = ele.parentNode.parentNode;
	tr.parentNode.removeChild(tr);
}

function checkAll(obj) {
	var value = obj.checked;
	var all = document.querySelectorAll("#selected-group input[type='checkbox']");
	for (let item of all) {
		item.checked = value;
	}
}

function getSelectedGroup() {
	var groups = document.querySelectorAll("#group-list tr");
	selected_group_list = [];
	for (let obj of groups) {
		selected_group_list.push(
		{
			id: obj.id,
			name: obj.querySelector(".gr-name").innerHTML
		});
		console.log(selected_group_list);
	}
}

function getCheckedGroup() {
	var groups = document.querySelectorAll("#group-list tr");
	checked_group_list = [];
	for (let obj of groups) {
		if (obj.querySelector("td input:checked")) {
			checked_group_list.push(
			{
				id: obj.id,
				name: obj.querySelector(".gr-name").innerHTML
			});
			console.log(checked_group_list);
		}
	}
}

function saveSelectedGroupToDB() {
	getSelectedGroup();
	localStorage.setItem("selected_group_list", JSON.stringify(selected_group_list));
}

function loadSelectedGroupFromDB() {
	selected_group_list = JSON.parse(localStorage.getItem("selected_group_list"));
	var cont_group = document.getElementById("group-list");
	for (let obj of selected_group_list) {
		cont_group.innerHTML += '<tr id="' + obj.id + '"><td class="gr-name">' + obj.name + 
			'</td><td><input type="checkbox" checked></td><td><i class="fas fa-times" onclick="delGroup(this)"></i></td></tr>';
	}
}

function execute() {
	getCheckedGroup();
	setPostID();
	document.querySelector("#sec-execute div:last-child").setAttribute("style", "display: block;");
	if (checked_group_list && id_post) {
		saveSelectedGroupToDB();
		var btn = document.getElementById("execute");
		var delay = document.getElementById("delay").value * 1000;
		btn.setAttribute("onclick", "stop()");
		btn.innerHTML = "Hủy";
		btn.classList.add("red");
		count = 0;
		multipicsPost(checked_group_list[count].id);
		count++;
		interval = setInterval(function() {
			multipicsPost(checked_group_list[count].id);
			count++;
			if (!checked_group_list[count]) {
				stop();
				return;
			}
		}, delay);
	}
}

function stop() {
	clearInterval(interval);
	var btn = document.getElementById("execute");
	btn.setAttribute("onclick", "execute()");
	btn.innerHTML = "Đăng bài";
	btn.classList.remove("red");
}

function log(text) {
	var text_area = document.getElementById("log");
	text_area.innerHTML += timeNow() + ": " + text + "\n";
}

function timeNow() {
	var date = new Date();
	var result;
	hh = '' + date.getHours();
	mm = '' + date.getMinutes();
	ss = '' + date.getSeconds();
	if (hh.length == 1)
		hh = '0' + hh;
	if (mm.length == 1)
		mm = '0' + mm;
	if (ss.length == 1)
		ss = '0' + ss;
	result = hh + ':' + mm + ':' + ss;
	return result;
}

function toggleDropdown(target) {
	document.getElementById(target).classList.toggle("hide");
}