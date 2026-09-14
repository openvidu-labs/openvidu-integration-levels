# Level 3 — Low-level SDK

The same support desk with no meeting UI at all. `livekit-client` gives you a `Room` and its
audio and video tracks; the layout, the controls and the rendering are yours.

Angular 22 frontend, Node.js backend. See the [root README](../README.md) for how to start
OpenVidu Local first.

## Run it

```bash
cd backend && npm install && npm start      # http://localhost:6080
cd frontend && npm install && npm start     # http://localhost:4200
```

Open [http://localhost:4200](http://localhost:4200) and hit **Join**. Open the same URL in a
second tab to see a second participant appear.

## The code

**[`backend/server.js`](backend/server.js)** is the same token server as level 2: OpenVidu
Meet is not involved at this level, only the OpenVidu deployment.

**[`frontend/src/app/app.ts`](frontend/src/app/app.ts)** is the whole integration:

```typescript
const room = new Room();

room.on(RoomEvent.TrackSubscribed, (track) => {
  this.remoteTracks.update((tracks) => [...tracks, track]);
});

await room.connect(OPENVIDU_URL, token);
await room.localParticipant.enableCameraAndMicrophone();
```

`TrackSubscribed` fires once per track any other participant publishes, which is how people
appear on screen. **[`frontend/src/app/track-view.ts`](frontend/src/app/track-view.ts)** is the
other half of the job: attaching a track to a `<video>` or `<audio>` element and detaching it
when the element goes away.

OpenVidu is API-compatible with LiveKit, so any LiveKit client SDK works against your
deployment. This example uses the JavaScript one; the same shape applies to Swift, Android,
Flutter, React Native and Unity.

## Going further

- [Client SDK reference](https://openvidu.io/latest/docs/reference/client-sdk.html) — the model every SDK shares.
- [Application client tutorials](https://openvidu.io/latest/docs/tutorials/application-client/) — JavaScript, React, Angular, Vue, Electron, Ionic, Android and iOS.
- [Application server tutorials](https://openvidu.io/latest/docs/tutorials/application-server/) — the token endpoint in nine languages.
