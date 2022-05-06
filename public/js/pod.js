let countTN = 1;
let createTable = 0;
let endLoop = 0;
let countContent = 0;

var responsetn = '';
var json_responsetn = '';

const trackingNumA = [];
const contactNameA = [];
const addressA = [];
const phoneA = [];
const valueA = [];

//create table
let table = document.createElement('table');
table.setAttribute("id", "tasklisttable");
table.setAttribute("border", "1");
table.setAttribute('contenteditable', true);
table.className = "table table-striped table-hover table-bordered table-responsive";
let thead = document.createElement('thead');
let tbody = document.createElement('tbody');
tbody.setAttribute('name', 'contents')

table.appendChild(thead);
table.appendChild(tbody);

document.getElementById('tasklist').appendChild(table);

function checkTrackingNum(field, autoMove) {
    endLoop = 0;
    if (field.value.length >= field.maxLength) {
        document.getElementById("wronginput").style.display = 'none';
        if ((countTN == 1) && (createTable == 0)) {

            var request = new XMLHttpRequest();
            request.open('POST', 'https://api.tookanapp.com/v2/get_job_details');
            request.setRequestHeader('Content-Type', 'application/json');

            request.onreadystatechange = function () {
                if ((this.readyState === 4) && (createTable == 0)) {
                    console.log('Status:', this.status);
                    console.log('Headers:', this.getAllResponseHeaders());
                    console.log('Body:', this.responseText);

                    responsetn = this.responseText;
                    json_responsetn = JSON.parse(responsetn);

                    if (json_responsetn.status != 404) {
                        document.getElementById(autoMove).focus();

                        // Creating and adding data to first row of the table
                        let row_h = document.createElement('tr');
                        let row_h_data_1 = document.createElement('th');
                        row_h_data_1.innerHTML = "DATE OF POD: ";
                        let row_h_data_2 = document.createElement('td');
                        row_h_data_2.innerHTML = document.getElementById("dateCreate").value;
                        let row_h_data_3 = document.createElement('th');
                        row_h_data_3.innerHTML = "AREA: ";
                        let row_h_data_4 = document.createElement('td');
                        row_h_data_4.innerHTML = document.getElementById("areaCode").value;
                        /* row_h_data_4.setAttribute('colspan', '7'); */
                        let row_h_data_5 = document.createElement('th');
                        row_h_data_5.innerHTML = "MADE BY: ";
                        let row_h_data_6 = document.createElement('td');
                        row_h_data_6.innerHTML = document.getElementById("madeBy").value;
                        let row_h_data_7 = document.createElement('th');
                        row_h_data_7.innerHTML = "DISPATCHER NAME: ";
                        let row_h_data_8 = document.createElement('td');
                        row_h_data_8.innerHTML = document.getElementById("agentName").value;
                        let row_h_data_9 = document.createElement('th');
                        row_h_data_9.innerHTML = "DATE OF DELIVERY: ";
                        let row_h_data_10 = document.createElement('td');
                        row_h_data_10.innerHTML = document.getElementById("dateAssign").value

                        row_h.appendChild(row_h_data_1);
                        row_h.appendChild(row_h_data_2);
                        row_h.appendChild(row_h_data_3);
                        row_h.appendChild(row_h_data_4);
                        row_h.appendChild(row_h_data_5);
                        row_h.appendChild(row_h_data_6);
                        row_h.appendChild(row_h_data_7);
                        row_h.appendChild(row_h_data_8);
                        row_h.appendChild(row_h_data_9);
                        row_h.appendChild(row_h_data_10);
                        thead.appendChild(row_h);

                        let row_1 = document.createElement('tr');
                        let heading_1 = document.createElement('th');
                        heading_1.innerHTML = "No.";
                        let heading_2 = document.createElement('th');
                        heading_2.innerHTML = "P/N";
                        let heading_3 = document.createElement('th');
                        heading_3.innerHTML = "ITEM WITH ME";
                        let heading_4 = document.createElement('th');
                        heading_4.innerHTML = "Task ID";
                        let heading_5 = document.createElement('th');
                        heading_5.innerHTML = "Contact Name";
                        let heading_6 = document.createElement('th');
                        heading_6.innerHTML = "Address";
                        let heading_7 = document.createElement('th');
                        heading_7.innerHTML = "Phone";
                        let heading_8 = document.createElement('th');
                        heading_8.innerHTML = "Price";
                        let heading_9 = document.createElement('th');
                        heading_9.innerHTML = "Amount Collected";
                        let heading_10 = document.createElement('th');
                        heading_10.innerHTML = "I have uploaded the BT";

                        row_1.appendChild(heading_1);
                        row_1.appendChild(heading_2);
                        row_1.appendChild(heading_3);
                        row_1.appendChild(heading_4);
                        row_1.appendChild(heading_5);
                        row_1.appendChild(heading_6);
                        row_1.appendChild(heading_7);
                        row_1.appendChild(heading_8);
                        row_1.appendChild(heading_9);
                        row_1.appendChild(heading_10);
                        thead.appendChild(row_1);

                        var row_2 = document.createElement('tr');

                        var row_2_data_1 = document.createElement('td');
                        row_2_data_1.innerHTML = countTN;
                        var row_2_data_2 = document.createElement('td');
                        row_2_data_2.innerHTML = json_responsetn.data[0].order_id;
                        var row_2_data_3 = document.createElement('td');
                        var row_2_data_4 = document.createElement('td');
                        row_2_data_4.innerHTML = json_responsetn.data[0].job_id;
                        var row_2_data_5 = document.createElement('td');
                        row_2_data_5.innerHTML = json_responsetn.data[0].customer_username;
                        var row_2_data_6 = document.createElement('td');
                        row_2_data_6.innerHTML = json_responsetn.data[0].job_address;
                        var row_2_data_7 = document.createElement('td');
                        row_2_data_7.innerHTML = json_responsetn.data[0].customer_phone;
                        var row_2_data_8 = document.createElement('td');
                        row_2_data_8.innerHTML = "$" + json_responsetn.data[0].job_description;
                        var row_2_data_9 = document.createElement('td');
                        var row_2_data_10 = document.createElement('td');

                        row_2.appendChild(row_2_data_1);
                        row_2.appendChild(row_2_data_2);
                        row_2.appendChild(row_2_data_3);
                        row_2.appendChild(row_2_data_4);
                        row_2.appendChild(row_2_data_5);
                        row_2.appendChild(row_2_data_6);
                        row_2.appendChild(row_2_data_7);
                        row_2.appendChild(row_2_data_8);
                        row_2.appendChild(row_2_data_9);
                        row_2.appendChild(row_2_data_10);
                        tbody.appendChild(row_2);

                        trackingNumA[countContent] = json_responsetn.data[0].job_id;
                        contactNameA[countContent] = json_responsetn.data[0].customer_username;
                        addressA[countContent] = json_responsetn.data[0].job_address;
                        phoneA[countContent] = json_responsetn.data[0].job_address;
                        valueA[countContent] = "$" + json_responsetn.data[0].job_description;

                        var tnInput = document.createElement('input');
                        tnInput.setAttribute('type', 'text');
                        tnInput.setAttribute('class', 'text-field w-input');
                        tnInput.setAttribute('name', 'trackingNumC');
                        tnInput.setAttribute('id', 'trackingNumC' + (countContent + 1));
                        tnInput.setAttribute('value', json_responsetn.data[0].job_id);
                        document.getElementById("trackingNumberDetailsArea").appendChild(tnInput);

                        var tnInput = document.createElement('input');
                        tnInput.setAttribute('type', 'text');
                        tnInput.setAttribute('class', 'text-field w-input');
                        tnInput.setAttribute('name', 'contactNameC');
                        tnInput.setAttribute('id', 'contactNameC' + (countContent + 1));
                        tnInput.setAttribute('value', json_responsetn.data[0].customer_username);
                        document.getElementById("trackingNumberDetailsArea").appendChild(tnInput);

                        var tnInput = document.createElement('input');
                        tnInput.setAttribute('type', 'text');
                        tnInput.setAttribute('class', 'text-field w-input');
                        tnInput.setAttribute('name', 'addressC');
                        tnInput.setAttribute('id', 'addressC' + (countContent + 1));
                        tnInput.setAttribute('value', json_responsetn.data[0].job_address);
                        document.getElementById("trackingNumberDetailsArea").appendChild(tnInput);

                        var tnInput = document.createElement('input');
                        tnInput.setAttribute('type', 'text');
                        tnInput.setAttribute('class', 'text-field w-input');
                        tnInput.setAttribute('name', 'phoneC');
                        tnInput.setAttribute('id', 'phoneC' + (countContent + 1));
                        tnInput.setAttribute('value', json_responsetn.data[0].customer_phone);
                        document.getElementById("trackingNumberDetailsArea").appendChild(tnInput);

                        var tnInput = document.createElement('input');
                        tnInput.setAttribute('type', 'text');
                        tnInput.setAttribute('class', 'text-field w-input');
                        tnInput.setAttribute('name', 'valueC');
                        tnInput.setAttribute('id', 'valueC' + (countContent + 1));
                        tnInput.setAttribute('value', "$" + json_responsetn.data[0].job_description);
                        document.getElementById("trackingNumberDetailsArea").appendChild(tnInput);

                        countTN = countTN + 1;
                        createTable = 1;
                        countContent = countContent + 1;

                        document.getElementById("trackingNumber").value = "";
                    }

                    if (json_responsetn.status == 404) {
                        document.getElementById("trackingNumber").value = "";
                        document.getElementById("loading").style.display = 'none';
                        document.getElementById("wronginput").style.display = 'block';
                    }
                }
            };

            var body = {
                'api_key': '51676580f24b091114132d38111925401ee4c2f328d978375e1f03',
                'job_ids': [document.getElementById("trackingNumber").value],
                'include_task_history': 0
            };
            request.send(JSON.stringify(body));
        }

        if ((countTN > 1) && (createTable > 0)) {

            var request = new XMLHttpRequest();
            request.open('POST', 'https://api.tookanapp.com/v2/get_job_details');
            request.setRequestHeader('Content-Type', 'application/json');

            request.onreadystatechange = function () {
                if ((this.readyState === 4) && (endLoop == 0)) {
                    console.log('Status:', this.status);
                    console.log('Headers:', this.getAllResponseHeaders());
                    console.log('Body:', this.responseText);

                    responsetn = this.responseText;
                    json_responsetn = JSON.parse(responsetn);

                    if (json_responsetn.status != 404) {
                        document.getElementById(autoMove).focus();

                        var row_2 = document.createElement('tr');

                        var row_2_data_1 = document.createElement('td');
                        row_2_data_1.innerHTML = countTN;
                        var row_2_data_2 = document.createElement('td');
                        row_2_data_2.innerHTML = json_responsetn.data[0].order_id;
                        var row_2_data_3 = document.createElement('td');
                        var row_2_data_4 = document.createElement('td');
                        row_2_data_4.innerHTML = json_responsetn.data[0].job_id;
                        var row_2_data_5 = document.createElement('td');
                        row_2_data_5.innerHTML = json_responsetn.data[0].customer_username;
                        var row_2_data_6 = document.createElement('td');
                        row_2_data_6.innerHTML = json_responsetn.data[0].job_address;
                        var row_2_data_7 = document.createElement('td');
                        row_2_data_7.innerHTML = json_responsetn.data[0].customer_phone;
                        var row_2_data_8 = document.createElement('td');
                        row_2_data_8.innerHTML = "$" + json_responsetn.data[0].job_description;
                        var row_2_data_9 = document.createElement('td');
                        var row_2_data_10 = document.createElement('td');

                        row_2.appendChild(row_2_data_1);
                        row_2.appendChild(row_2_data_2);
                        row_2.appendChild(row_2_data_3);
                        row_2.appendChild(row_2_data_4);
                        row_2.appendChild(row_2_data_5);
                        row_2.appendChild(row_2_data_6);
                        row_2.appendChild(row_2_data_7);
                        row_2.appendChild(row_2_data_8);
                        row_2.appendChild(row_2_data_9);
                        row_2.appendChild(row_2_data_10);
                        tbody.appendChild(row_2);

                        trackingNumA[countContent] = json_responsetn.data[0].job_id;
                        contactNameA[countContent] = json_responsetn.data[0].customer_username;
                        addressA[countContent] = json_responsetn.data[0].job_address;
                        phoneA[countContent] = json_responsetn.data[0].job_address;
                        valueA[countContent] = "$" + json_responsetn.data[0].job_description;

                        var tnInput = document.createElement('input');
                        tnInput.setAttribute('type', 'text');
                        tnInput.setAttribute('class', 'text-field w-input');
                        tnInput.setAttribute('name', 'trackingNumC');
                        tnInput.setAttribute('id', 'trackingNumC' + (countContent + 1));
                        tnInput.setAttribute('value', json_responsetn.data[0].job_id);
                        document.getElementById("trackingNumberDetailsArea").appendChild(tnInput);

                        var tnInput = document.createElement('input');
                        tnInput.setAttribute('type', 'text');
                        tnInput.setAttribute('class', 'text-field w-input');
                        tnInput.setAttribute('name', 'contactNameC');
                        tnInput.setAttribute('id', 'contactNameC' + (countContent + 1));
                        tnInput.setAttribute('value', json_responsetn.data[0].customer_username);
                        document.getElementById("trackingNumberDetailsArea").appendChild(tnInput);

                        var tnInput = document.createElement('input');
                        tnInput.setAttribute('type', 'text');
                        tnInput.setAttribute('class', 'text-field w-input');
                        tnInput.setAttribute('name', 'addressC');
                        tnInput.setAttribute('id', 'addressC' + (countContent + 1));
                        tnInput.setAttribute('value', json_responsetn.data[0].job_address);
                        document.getElementById("trackingNumberDetailsArea").appendChild(tnInput);

                        var tnInput = document.createElement('input');
                        tnInput.setAttribute('type', 'text');
                        tnInput.setAttribute('class', 'text-field w-input');
                        tnInput.setAttribute('name', 'phoneC');
                        tnInput.setAttribute('id', 'phoneC' + (countContent + 1));
                        tnInput.setAttribute('value', json_responsetn.data[0].customer_phone);
                        document.getElementById("trackingNumberDetailsArea").appendChild(tnInput);

                        var tnInput = document.createElement('input');
                        tnInput.setAttribute('type', 'text');
                        tnInput.setAttribute('class', 'text-field w-input');
                        tnInput.setAttribute('name', 'valueC');
                        tnInput.setAttribute('id', 'valueC' + (countContent + 1));
                        tnInput.setAttribute('value', "$" + json_responsetn.data[0].job_description);
                        document.getElementById("trackingNumberDetailsArea").appendChild(tnInput);

                        endLoop = endLoop + 1;
                        countTN = countTN + 1;
                        countContent = countContent + 1;

                        document.getElementById("trackingNumber").value = "";
                    }

                    if (json_responsetn.status == 404) {
                        document.getElementById("trackingNumber").value = "";
                        document.getElementById("loading").style.display = 'none';
                        document.getElementById("wronginput").style.display = 'block';
                    }
                }
            };

            var body = {
                'api_key': '51676580f24b091114132d38111925401ee4c2f328d978375e1f03',
                'job_ids': [document.getElementById("trackingNumber").value],
                'include_task_history': 0
            };
            request.send(JSON.stringify(body));
        }
    }
}

document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById("podArea").style.display = 'none';
    document.getElementById("trackingNumberDetailsArea").style.display = 'none';
    document.getElementById("inputTnArea").style.display = 'none';
    document.getElementById("excelDbArea").style.display = 'none';
    document.getElementById("loading").style.display = 'none';
    document.getElementById("wronginput").style.display = 'none';

    document.getElementById("submitPodInfoButton").addEventListener("click", createPODTemplate);
    document.getElementById("donePodButton").addEventListener("click", donePod);

    function createPODTemplate() {

        if ($("#podDateTemp").val().length == 0) {
            alert("Please do not leave the Date of POD field empty!");
        }

        if ($("#completionDateTemp").val().length == 0) {
            alert("Please do not leave the Date of Completion field empty!");
        }

        if ($("#areaCodeTemp").val().length == 0) {
            alert("Please do not leave the Area field empty!");
        }

        if ($("#podDoneByTemp").val().length == 0) {
            alert("Please do not leave the POD done field empty!");
        }

        if ($("#agentTemp").val().length == 0) {
            alert("Please do not leave the Agent field empty!");
        }

        if (($("#podDateTemp").val().length != 0) && ($("#completionDateTemp").val().length != 0)
            && ($("#areaCodeTemp").val().length != 0) && ($("#podDoneByTemp").val().length != 0)
            && ($("#agentTemp").val().length != 0)) {

            document.getElementById("dateCreate").value = document.getElementById("podDateTemp").value;
            document.getElementById("dateAssign").value = document.getElementById("completionDateTemp").value;
            document.getElementById("value").value = "$ N/A";
            document.getElementById("areaCode").value = document.getElementById("areaCodeTemp").value;
            document.getElementById("madeBy").value = document.getElementById("podDoneByTemp").value;
            document.getElementById("agent").value = document.getElementById("agentTemp").value;
            document.getElementById("parcel").value = "Temporary Parcel Number";
            document.getElementById("type").value = "Temporary Agent Class";
            document.getElementById("product").value = document.getElementById("formMETHOD").value;

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

            if (document.getElementById("agentTemp").value == "1003154") {
                document.getElementById("agentName").value = "IFR DYLAN";
            }

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
            document.getElementById("dateTimeClose").value = document.getElementById("dateAssign").value + ' ' + timeClose;

            //getSubmittedDate
            var podDay = "";
            var podMonth = "";
            var podToday = new Date();

            if (podToday.getDate() < 10) {
                podDay = "0" + podToday.getDate();
            }

            if (podToday.getDate() >= 10) {
                podDay = podToday.getDate();
            }

            if (podToday.getMonth() < 9) {
                podMonth = "0" + (podToday.getMonth() + 1);
            }

            if (podToday.getMonth() >= 9) {
                podMonth = (podToday.getMonth() + 1);
            }

            var podDate = podDay + podMonth + podToday.getFullYear();

            var ampmhour = '';
            var ampmmin = '';

            if (podToday.getHours() < 10) {
                ampmhour = "0" + (podToday.getHours());
            }

            if (podToday.getHours() >= 10) {
                ampmhour = (podToday.getHours());
            }

            if (podToday.getMinutes() < 10) {
                ampmmin = "0" + (podToday.getMinutes());
            }

            if (podToday.getMinutes() >= 10) {
                ampmmin = (podToday.getMinutes());
            }

            document.getElementById("podRef").value = "ZAL/GR/POD/" + document.getElementById("areaCode").value + "/" + podDate + ampmhour + ampmmin;

            document.getElementById("trackingNumber").focus();

            document.getElementById("podInfoArea").style.display = 'none';
            document.getElementById("podArea").style.display = 'block';
            document.getElementById("inputTnArea").style.display = 'block';
        }
    }

    function donePod() {
        document.getElementById("tasklisttable").contentEditable = false;

        document.getElementById("trackingNumA").value = trackingNumA;
        document.getElementById("contactNameA").value = contactNameA;
        document.getElementById("addressA").value = addressA;
        document.getElementById("phoneA").value = phoneA;
        document.getElementById("valueA").value = valueA;

        document.getElementById("excelDbArea").style.display = 'block';
        document.getElementById("inputTnArea").style.display = 'none';
    }

    document.addEventListener("submit", function (event) {
        event.preventDefault();

        let countFinalTN = $('[name=trackingNumC]').length;

        for (let i = 0; i < countFinalTN; i++) {
            var assignTaskToAgent = 0;
            var assignDateTimeToTask = 0;

            var checkTN = document.getElementById("trackingNumC" + (i + 1)).value;

            var request = new XMLHttpRequest();

            if (assignTaskToAgent == 0) {
                request.open('POST', 'https://api.tookanapp.com/v2/assign_task');
                request.setRequestHeader('Content-Type', 'application/json');

                request.onreadystatechange = function () {
                    if ((this.readyState === 4) && (assignTaskToAgent == 0)) {
                        console.log('Status:', this.status);
                        console.log('Headers:', this.getAllResponseHeaders());
                        console.log('Body:', this.responseText);

                        request.open('POST', 'https://api.tookanapp.com/v2/change_job_date');
                        request.setRequestHeader('Content-Type', 'application/json');

                        request.onreadystatechange = function () {
                            if ((this.readyState === 4) && (assignDateTimeToTask == 0)) {
                                console.log('Status:', this.status);
                                console.log('Headers:', this.getAllResponseHeaders());
                                console.log('Body:', this.responseText);

                                assignDateTimeToTask = 1;
                            }
                        };

                        var body = {
                            'api_key': '51676580f24b091114132d38111925401ee4c2f328d978375e1f03',
                            "job_ids": [checkTN],
                            'layout_type': 0,
                            'start_time': document.getElementById("dateTime").value,
                            'end_time': document.getElementById("dateTimeClose").value
                        };
                        request.send(JSON.stringify(body));

                        assignTaskToAgent = 1;
                    }
                };

                var body = {
                    'api_key': '51676580f24b091114132d38111925401ee4c2f328d978375e1f03',
                    'job_id': checkTN,
                    'fleet_id': document.getElementById("agent").value,
                    'job_status': '0'
                };
                request.send(JSON.stringify(body));
            }
        }

        document.getElementById("pod").submit();
    });
});
