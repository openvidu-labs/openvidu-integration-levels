# Level 1 — Embed OpenVidu Meet

A support desk where the agent hits **Start call** and a complete meeting appears inside the
page. All of the meeting UI, from the prejoin screen to chat and screen sharing, comes from
[OpenVidu Meet Embedded](https://openvidu.io/latest/meet/embedded/intro.html).

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

**[`frontend/src/app/app.ts`](frontend/src/app/app.ts)** puts the meeting on the page. In plain
HTML this is one tag:

```html
<openvidu-meet room-url="http://localhost:9080/meet/room/ticket_4821-xyz?secret=abc"></openvidu-meet>
```

This example builds that element in TypeScript instead, because the Web Component reads
`room-url` the moment it enters the DOM, which happens before an Angular template binding would
be applied. It also listens for the `joined` and `closed`
[events](https://openvidu.io/latest/meet/embedded/reference/webcomponent.html#events) and calls
the `endMeeting()`
[command](https://openvidu.io/latest/meet/embedded/reference/webcomponent.html#commands).

## Going further

- [Web Component reference](https://openvidu.io/latest/meet/embedded/reference/webcomponent.html) — every attribute, command and event.
- [Step-by-step guide](https://openvidu.io/latest/meet/embedded/step-by-step-guide.html) — including the iframe and direct-link alternatives.
- [Webhooks](https://openvidu.io/latest/meet/embedded/reference/webhooks.html) — react to meetings and recordings from your backend.
