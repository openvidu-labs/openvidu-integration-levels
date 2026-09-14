import cors from "cors";
import express from "express";

// Defaults match OpenVidu Local.
const MEET_URL = process.env.MEET_URL || "http://localhost:9080/meet";
const MEET_API_KEY = process.env.MEET_API_KEY || "meet-api-key";
const PORT = process.env.PORT || 6080;

const app = express();
app.use(cors());
app.use(express.json());

// Creates a room through the OpenVidu Meet REST API and returns its access links.
// The API key lives here, never in the browser.
app.post("/rooms", async (req, res) => {
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

    // Which link you hand out decides the role: moderator for your agent,
    // speaker for your customer.
    res.json({
        moderatorUrl: room.access.anonymous.moderator.url,
        speakerUrl: room.access.anonymous.speaker.url
    });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
