import cors from "cors";
import express from "express";
import { AccessToken } from "livekit-server-sdk";

// Defaults match OpenVidu Local.
const OPENVIDU_API_KEY = process.env.OPENVIDU_API_KEY || "devkey";
const OPENVIDU_API_SECRET = process.env.OPENVIDU_API_SECRET || "secret";
const PORT = process.env.PORT || 6080;

const app = express();
app.use(cors());
app.use(express.json());

// Signs an access token that lets one participant join one room.
// This is the only thing your server must do for a client to connect.
app.post("/token", async (req, res) => {
    const { roomName, participantName } = req.body;

    const at = new AccessToken(OPENVIDU_API_KEY, OPENVIDU_API_SECRET, { identity: participantName });
    at.addGrant({ roomJoin: true, room: roomName });

    res.json({ token: await at.toJwt() });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
