import cors from "cors";
import express from "express";
import { AccessToken } from "livekit-server-sdk";

// Defaults match OpenVidu Local. Override them in .env if your deployment differs.
const MEET_URL = process.env.MEET_URL || "http://localhost:9080/meet";
const MEET_API_KEY = process.env.MEET_API_KEY || "meet-api-key";
const OPENVIDU_API_KEY = process.env.OPENVIDU_API_KEY || "devkey";
const OPENVIDU_API_SECRET = process.env.OPENVIDU_API_SECRET || "secret";
const PORT = process.env.PORT || 6080;

const app = express();
app.use(cors());
app.use(express.json());

// LEVEL 1 — OpenVidu Meet Embedded.
// Creates a room through the Meet REST API and returns its access links.
app.post("/meetings", async (req, res) => {
    const response = await fetch(`${MEET_URL}/api/v1/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-KEY": MEET_API_KEY },
        body: JSON.stringify({
            roomName: req.body.roomName,
            config: { chat: { enabled: true }, recording: { enabled: false } }
        })
    });
    const room = await response.json();

    if (!response.ok) {
        return res.status(response.status).json(room);
    }

    // The moderator link is for your agent, the speaker link for your customer.
    res.json({
        moderatorUrl: room.access.anonymous.moderator.url,
        speakerUrl: room.access.anonymous.speaker.url
    });
});

// LEVELS 2 AND 3 — OpenVidu Platform.
// Signs an access token that lets one participant join one room.
app.post("/token", async (req, res) => {
    const { roomName, participantName } = req.body;

    const at = new AccessToken(OPENVIDU_API_KEY, OPENVIDU_API_SECRET, { identity: participantName });
    at.addGrant({ roomJoin: true, room: roomName });

    res.json({ token: await at.toJwt() });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
