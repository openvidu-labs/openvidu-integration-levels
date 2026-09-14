# OpenVidu integration levels

Three ways to put video conferencing inside your own application with
[OpenVidu](https://openvidu.io), as three independent applications you can run one at a time:

| | What it shows | Stack |
|---|---|---|
| [**1-meet-embedded**](1-meet-embedded/) | A finished meeting UI, embedded with one HTML tag | Angular 22 + Node.js |
| [**2-angular-components**](2-angular-components/) | Your own meeting screen, built from prebuilt pieces | Angular 20 + Node.js |
| [**3-low-level-sdk**](3-low-level-sdk/) | No UI at all: a Room and its audio and video tracks | Angular 22 + Node.js |

Each folder is self-contained: its own backend, its own frontend, its own README. They all
model the same scenario, a support desk where an agent starts a call and a customer joins, so
you can compare the three by reading the same feature three times.

This is the companion repository of the article
[3 ways to integrate video conferencing into your app with OpenVidu](https://openvidu.io/blog/).

## What you need

- [Docker](https://docs.docker.com/get-started/get-docker/) to run OpenVidu on your machine.
- [Node.js](https://nodejs.org/) 22 or newer.

## Start OpenVidu

One deployment serves all three levels. [OpenVidu Local](https://openvidu.io/latest/docs/self-hosting/local/)
brings up both OpenVidu Meet and the OpenVidu API:

```bash
git clone https://github.com/OpenVidu/openvidu-local-deployment -b 3.8.0
cd openvidu-local-deployment/community
./configure_lan_private_ip_linux.sh   # configure_lan_private_ip_macos.sh | .bat on Windows
docker compose up
```

That gives you:

- **OpenVidu Meet** at `http://localhost:9080`, API key `meet-api-key` — used by level 1.
- **OpenVidu API** at `ws://localhost:7880`, API key `devkey`, secret `secret` — used by levels 2 and 3.

Those are the defaults the three examples expect, so there is nothing to configure.

## Run a level

Every level runs its backend on port `6080` and its frontend on port `4200`, so **run one level
at a time**. From the level's folder, in two terminals:

```bash
cd backend && npm install && npm start      # http://localhost:6080
cd frontend && npm install && npm start     # http://localhost:4200
```

Then open [http://localhost:4200](http://localhost:4200). Each level's README explains what to
click and how to bring a second participant in.

## Which level is which

**[1-meet-embedded](1-meet-embedded/)** — the backend creates a room with the
[Meet REST API](https://openvidu.io/latest/meet/embedded/reference/rest-api/) and the page
embeds the returned link with `<openvidu-meet>`. Chat, screen sharing, recording, virtual
backgrounds and the whole meeting UI come with it.

**[2-angular-components](2-angular-components/)** — `<ov-videoconference>` renders the meeting
and your backend only signs access tokens. The example also adds a button of its own to the
toolbar, which is where your product shows up inside the call.

**[3-low-level-sdk](3-low-level-sdk/)** — `livekit-client` gives you a `Room` and its tracks,
and nothing else. You write the layout, the controls and the rendering.
