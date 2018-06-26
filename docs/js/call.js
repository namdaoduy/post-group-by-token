window.onload = function() {
	document.getElementById("access-token").value = localStorage.getItem("access_token");
	loadAccessTokenFromDB();
	loadSelectedGroupFromDB();
}