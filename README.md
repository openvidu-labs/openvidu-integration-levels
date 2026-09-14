# OpenVidu integration levels

Three ways to put video conferencing inside your own application with
[OpenVidu](https://openvidu.io), side by side in one runnable app:

| | What it is | Key file |
|---|---|---|
| **1. Embed OpenVidu Meet** | A finished meeting UI, embedded with one HTML tag | [`level-1-meet-embedded.ts`](frontend/src/app/level-1-meet-embedded.ts) |
| **2. Angular Components** | Your own meeting screen, built from prebuilt pieces | [`level-2-angular-components.ts`](frontend/src/app/level-2-angular-components.ts) |
| **3. Low-level SDK** | No UI at all: a Room and its audio and video tracks | [`level-3-low-level-sdk.ts`](frontend/src/app/level-3-low-level-sdk.ts) |

All three run against the **same** OpenVidu deployment, and all three are served by the
**same** backend: [`backend/server.js`](backend/server.js), which creates OpenVidu Meet rooms
for level 1 and signs access tokens for levels 2 and 3.

This is the companion repository of the article
[3 ways to integrate video conferencing into your app with OpenVidu](https://openvidu.io/blog/).

## Requirements

- [Docker](https://docs.docker.com/get-started/get-docker/) to run OpenVidu on your machine.
- [Node.js](https://nodejs.org/) 20 or newer.

## Run it

**1. Start OpenVidu Local.** It brings both the OpenVidu API and OpenVidu Meet:

```bash
git clone https://github.com/OpenVidu/openvidu-local-deployment -b 3.8.0
cd openvidu-local-deployment/community
./configure_lan_private_ip_linux.sh   # configure_lan_private_ip_macos.sh | .bat on Windows
docker compose up
```

This gives you the OpenVidu API at `ws://localhost:7880` (key `devkey`, secret `secret`) and
OpenVidu Meet at `http://localhost:9080` (API key `meet-api-key`). The examples use those
defaults, so there is nothing to configure.

**2. Start the backend**, in another terminal:

```bash
cd backend
npm install
npm start          # http://localhost:6080
```

**3. Start the frontend**, in a third terminal:

```bash
cd frontend
npm install
npm start          # http://localhost:4200
```

Open [http://localhost:4200](http://localhost:4200) and pick a level. Each page tells you how
to bring a second participant in, so you can see a real meeting rather than your own camera.

## What each level does

### 1. Embed OpenVidu Meet

The backend creates a room with the [Meet REST API](https://openvidu.io/latest/meet/embedded/reference/rest-api.html)
and returns its access links. The page loads the Web Component bundle in
[`index.html`](frontend/src/index.html) and puts the moderator link on the page:

```html
<openvidu-meet room-url="https://your-deployment/meet/room/ticket-4821?secret=..."></openvidu-meet>
```

That is the whole integration. The element also exposes commands (`endMeeting()`,
`leaveRoom()`, `kickParticipant()`) and events (`joined`, `left`, `closed`), which this example
uses to end the meeting and to return to the start screen.

The element is created in TypeScript rather than written in the template on purpose: the Web
Component reads `room-url` when it enters the DOM, which happens before Angular would apply a
template binding.

### 2. Angular Components

`<ov-videoconference>` renders the entire meeting: prejoin, toolbar, layout, chat and panels.
It asks your app for an access token when the participant is ready to join:

```html
<ov-videoconference [token]="token()" [livekitUrl]="OPENVIDU_URL" (onTokenRequested)="onTokenRequested($event)">
  <div *ovToolbarAdditionalButtons>
    <button (click)="resolveTicket()">Resolve ticket</button>
  </div>
</ov-videoconference>
```

The nested block is the customization hook: `*ovToolbarAdditionalButtons` adds your own button
to the default toolbar, and sibling directives (`*ovToolbar`, `*ovLayout`, `*ovStream`,
`*ovChatPanel`…) replace each piece outright. See the
[Angular Components tutorials](https://openvidu.io/latest/docs/tutorials/angular-components/).

### 3. Low-level SDK

No UI comes with the SDK. You connect to a Room, publish your tracks, and decide how each
track other participants publish is rendered:

```ts
const room = new Room();
room.on(RoomEvent.TrackSubscribed, (track) => this.remoteTracks.update((t) => [...t, track]));
await room.connect(OPENVIDU_URL, token);
await room.localParticipant.enableCameraAndMicrophone();
```

[`track-view.ts`](frontend/src/app/track-view.ts) is the other half: attaching a track to a
`<video>` or `<audio>` element.

## Pointing it at your own deployment

The defaults live in [`backend/.env.example`](backend/.env.example) and
[`frontend/src/app/api.ts`](frontend/src/app/api.ts). To use a deployment other than OpenVidu
Local, set the backend variables and update the OpenVidu URL in `api.ts`, plus the Web
Component script URL in [`frontend/src/index.html`](frontend/src/index.html).

## Notes

- Level 2 pulls in a complete video conferencing UI, so the Angular bundle budget in
  `angular.json` is raised accordingly.
- `openvidu-components-angular` 3.8.0 supports Angular 17 to 20; this app is on Angular 20.
