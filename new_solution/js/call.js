window.onload = function() {
	document.getElementById("access-token").value = localStorage.getItem("access_token");
	loadAccessTokenFromDB();
	setTimeout(function() {
		getGroupList();
		getPostList();
	}, 2000);
	loadSelectedGroupFromDB();
}