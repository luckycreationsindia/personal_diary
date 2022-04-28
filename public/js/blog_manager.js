//Blog Manager Start

let blogList = [];

let BlogManager = (function () {
	function add() {
		let modal = $('#add-blog-form');
		let data = {};
		modal.find('.form-control[name]').each(function (e) {
			let key = $(this).attr('name');
			let val = $(this).val() || "";
			if (Array.isArray(val))
				val = val.toString();
			data[key] = val;
		});

		let file = modal.find('[name="images"]');
		let f = file[0].files[0] || "";
		data.images = [];

		if(f) {
			uploadFile(f, (err, res) => {
				if (err) {
					return;
				}

				data.images = [res];
				addOrUpdate(data, false);
			});
		} else {
			addOrUpdate(data, false);
		}
	}

	function update() {
		let modal = $('#add-blog-form');
		let data = {};
		modal.find('.form-control[name]').each(function (e) {
			let key = $(this).attr('name');
			let val = $(this).val() || "";
			if (Array.isArray(val))
				val = val.toString();
			data[key] = val;
		});

		let file = modal.find('[name="images"]');
		let f = file[0].files[0] || "";
		data.images = [];

		if(f) {
			uploadFile(f, (err, res) => {
				if (err) {
					return;
				}

				data.images = [res];
				addOrUpdate(data, true);
			});
		} else {
			addOrUpdate(data, true);
		}
	}

	function addOrUpdate(data, isUpdate = false) {
		$.ajax({
			url: apiUrl + `api/blog/${isUpdate ? "update" : "add"}`,
			type: 'POST',
			data: data,
			success: function (res) {
				console.log(res);
				if (res.status === 'Success') {
				}
			},
			error: function (err) {
				console.log("ERR:", err);
				hideGBlockMessage("Error");
			}
		});
	}

	function load(cb) {
		$.ajax({
			url: apiUrl + "api/blog",
			type: 'GET',
			success: function (res) {
				if (res.status === 'Success') {
					bannerList = res.data;
					if(cb) cb(res.data);
				}
			},
			error: function (err) {
				console.log("ERR:", err);
				hideGBlockMessage("Error");
			}
		});
	}

	function init() {

	}

	return {
		load,
		add,
		update,
		init
	}
})();

//Blog Manager End