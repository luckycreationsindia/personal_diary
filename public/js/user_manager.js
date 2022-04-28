//User Manager Start

function getUserDetails(cb) {
	showGBlockMessage();

	$.ajax({
		url: apiUrl + "profile",
		type: 'GET',
		success: function (res) {
			console.log("GOT IT", res);
			if (res.status === "Success") {
				currentUser = res.data;
				afterLogin();
				hideGBlockMessage();
				showLoggedInItems();
				loadHashChange();
				if(cb) cb(true);
			} else {
				// hideGBlockMessage(res.message);
				hideGBlockMessage();
                if(cb) cb(false);
			}
		},
		error: function (err) {
			console.log("ERR:", err);
			if (err.status === 401) {
				hideGBlockMessage("Please Login");
			} else {
				hideGBlockMessage("Error");
			}
            if(cb) cb(false);
		}
	});
}

function login() {
	let loginDialog = $(".loginDiv");
	showGBlockMessage();
	let email = loginDialog.find('#username').val();
	let password = loginDialog.find('#password').val();

	$.ajax({
		url: apiUrl + "login",
		type: 'POST',
		data: { email: email, password: password },
		success: function (res) {
			console.log("GOT IT", res);
			if (res.status === "Success") {
				getUserDetails();
			} else {
				hideGBlockMessage(res.message);
			}
		},
		error: function (err) {
			console.log("ERR:", err);
			hideGBlockMessage("Error");
		}
	});
}

function logout() {
	showGBlockMessage();

	$.ajax({
		url: apiUrl + "logout",
		type: 'GET',
		success: function (res) {
			console.log("GOT IT", res);
			if (res.status === "Success") {
				afterLogout();
				location.reload();
			} else {
				hideGBlockMessage(res.message);
			}
		},
		error: function (err) {
			console.log("ERR:", err);
			hideGBlockMessage("Error");
		}
	});
}

function showChangePasswordDialog() {
	let modal = $("#update-user-password-dialog");
	modal.find('[name="password"]').val('');
	$('select').select2({dropdownParent: modal});
	modal.modal('show');
}

function changePassword() {
	showGBlockMessage();
	let modal = $("#update-user-password-dialog");
	let newPassword = modal.find('[name="password"]').val();
	if (!newPassword) {
		return hideGBlockMessage("Password Cannot be Empty");
	}

	$.ajax({
		url: apiUrl + "users/changepassword",
		type: 'POST',
		data: { password: newPassword },
		success: function (res) {
			if (res.status === 'Success') {
				modal.modal('hide');
			}
			hideGBlockMessage(res.message);
		},
		error: function (err) {
			console.log("ERR:", err);
			hideGBlockMessage("Error");
		}
	});
}

//User Manager End

// loadHashChange();