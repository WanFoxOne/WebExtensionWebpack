import "../static/scss/main.scss";
import "uikit";

const leftPad = require("left-pad");
const https = require("https");

const resultNode = document.getElementById("result");
const textNode = document.getElementById("text");
const amountNode = document.getElementById("amount");
const withNode = document.getElementById("with");

window.onload(function () {
    console.log("INIT");
    resultNode.value = "test";
});


// let options = {
//     host: "https://www.googleapis.com/youtube/v3/",
//     port: 80,
//     path: "/videos?id=7lCDEYXw3mM&key=AIzaSyCIN44xK5bACEwbaWDOWz3_zY2F1uSI7YM&part=snippet,contentDetails,statistics,status",
//     method: "POST"
// };
//
// https.request(options, function(res) {
//     console.log("STATUS: " + res.statusCode);
//     console.log("HEADERS: " + JSON.stringify(res.headers));
//     res.setEncoding("utf8");
//     res.on("data", function (chunk) {
//         console.log("BODY: " + chunk);
//     });
// }).end();



// document.getElementById("leftpad-form").addEventListener("submit", (e) => {
//     e.preventDefault();
//     resultNode.value = leftPad(textNode.value, amountNode.valueAsNumber, withNode.value);
// }, false);
//
// document.getElementById("pad-bg").addEventListener("click", (e) => {
//     let sendingMessage = browser.runtime.sendMessage({
//         text: textNode.value,
//         amount: amountNode.valueAsNumber,
//         with: withNode.value
//     });
//     sendingMessage.then((result) => {
//         resultNode.value = result;
//     });
// });
