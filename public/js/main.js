let currentHash = "";
let currentUserId = 0;
let currentUserWelcome = $(".currentUserWelcome");
let currentUser = null;
let currentUserRole = 0;
let firstLoadDone = false;
let apiUrl = "http://localhost:3000/";
let imageHostUrl = apiUrl + 'file/';

$.ajaxSetup({
    xhrFields: {
        withCredentials: true
    },
    crossDomain: true,
});

$(window).on('hashchange', function () {
    console.log("WINDOW HASH CHANGED");
    loadHashChange();
});

function loadHashChange() {
    console.log("HASH CHANGE CALLED");
    $(".slide-item").removeClass('active');
    if (currentUserId === 0) {
        hideLoggedInItems();
        console.log("USER ID 0");
        $(".pageloader").html('');
        if(!firstLoadDone) {
            firstLoadDone = true;
            getUserDetails((status) => {
                console.log("GET USER DETAILS IN FIRST LOAD:")
                if(!status) {
                    $.ajax({
                        url: "page/unauthorized",
                        type: 'GET',
                        success: function (res) {
                            hideGBlockMessage();
                            $(".pageloader").html(res);
                            $('[data-toggle="tooltip"]').tooltip();
                            // getUserDetails();
                        },
                        error: function (err) {
                            console.error("ERROR", err);
                            if (err.status === 401) {
                                hideGBlockMessage("Please Login");
                                $(".pageloader").html(err.responseText);
                                $('[data-toggle="tooltip"]').tooltip();
                                afterLogout();
                            } else {
                                console.log("ERR:", err);
                                hideGBlockMessage("Error");
                            }
                        }
                    });
                } else {
                    //loadHashChange();
                }
            });
        } else {
            showGBlockMessage();
            $.ajax({
                url: "page/unauthorized",
                type: 'GET',
                success: function (res) {
                    hideGBlockMessage();
                    $(".pageloader").html(res);
                    $('[data-toggle="tooltip"]').tooltip();
                    getUserDetails();
                },
                error: function (err) {
                    console.error("ERROR", err);
                    if (err.status === 401) {
                        hideGBlockMessage("Please Login");
                        $(".pageloader").html(err.responseText);
                        $('[data-toggle="tooltip"]').tooltip();
                        afterLogout();
                    } else {
                        console.log("ERR:", err);
                        hideGBlockMessage("Error");
                    }
                }
            });
        }
    } else {
        showGBlockMessage();
        cleanHash();
        getPage();
    }
}

function hideLoggedInItems() {
    $(".loggedInItem").addClass('hide');
    $(".main-content").removeClass('app-content');
}

function showLoggedInItems() {
    $(".loggedInItem").removeClass('hide');
    $(".main-content").addClass('app-content');
}

function cleanHash() {
    let page = window.location.hash;
    page = page.substr(1, page.length);
    currentHash = page;
    if (currentHash === "") currentHash = "home";
}

function getPage(cb) {
    let page = currentHash;
    // console.log("GET PAGE:" + page)
    let href = location.href;
    let [hash, query] = [];
    if(href.indexOf('#') !== -1) {
        [hash, query] = location.href.split('#')[1].split('?');
    } else {
        hash = "";
        query = "";
    }
    const params = Object.fromEntries(new URLSearchParams(query));
    // console.log("hash==>", hash);
    // console.log("queryParams==>", query);
    // console.log("jsonParams==>", params);
    // if(hash === 'add-product' && params.hasOwnProperty('id')) isUpdateProduct = true;
    // if(hash === 'add-category' && params.hasOwnProperty('id')) isUpdateCategory = true;
    // if(hash === 'add-banner' && params.hasOwnProperty('id')) isUpdateBanner = true;
    // if(hash === 'add-blog' && params.hasOwnProperty('id')) isUpdateBlog = true;

    $.ajax({
        url: "page/" + page,
        type: 'GET',
        success: function (res) {
            $(".pageloader").html(res);
            // $('.datetimepicker').datetimepicker();
            $('[data-toggle="tooltip"]').tooltip();
            if (cb == null) {
                if (hash === "" || hash === "#") {
                    console.log("DASHBOARD LOADED");
                } else if (hash === "add-category") {
                    console.log("Add Category");
                } else if (hash === "list-category") {
                    console.log("List Category");
                    CategoryManager.init();
                } else if (hash === "add-banner") {
                    console.log("Add Banner");
                    BannerManager.init();
                } else if (hash === "list-banner") {
                    console.log("List Banners");
                    BannerManager.initBannerList();
                } else if (hash === "usermanager") {
                }
                hideGBlockMessage();
            } else {
                cb();
            }
        },
        error: function (err) {
            console.log("ERR STATUS:", err.status);
            console.log("ERR MSG:", err.message);
            if (err.status === 401) {
                hideGBlockMessage("Please Login");
                console.log(err.message);
                $(".pageloader").html(err.responseText);
                $('[data-toggle="tooltip"]').tooltip();
                afterLogout();
            } else {
                hideGBlockMessage("Error");
                console.log("ERR:", err);
            }
        }
    });
}

function afterLogin() {
    // $(".user-menu").removeClass('hide');
    currentUserId = currentUser.id;
    let name = currentUser.first_name;
    if (name) {
        if (currentUser.last_name) {
            name += " " + currentUser.last_name;
        }
    } else {
        name = currentUser.email;
    }
    console.log("CURRENT USER NAME: " + name);
    currentUserWelcome.html(name);
    currentUserRole = currentUser.role;
    if (currentUserRole !== 1) {
        $(".adminMenu").addClass('hide');
    } else {
        $(".adminMenu").removeClass('hide');
    }
}

function afterLogout() {
    currentUser = null;
    currentUserId = 0;
    currentUserWelcome.html("");
    currentUserRole = 0;
}