function checkTrackingNum(field, autoMove) {
    if (field.value.length >= field.maxLength) {
        document.getElementById("inputAgentArea").style.display = 'none';
        document.getElementById("inputTnArea").style.display = 'none';
        document.getElementById("completeTimeNotice").style.display = 'none';
        document.getElementById("loading").style.display = 'block';
        document.getElementById("wronginput").style.display = 'none';

        var jobidentitynum = '';
        jobidentitynum = document.getElementById("trackingNumber").value;
        document.getElementById("trackingNum").value = jobidentitynum;
        document.getElementById('trackingNumber').value = '';

        var today = new Date();
        var todayDate = "";
        var todayMonth = "";

        var nextMonth = (today.getMonth()) + 1;

        if (today.getDate() < 10) {
            todayDate = "0" + (today.getDate());
        }

        if (today.getDate() >= 10) {
            todayDate = (today.getDate());
        }

        if (nextMonth < 10) {
            todayMonth = "0" + (nextMonth);
        }

        if (nextMonth >= 10) {
            todayMonth = (nextMonth);
        }

        var date = today.getFullYear() + '-' + todayMonth + '-' + todayDate;
        var time = "01:00:00";
        var timeClose = "23:00:00";
        document.getElementById("dateTime").value = date + ' ' + time;
        document.getElementById("dateTimeClose").value = date + ' ' + timeClose;

        document.getElementById("agent").value = document.getElementById("agentTemp").value;

        document.getElementById(autoMove).focus();
        localStorage.setItem("lastAgent", document.getElementById("agent").value);
        document.getElementById("itemOut").submit();
    }
}

document.addEventListener("DOMContentLoaded", function (event) {
    // Retrieve
    document.getElementById("agentTemp").value = localStorage.getItem("lastAgent");
    
    document.getElementById("trackingNumber").focus();

    document.getElementById("loading").style.display = 'none';
    document.getElementById("wronginput").style.display = 'none';
});
