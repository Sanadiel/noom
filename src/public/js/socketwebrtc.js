const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const call = document.getElementById("call");

//call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName = "RequestRoom1";
let myPeerConnection;
let myDataChannel;



async function getMedia(deviceId) {
  const initialConstrains = {
    audio: true,
    video: false
  };
  const cameraConstraints = {
    audio: true,
    video: false
    //video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstrains
    );
    if(myStream)
    {
      console.log(myStream.getAudioTracks()[0]);
      var audio = document.createElement('audio');
      audio.src = URL.createObjectURL(myStream);
      document.body.appendChild(audio);
      audio.controls = true;
      audio.play();
            //document.body.appendChild(audio);
      //myFace.src = myStream.getAudioTracks()[0];
      
    }
     
    // if (!deviceId) {
    //   await getCameras();
    // }
  } catch (e) {
    console.log(e);
  }
}

function handleMuteClick() {
  if(myStream)
  {
    myStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));

    console.log(myStream.getAudioTracks());
  }
    
  if (!muted) {
    //muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    //muteBtn.innerText = "Mute";
    muted = false;
  }
}

function mute_click(event) {
  event.currentTarget.classList.toggle("active");
  handleMuteClick();
}

// async function handleCameraChange() {
//   await getMedia(camerasSelect.value);//카메라 셀렉하는 부분에서 텍스트값?
//   if (myPeerConnection) {
//     const videoTrack = myStream.getVideoTracks()[0];
//     const videoSender = myPeerConnection
//       .getSenders()
//       .find((sender) => sender.track.kind === "video");
//     videoSender.replaceTrack(videoTrack);
//   }
// }

//muteBtn.addEventListener("click", handleMuteClick);
//camerasSelect.addEventListener("input", handleCameraChange);

// Welcome Form (join a room)

const welcome = document.getElementById("welcome");
//const welcomeForm = welcome.querySelector("form");

async function initCall() {
  //welcome.hidden = true;
  //call.hidden = false;
  await getMedia();
  makeConnection();
}

async function handleWelcomeSubmit() {
  //event.preventDefault();
  //const input = welcomeForm.querySelector("input");
  await initCall();
  socket.emit("join_room", roomName);
}

handleWelcomeSubmit();
//welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket Code

socket.on("welcome", async (visiter) => {
  addMessage_Welcome(visiter);
  
  //addMessage(`${user} arrived!`);
  myDataChannel = myPeerConnection.createDataChannel("chat");
  myDataChannel.addEventListener("message", (event) => console.log(event.data));
  console.log("made data channel");
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log("sent the offer");
  socket.emit("offer", offer, roomName);
});

socket.on("offer", async (offer) => {
  myPeerConnection.addEventListener("datachannel", (event) => {
    myDataChannel = event.channel;
    myDataChannel.addEventListener("message", (event) =>
      console.log(event.data)
    );
  });
  console.log("received the offer");
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
  console.log("sent the answer");
});

socket.on("answer", (answer) => {
  console.log("received the answer");
  myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", (ice) => {
  console.log("received candidate");
  myPeerConnection.addIceCandidate(ice);
});

// RTC Code

function makeConnection() {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });
  myPeerConnection.addEventListener("icecandidate", handleIce);
  myPeerConnection.addEventListener("addstream", handleAddStream);

  if(myStream)
    myStream
      .getAudioTracks()//.getTracks()
      .forEach((track) => myPeerConnection.addTrack(track, myStream));

  //console.log()
}

function handleIce(data) {
  console.log("sent candidate");
  socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data) {
  const peerFace = document.getElementById("peerFace");
  peerFace.srcObject = data.stream;
}

function submitText(event) {
  event.preventDefault();

  const TexttoSub = document.getElementById("bot_chat_input");
  const value = TexttoSub.value;  
  socket.emit("new_message", TexttoSub.value, roomName, () => {
    addMyMessage(`${value}`);
  });
  // addMessage(`You: ${value}`);

  TexttoSub.value = "";
}

// socket.on("new_message", addMessage);
socket.on("new_message", (NickName, msg, time) => {
  addMessage(NickName, msg, time);
  //myPeerConnection.addIceCandidate(ice);
});

