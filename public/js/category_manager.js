//Category Manager Start

let categoryList = [];

let CategoryManager = (function () {
	function add() {
		let modal = $('#add-category-form');
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
		uploadFile(f, (err, res) => {
			if(err) {
				return;
			}

			data.images = [res];

			console.log("DATA==>",data);

			$.ajax({
				url: apiUrl + "api/category/add",
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
		});
	}

	function load(cb) {
		$.ajax({
			url: apiUrl + "api/category",
			type: 'GET',
			success: function (res) {
				if (res.status === 'Success') {
					categoryList = res.data;
					if(cb) cb(res.data);
				}
			},
			error: function (err) {
				console.log("ERR:", err);
				hideGBlockMessage("Error");
			}
		});
	}

	function loadCategories() {
		let categoryListGroup = $(".categoryListGroup");
		let categoryListTemplate = $(".categoryListTemplate").clone().removeClass('categoryListTemplate');

		categoryListGroup.empty();

		$.ajax({
			url: apiUrl + "api/category/loadAll",
			type: 'POST',
			success: function (res) {
				console.log(res);
				if (res.status === 'Success') {
					let result = res.data;
					result.forEach((p) => {
						let temp = categoryListTemplate.clone();
						temp.find('.categoryName').html(p.name);
						temp.find('.categoryName').on('click', function () {
							//clickedCategory = p;
							location.href = '#add-category?isUpdate=true&id=' + p._id;
						});
						if(p.images.length > 0)
							temp.find('.categoryImage').attr('src',imageHostUrl + p.images[0]);
						categoryListGroup.append(temp);
					});
				}
			},
			error: function (err) {
				console.log("ERR:", err);
				hideGBlockMessage("Error");
			}
		});
	}

	function init() {
		loadCategories();
	}

	return {
		load,
		add,
		init
	}
})();

//Category Manager End