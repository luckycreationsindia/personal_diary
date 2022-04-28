function hideGBlockMessage(msg, ele) {
    $("#global-loader").fadeOut("slow");
    return;
    let blockele = null;
    try {
        if (ele.length > 0) blockele = ele; else blockele = $('body');
    } catch (e) {
    }
    if (msg != null && msg != '') {
        hideGBlockMessage();
        showGBlockMessage(msg, ele);
        setTimeout(function () {
            try {
                if (blockele) blockele.unblock();
                else $.unblockUI();
            } catch (e) {
                console.error(e);
            }
        }, 2000);
    } else {
        try {
            if (blockele) blockele.unblock();
            else $.unblockUI();
        } catch (e) {
            console.error(e);
        }
    }
}

function showGBlockMessage(message, ele) {
    $("#global-loader").fadeIn("slow");
    return;
    if (!message) message = "Loading...";
    let blockele = null;
    try {
        if (ele.length > 0) blockele = ele; else blockele = $('body');
    } catch (e) {
    }
    if (blockele) {
        blockele.block({
            message: message,
            baseZ: 99999,
            overlayCSS: {
                backgroundColor: '#1b2024',
                opacity: 0.8,
                cursor: 'wait'
            },
            css: {
                border: 0,
                color: '#fff',
                padding: 0,
                backgroundColor: 'transparent'
            }
        });
    } else {
        $.blockUI({
            message: message,
            baseZ: 99999,
            overlayCSS: {
                backgroundColor: '#1b2024',
                opacity: 0.8,
                cursor: 'wait'
            },
            css: {
                border: 0,
                color: '#fff',
                padding: 0,
                backgroundColor: 'transparent'
            }
        });
    }
}

const toIST = function (cd) {
    if (!cd) return null;
    return new Date(cd);
    // let d = new Date(cd);
    // return new Date(d.getTime() + (5.5 * 60 * 60 * 1000)).toLocaleString();
};

const getISTTime = function (cd) {
    if (!cd) return null;
    return toIST(cd).toLocaleString();
};

function formatDate(date) {
    if (!date) return null;
    let monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();
    let hour = date.getHours();
    let min = date.getMinutes();
    // let sec = date.getSeconds();

    return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + hour + ':' + min;
}

function getMonth(code) {
    switch (code) {
        case 1:
            return "January";
        case 2:
            return "February";
        case 3:
            return "March";
        case 4:
            return "April";
        case 5:
            return "May";
        case 6:
            return "June";
        case 7:
            return "July";
        case 8:
            return "August";
        case 9:
            return "September";
        case 10:
            return "October";
        case 11:
            return "November";
        case 12:
            return "December";
    }
}

function formToJson(form, cb) {
    let isSuccess = true;
    let data = form.serializeObject(function (success) {
        isSuccess = success;
    });
    cb(isSuccess, data);
}

$.fn.serializeObject = function (cb, highlightError) {
    let o = {};
    let f = $(this);
    let success = true;
    highlightError = highlightError || true;
    $(this).find('input[type="hidden"], input[type="number"], input[type="email"], input[type="text"], input[type="password"], input[type="checkbox"]:checked, input[type="radio"]:checked, select, textarea')
        .each(
            function () {
                if (this.name === null || this.name === undefined
                    || this.name === '')
                    return;
                let isArrayEle = f.find('[name="' + this.name + '"]').length > 1;
                let required = $(this)[0].hasAttribute('required');
                let isDateTime = $(this).hasClass('datetimepicker');
                let elemValue = null;

                if ($(this).is('select')) {
                    elemValue = $(this).find('option:selected').val();
                    if (!elemValue) elemValue = '';
                } else if (this.type === "number") {
                    elemValue = this.value ? parseInt(this.value) : null;
                } else {
                    elemValue = this.value || '';
                }

                if ($(this).attr('outtype') === "number") {
                    elemValue = this.value ? parseInt(this.value) : null;
                }

                if (isDateTime) {
                    if (elemValue) {
                        elemValue = toDateObj(elemValue);
                        if (elemValue) {
                            elemValue = elemValue.toISOString().split('T')[0] + ' ' + elemValue.toTimeString().split(' ')[0];
                        } else {
                            elemValue = null;
                        }
                    } else {
                        elemValue = null;
                    }
                }

                if (required) {
                    let valid = !(elemValue == null || elemValue === "");
                    if (success) {
                        success = valid;
                    }
                    if (highlightError && !valid) {
                        $(this).triggerError();
                    }
                }

                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(elemValue);
                } else {
                    if (isArrayEle) {
                        o[this.name] = [elemValue];
                    } else {
                        o[this.name] = elemValue;
                    }
                }
            });
    if (cb) cb(success);
    return o;
};

function convertTimeFormat(format, str) {
    let hours = Number(str.match(/^(\d+)/)[1]);
    let minutes = Number(str.match(/:(\d+)/)[1]);
    let AMPM = str.match(/\s?([AaPp][Mm]?)$/)[1];
    let pm = ['P', 'p', 'PM', 'pM', 'pm', 'Pm'];
    let am = ['A', 'a', 'AM', 'aM', 'am', 'Am'];
    if (pm.indexOf(AMPM) >= 0 && hours < 12) hours = hours + 12;
    if (am.indexOf(AMPM) >= 0 && hours == 12) hours = hours - 12;
    let sHours = hours.toString();
    let sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    if (format == '0000') {
        return (sHours + sMinutes);
    } else if (format == '00:00') {
        return (sHours + ":" + sMinutes);
    } else {
        return false;
    }
}

function toDateObj(dateStr) {
    const eleSplit = dateStr.split(" ");
    const [day, month, year] = eleSplit[0].trim().split("/");
    const tt = eleSplit[2];
    const hhmm = eleSplit[1].trim();
    const [hour, min] = convertTimeFormat("00:00", hhmm + " " + tt).split(":");
    return new Date(year, month - 1, day, hour, min, 0);
}

$.fn.triggerError = function () {
    let ele = $(this);
    ele.prop('enabled', false);
    ele.addClass('bounce');
    setTimeout(function () {
        ele.prop('enabled', true);
        ele.removeClass('bounce');
    }, 3000);
};

$.fn.checkRequired = function () {
    $(this).find('input, select, textarea').each(function () {
        if ($(this)[0].hasAttribute('required')) {
            let label = $(this).parent().find('label');
            if (!label.hasClass('reequired')) label.addClass('required');
        }
    });
};

function showConfirmationDialog(title, body, cb, submitText, icon) {
    submitText = submitText || "Submit";
    let modal = $("#confirmation-dialog");
    modal.find('.modal-title').text(title);
    modal.find('.body').text(body);
    modal.find('.icon').removeClass().addClass('icon');
    if (icon)
        modal.find('.icon').addClass("fas " + icon);
    modal.find('.btn-success').text(submitText);
    modal.find('.btn-success').off('click').on('click', (e) => {
        cb();
        modal.modal('hide');
    });
    modal.modal('show');
}

function getFileFromUrl(url, name, cb, defaultType = 'image/jpeg') {
    $.ajax({
        url:url,
        dataType: 'binary',
        xhrFields: {
            withCredentials: true,
            'responseType': 'blob'
        },
        crossDomain: true,
        success: function(blob, status, xhr) {
            let urlBlob = URL.createObjectURL(blob);
            console.log(blob);
            console.log(urlBlob);
            let res = new File([blob], name, {
                type: blob.type || defaultType,
            });
            console.log(res);
            cb(res);
        }
    });
    // let req = new XMLHttpRequest();
    // req.open("GET", url, true);
    // req.responseType = "blob";
    // req.withCredentials = true;
    //
    // req.onload = function (event) {
    //     let blob = req.response;
    //     console.log(blob);
    //     let res = new File([blob], name, {
    //         type: blob.type || defaultType,
    //     });
    //     console.log(res);
    //     cb(res);
    // };
    //
    // req.send();
    // const response = await fetch(url, {
    //     mode: 'cors',
    //     headers: {
    //         'Access-Control-Allow-Origin':'*'
    //     }
    // })
    // const data = await response.blob()
    // return new File([data], name, {
    //     type: data.type || defaultType,
    // })
}

function uploadFile(file, cb) {
    if(!file) return cb(null, null);
    let formData = new FormData();
    formData.append("file", file);
    $.ajax({
        url: apiUrl + "upload",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
            cb(null, res);
        }, error: function (err) {
            console.error("ERR:", err);
            cb(err.message);
        }
    });
}