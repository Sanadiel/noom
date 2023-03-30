// const webSocket = new WebSocket("ws://192.168.0.188:8080");//192.168.0.188:8080
        
// webSocket.onopen = function () 
// {
//     console.log('서버와 웹 소켓 연결됨');
// };

// webSocket.onmessage = function (event) {
//     console.log(`서버 웹소켓에게 받은 데이터: ${event.data}`);
// }

function focus_iframe() {
    // document.getElementById("iframe_container").contentWindow.document.body.onclick = function() {
    //     document.getElementById("iframeStream").contentWindow.focus();
    //     console.log("execute focus");
    // }onclick="load_iframe()"

    console.log("load call");
    document.getElementById("iframeStream").contentWindow.focus();
}

function button_home() {
    //건물개요로 이동
    Level_Control(0);
}

function button_share() {

}

function button_import() {

}

function button_question() {

}

function button_logout() {
    location.href = `/auth/logout`;
}

function Level_Control(level) {
    // document.getElementById("iframeStream").contentWindow.
    document.getElementById("iframeStream").contentWindow.emitUIInteraction(level);
}

let Chat_container;// = document.getElementById("flex-container");
let username = 'Sana';

function load(Name) {
    //username = name;
    username = Name;
    Chat_container = document.getElementById("flex-container_inner");
    appendChatLog("Towa", "라면먹고 싶다", "23:00")
}

function appendChatLog(who, logText, time) {    

    if(Chat_container.scrollHeight === Math.ceil(Chat_container.scrollTop+Chat_container.offsetHeight))
    {
        DocuAppendChatMessage(who, logText, time);

        Chat_container.scrollTop = Chat_container.scrollheight;
    }
    else
    {
        DocuAppendChatMessage(who, logText, time);
    }

}

function DocuAppendChatMessage(who, logText, time)
{
    if(who == username){
        const divElement = document.createElement("div");
        divElementother.className = "message-row message-row--own";
        divElement.innerHTML =
        `<div class="message-row__content">
            <div class="message__info">
                <span class="message__bubble">
                    [${who}] <br>
                    ${logText} </span>
                <span class="message__time">${time}</span>
            </div>
        </div>`
        Chat_container.append(divElement);
    }
    else
    {
        const divElementother = document.createElement("div");
        divElementother.className = "message-row";
        divElementother.innerHTML =        
        `<div class="message-row__content">                          
          <div class="message__info">
            <span class="message__bubble">
                [${who}] <br>
                ${logText} </span>
            <span class="message__time">${time}</span>
          </div>
        </div>`
        Chat_container.append(divElementother);
    }
}

function appendChatLog_Welcome(name) {

}