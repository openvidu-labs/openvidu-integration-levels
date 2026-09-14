# Level 2 — OpenVidu Angular Components

The same support desk, with the meeting screen built from
[OpenVidu Angular Components](https://openvidu.io/latest/docs/ui-components/angular-components/),
the library OpenVidu Meet itself is built with. You get a working meeting out of the box and
then change any part of it.

Angular 20 frontend, Node.js backend. See the [root README](../README.md) for how to start
OpenVidu Local first.

> `openvidu-components-angular` 3.8.0 supports Angular 17 to 20, so this example stays on
> Angular 20 while the other two are on the latest.

## Run it

```bash
cd backend && npm install && npm start      # http://localhost:6080
cd frontend && npm install && npm start     # http://localhost:4200
```

Open [http://localhost:4200](http://localhost:4200), type a name in the prejoin screen and
join. Open the same URL in a second tab to be a second participant.

## The code

**[`backend/server.js`](backend/server.js)** is much smaller than level 1's: the only thing it
must do is sign an access token that says who the participant is and which room they may join.

```javascript
const at = new AccessToken(OPENVIDU_API_KEY, OPENVIDU_API_SECRET, { identity: participantName });
at.addGrant({ roomJoin: true, room: roomName });
```

**[`frontend/src/app/app.config.ts`](frontend/src/app/app.config.ts)** registers the library,
and **[`frontend/src/app/app.html`](frontend/src/app/app.html)** is the whole meeting:

```html
<ov-videoconference
  [token]="token()"
  [livekitUrl]="OPENVIDU_URL"
  (onTokenRequested)="onTokenRequested($event)"
>
  <div *ovToolbarAdditionalButtons>
    <button (click)="resolveTicket()">Resolve ticket</button>
  </div>
</ov-videoconference>
```

The component asks for a token when the participant is ready to join;
**[`frontend/src/app/app.ts`](frontend/src/app/app.ts)** fetches it from the backend and hands
it over. The nested block is the customization hook: `*ovToolbarAdditionalButtons` adds a
button of your own to the default toolbar, and its siblings replace pieces outright
(`*ovToolbar`, `*ovLayout`, `*ovStream`, `*ovChatPanel`, `*ovParticipantsPanel`…).

## Going further

- [Angular Components tutorials](https://openvidu.io/latest/docs/tutorials/angular-components/) — one per customizable piece: custom toolbar, layout, stream, panels, admin dashboard.
- [Angular Components reference](https://openvidu.io/latest/docs/ui-components/angular-components/) — components, directives and CSS variables.
