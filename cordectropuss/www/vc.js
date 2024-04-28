mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));

// DEfault configuration - Change these if you have a different STUN or TURN server.
const configuration = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

let peerConnection = null;
let localStream = null;
let remoteStream = null;
let roomDialog = null;
let roomId = null;
var sid = localStorage.sid;
var sip = document.querySelector("#sip");
var sinvite = document.querySelector("#sinvite");
var ws;

function init() {
  document.querySelector('#cameraBtn').addEventListener('click', openUserMedia);
  document.querySelector('#hangupBtn').addEventListener('click', hangUp);
  document.querySelector('#createBtn').addEventListener('click', createRoom);
  document.querySelector('#joinBtn').addEventListener('click', joinRoom);
  roomDialog = new mdc.dialog.MDCDialog(document.querySelector('#room-dialog'));
}

function serverConnection() {
  let inviteCode = sinvite.value;
  let ip = [ // the first 8 characters are the ip address in hex form
      Number("0x"+inviteCode[0]+inviteCode[1]).toString(),
      Number("0x"+inviteCode[2]+inviteCode[3]).toString(),
      Number("0x"+inviteCode[4]+inviteCode[5]).toString(),
      Number("0x"+inviteCode[6]+inviteCode[7]).toString()].join(".");
  let ogip = ip;
  let port = 0;
  for (let c = 8; c + 2 < inviteCode.length; c++) {
      port = port * 16 + parseInt(inviteCode[c], 16);
  }
  let code = Number("0x"+inviteCode[inviteCode.length - 2]+inviteCode[inviteCode.length - 1]).toString();
  if (sip.value) ip = sip.value;
  let surl = ("wss://"+ip.toString()+":"+port.toString());
  ws = new WebSocket(surl);
  ws.onopen = () => {
    ws.send(JSON.stringify({
        eventType: "login",
        ogip: ogip,
        isVoiceChatRobot: true,
        code: code,
        sid: localStorage.sid // this poses a big security risk if you don't trust the owner of the server
    }));
  }
}

function fetchVoiceCallData() {
  return new Promise((res, rej) => {
    function onmessage(event) {
      let packet = JSON.parse(event.data);
      if (packet.eventType !== "messages") return;
      ws.removeEventListener("message", onmessage);
      if (packet.messages[0]) {
        if (packet.messages[0].content) {
          try {
            console.log(packet.messages[0].content);
            res(JSON.parse(packet.messages[0].content));
            return;
          } catch (e) {
            rej(e);
          }
        }
      }
      rej();
    }
    ws.addEventListener("message", onmessage);
    ws.send(JSON.stringify({
        eventType: "messageLoad",
        max: 1,
        start: 0
    }));
  });
}

function modifyVoiceCallData(newValue) {
  ws.send(JSON.stringify({
    eventType: "message",
    message: {
      content: JSON.stringify(newValue),
      sentByRobots: true,
      purposeOfSaidRobots: "global domination, of course :3"
    }
  }));
}

async function createRoom() {
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = true;

  console.log('Create PeerConnection with configuration: ', configuration);
  peerConnection = new RTCPeerConnection(configuration);

  registerPeerConnectionListeners();

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  const roomWithOffer = {
      offer: {
          type: offer.type,
          sdp: offer.sdp
      }
  }
  let vcdata = await fetchVoiceCallData();
  if (vcdata.rooms == undefined) vcdata.rooms = {};
  const roomId = `${Math.floor(Math.random()*(16^8)).toString(16)}`;
  vcdata.rooms[roomId] = roomWithOffer;
  document.querySelector('#currentRoom').innerText = `Current room is ${roomId} - You are the caller!`
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  if (!vcdata.rooms[roomId].callerCandidates) {
    vcdata.rooms[roomId].callerCandidates = [];
  }

  if (!vcdata.rooms[roomId].calleeCandidates) {
    vcdata.rooms[roomId].calleeCandidates = [];
  }

  peerConnection.addEventListener('icecandidate', event => {
    if (!event.candidate) {
      console.log('Got final candidate!');
      return;
    }
    console.log('Got candidate: ', event.candidate);
    vcdata.rooms[roomId].callerCandidates.push(event.candidate.toJSON());
    modifyVoiceCallData(vcdata);
  });

  peerConnection.addEventListener('track', event => {
    console.log('Got remote track:', event.streams[0]);
    event.streams[0].getTracks().forEach(track => {
      console.log('Add a track to the remoteStream:', track);
      remoteStream.addTrack(track);
    });
  });

  let currentCalleeCandidates = [];

  ws.addEventListener("message", async (event) => {
    let packet = JSON.parse(event.data);
    if (packet.eventType !== "message") return;
    vcdata = JSON.parse(packet.message.content);
    console.log('Got updated room');
    const data = vcdata.rooms[roomId];
    if (!peerConnection.currentRemoteDescription && data.answer) {
        console.log('Set remote description: ', data.answer);
        const answer = new RTCSessionDescription(data.answer)
        await peerConnection.setRemoteDescription(answer);
    }
    if (vcdata.rooms[roomId].calleeCandidates !== currentCalleeCandidates) {
      for (let candidate of vcdata.rooms[roomId].calleeCandidates) {
        if (!currentCalleeCandidates.includes(candidate)) {
          currentCalleeCandidates.push(candidate);
          console.log(`Got new remote ICE candidate: ${JSON.stringify(candidate)}`);
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      }
    }
  });
  modifyVoiceCallData(vcdata);
}

function joinRoom() {
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = true;

  document.querySelector('#confirmJoinBtn').
      addEventListener('click', async () => {
        roomId = document.querySelector('#room-id').value;
        console.log('Join room: ', roomId);
        document.querySelector(
            '#currentRoom').innerText = `Current room is ${roomId} - You are the callee!`;
        joinRoomById(roomId);
      }, {once: true});
  roomDialog.open();
}

async function joinRoomById(roomId) {
  let vcdata = await fetchVoiceCallData();
  if (vcdata.rooms == undefined) vcdata.rooms = {};
  console.log('Got room:', vcdata.rooms[roomId] !== undefined);
  const roomSnapshot = vcdata.rooms[roomId];

  if (vcdata.rooms[roomId] !== undefined) {
    console.log('Create PeerConnection with configuration: ', configuration);
    peerConnection = new RTCPeerConnection(configuration);
    registerPeerConnectionListeners();
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    const offer = vcdata.rooms[roomId].offer;
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    const roomWithAnswer = {
        answer: {
            type: answer.type,
            sdp: answer.sdp
        }
    }
    vcdata.rooms[roomId].answer = roomWithAnswer.answer;
    modifyVoiceCallData(vcdata);

    peerConnection.addEventListener('icecandidate', event => {
      if (!event.candidate) {
        console.log('Got final candidate!');
        return;
      }
      console.log('Got candidate: ', event.candidate);
      vcdata.rooms[roomId].calleeCandidates(event.candidate.toJSON());
      modifyVoiceCallData(vcdata);
    });

    peerConnection.addEventListener('track', event => {
      console.log('Got remote track:', event.streams[0]);
      event.streams[0].getTracks().forEach(track => {
        console.log('Add a track to the remoteStream:', track);
        remoteStream.addTrack(track);
      });
    });
    let currentCallerCandidates = [];
    ws.addEventListener("message", async (event) => {
      let packet = JSON.parse(event.data);
      if (packet.eventType !== "message") return;
      vcdata = JSON.parse(packet.message.content);
      console.log('Got updated room');
      if (vcdata.rooms[roomId].callerCandidates !== currentCallerCandidates) {
        for (let candidate of vcdata.rooms[roomId].callerCandidates) {
          if (!currentCallerCandidates.includes(candidate)) {
            currentCallerCandidates.push(candidate);
            console.log(`Got new remote ICE candidate: ${JSON.stringify(candidate)}`);
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          }
        }
      }
    });
  }
}

async function openUserMedia(e) {
  const stream = await navigator.mediaDevices.getUserMedia(
      {video: true, audio: true});
  document.querySelector('#localVideo').srcObject = stream;
  localStream = stream;
  remoteStream = new MediaStream();
  document.querySelector('#remoteVideo').srcObject = remoteStream;

  console.log('Stream:', document.querySelector('#localVideo').srcObject);
  document.querySelector('#cameraBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = false;
  document.querySelector('#createBtn').disabled = false;
  document.querySelector('#hangupBtn').disabled = false;
}

async function hangUp(e) {
  const tracks = document.querySelector('#localVideo').srcObject.getTracks();
  tracks.forEach(track => {
    track.stop();
  });

  if (remoteStream) {
    remoteStream.getTracks().forEach(track => track.stop());
  }

  if (peerConnection) {
    peerConnection.close();
  }

  document.querySelector('#localVideo').srcObject = null;
  document.querySelector('#remoteVideo').srcObject = null;
  document.querySelector('#cameraBtn').disabled = false;
  document.querySelector('#joinBtn').disabled = true;
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#hangupBtn').disabled = true;
  document.querySelector('#currentRoom').innerText = '';

  // Delete room on hangup
  if (roomId) {
    const vcdata = await fetchVoiceCallData();
    const roomRef = db.collection('rooms').doc(roomId);
    const calleeCandidates = vcdata.rooms[roomId].calleeCandidates;
    calleeCandidates.forEach(async candidate => {
      await candidate.delete();
    });
    const callerCandidates = vcdata.rooms[roomId].calleeCandidates;
    callerCandidates.forEach(async candidate => {
      await candidate.delete();
    });
    delete vcdata.rooms[roomId];
    modifyVoiceCallData(vcdata);
  }

  document.location.reload(true);
}

function registerPeerConnectionListeners() {
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(
        `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
  });

  peerConnection.addEventListener('connectionstatechange', () => {
    console.log(`Connection state change: ${peerConnection.connectionState}`);
  });

  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`);
  });

  peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(
        `ICE connection state change: ${peerConnection.iceConnectionState}`);
  });
}

init();
