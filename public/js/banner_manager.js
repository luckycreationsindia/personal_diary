//Banner Manager Start

let bannerList = [];

let BannerManager = (function () {
	function add() {
		let modal = $('#add-banner-form');
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

		if(f) {
			uploadFile(f, (err, res) => {
				if (err) {
					return;
				}

				data.image = res;
				addOrUpdate(data, false);
			});
		} else {
			addOrUpdate(data, false);
		}
	}

	function update() {
		let modal = $('#add-banner-form');
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

		if(f) {
			uploadFile(f, (err, res) => {
				if (err) {
					return;
				}

				data.image = res;
				addOrUpdate(data, true);
			});
		} else {
			addOrUpdate(data, true);
		}
	}

	function addOrUpdate(data, isUpdate = false) {
		$.ajax({
			url: apiUrl + `api/banner/${isUpdate ? "update" : "add"}`,
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

	function initBannerList() {
		let bannerListGroup = $(".bannerListGroup");
		let bannerListTemplate = $(".bannerListTemplate").clone().removeClass('bannerListTemplate');

		bannerListGroup.empty();

		load(function (banners) {
			banners.forEach((p) => {
				let temp = bannerListTemplate.clone();
				temp.find('.bannerName').html(p.name);
				temp.find('.bannerImage').attr('src',imageHostUrl + p.image);
				bannerListGroup.append(temp);
			});
		});
	}

	function load(cb) {
		$.ajax({
			url: apiUrl + "api/banner",
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
		init,
		initBannerList
	}
})();

//Banner Manager End