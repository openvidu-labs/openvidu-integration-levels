# Level 1 — Embed OpenVidu Meet

A support desk where the agent hits **Start call** and a complete meeting appears inside the
page. All of the meeting UI, from the prejoin screen to chat and screen sharing, comes from
[OpenVidu Meet Embedded](https://openvidu.io/latest/meet/embedded/intro/).

Angular 22 frontend, Node.js backend. See the [root README](../README.md) for how to start
OpenVidu Local first.

## Run it

```bash
cd backend && npm install && npm start      # http://localhost:6080
cd frontend && npm install && npm start     # http://localhost:4200
```

Open [http://localhost:4200](http://localhost:4200), hit **Start call**, and then open the
**customer link** from the header in a second tab to see both sides of the same meeting.

## The code

**[`backend/server.js`](backend/server.js)** creates the room. One authenticated request to the
Meet REST API returns the room's access links, and the link you hand to each person decides
their role:

```javascript
const response = await fetch(`${MEET_URL}/api/v1/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-KEY": MEET_API_KEY },
    body: JSON.stringify({ roomName: req.body.roomName })
});
```

The API key stays on the server. The browser only ever sees the resulting links.

**[`frontend/src/index.html`](frontend/src/index.html)** loads the Web Component bundle from
your own deployment:

```html
<script src="http://localhost:9080/meet/v1/openvidu-meet.js"></script>
```

**[`frontend/src/app/app.html`](frontend/src/app/app.html)** puts the meeting on the page. In plain
HTML this is one tag; in Angular it is the same tag with bindings:

```html
<openvidu-meet
  #meet
  [attr.room-url]="current.moderatorUrl"
  participant-name="Support agent"
  (joined)="onJoined($event)"
  (closed)="onClosed()"
></openvidu-meet>
```

The element needs `CUSTOM_ELEMENTS_SCHEMA` in the component, because it is a Web Component
rather than an Angular one. From there it is ordinary Angular: `(joined)` and `(closed)` listen
to the element's [events](https://openvidu.io/latest/meet/embedded/reference/webcomponent/#events),
and **[`frontend/src/app/app.ts`](frontend/src/app/app.ts)** reaches the element through
`viewChild` to call the `endMeeting()`
[command](https://openvidu.io/latest/meet/embedded/reference/webcomponent/#commands).

## Going further

- [Web Component reference](https://openvidu.io/latest/meet/embedded/reference/webcomponent/) — every attribute, command and event.
- [Step-by-step guide](https://openvidu.io/latest/meet/embedded/step-by-step-guide/) — including the iframe and direct-link alternatives.
- [Webhooks](https://openvidu.io/latest/meet/embedded/reference/webhooks/) — react to meetings and recordings from your backend.
