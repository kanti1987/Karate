
// UEP-42959
// lev - get input and the textarea values in onbeforeprint handler and pass them to the background script
window.onbeforeprint = function (event) {

    var content = "MyInputFieldValues, ";

    var values = [];
    var inputFields = document.getElementsByTagName('textarea');
    for (var i = 0; i < inputFields.length; i++) {
        values.push(inputFields[i].value);
    }

    inputFields = document.getElementsByTagName('input');
    for (var i = 0; i < inputFields.length; i++) {
        values.push(inputFields[i].value);
    }

    var content = content + values.join();

    chrome.runtime.sendMessage(
    content,
    function (response) {
        console.log(response);
    });
};
