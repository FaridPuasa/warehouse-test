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

        var assignTaskToAgent = 0;
        var assignDateTimeToTask = 0;

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

        if (document.getElementById("agentTemp").value == "994634") {
            document.getElementById("agentName").value = "FD SOWDEQ";
        }

        if (document.getElementById("agentTemp").value == "997381") {
            document.getElementById("agentName").value = "FD RAHIM";
        }

        if (document.getElementById("agentTemp").value == "1029275") {
            document.getElementById("agentName").value = "FD AIMI";
        }

        if (document.getElementById("agentTemp").value == "1050947") {
            document.getElementById("agentName").value = "FD HASBUL";
        }

        if (document.getElementById("agentTemp").value == "1071388") {
            document.getElementById("agentName").value = "FD FADARUS";
        }

        if (document.getElementById("agentTemp").value == "1079095") {
            document.getElementById("agentName").value = "FD HAMIDIN";
        }

        if (document.getElementById("agentTemp").value == "1113078") {
            document.getElementById("agentName").value = "FD HANAFI";
        }

        if (document.getElementById("agentTemp").value == "1230427") {
            document.getElementById("agentName").value = "FD FAEZ";
        }

        if (document.getElementById("agentTemp").value == "1254189") {
            document.getElementById("agentName").value = "FDZUL";
        }

        if (document.getElementById("agentTemp").value == "1130495") {
            document.getElementById("agentName").value = "EFR HAJID";
        }

        if (document.getElementById("agentTemp").value == "1130524") {
            document.getElementById("agentName").value = "EFR FAKHRIAH";
        }

        if (document.getElementById("agentTemp").value == "1268554") {
            document.getElementById("agentName").value = "EFR GHAFUR";
        }

        if (document.getElementById("agentTemp").value == "1106491") {
            document.getElementById("agentName").value = "EFR RASHID";
        }

        if (document.getElementById("agentTemp").value == "1105549") {
            document.getElementById("agentName").value = "EFR NAZRY";
        }

        if (document.getElementById("agentTemp").value == "1124160") {
            document.getElementById("agentName").value = "EFR HANIZAN";
        }

        if (document.getElementById("agentTemp").value == "996642") {
            document.getElementById("agentName").value = "IFR ZIZAH";
        }

        if (document.getElementById("agentTemp").value == "977110") {
            document.getElementById("agentName").value = "IFR NAN";
        }

        if (document.getElementById("agentTemp").value == "1268557") {
            document.getElementById("agentName").value = "EFR KHAIRUL";
        }

        if (document.getElementById("agentTemp").value == "1311747") {
            document.getElementById("agentName").value = "FD IQBAL";
        }

        if (document.getElementById("agentTemp").value == "1166672") {
            document.getElementById("agentName").value = "FD AZRI";
        }

        if (document.getElementById("agentTemp").value == "1290342") {
            document.getElementById("agentName").value = "IFR UMAR";
        }

        if (document.getElementById("agentTemp").value == "1276415") {
            document.getElementById("agentName").value = "IFR ZUDIN";
        }

        if (document.getElementById("agentTemp").value == "1295953") {
            document.getElementById("agentName").value = "EFR ROSMAWATI";
        }

        if (document.getElementById("agentTemp").value == "1104714") {
            document.getElementById("agentName").value = "IFR AQEELAH";
        }

        if (document.getElementById("agentTemp").value == "1303254") {
            document.getElementById("agentName").value = "FD HAFIZ";
        }

        if (document.getElementById("agentTemp").value == "1140555") {
            document.getElementById("agentName").value = "EFR ASIKIN";
        }

        if (document.getElementById("agentTemp").value == "1359048") {
            document.getElementById("agentName").value = "FD SAIFUDDIN";
        }

        if (document.getElementById("agentTemp").value == "1358816") {
            document.getElementById("agentName").value = "FD AMIN";
        }

        if (document.getElementById("agentTemp").value == "1354406") {
            document.getElementById("agentName").value = "EFR ISMADY";
        }

        if (document.getElementById("agentTemp").value == "1362520") {
            document.getElementById("agentName").value = "EFR AMALIA";
        }
        
        if (document.getElementById("agentTemp").value == "1352241") {
            document.getElementById("agentName").value = "EFR HAFIZ";
        }

        if (document.getElementById("agentTemp").value == "1358835") {
            document.getElementById("agentName").value = "EFR MDAMY";
        }

        if (document.getElementById("agentTemp").value == "1003154") {
            document.getElementById("agentName").value = "IFR DYLAN";
        }

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
