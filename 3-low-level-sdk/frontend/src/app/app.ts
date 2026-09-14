import { Component, signal } from '@angular/core';
import { LocalVideoTrack, RemoteTrack, Room, RoomEvent, Track } from 'livekit-client';
import { TrackView } from './track-view';

/** Where the backend of this example listens. */
const BACKEND_URL = 'http://localhost:6080';

/** The OpenVidu deployment, as OpenVidu Local serves it. */
const OPENVIDU_URL = 'ws://localhost:7880';

@Component({
  selector: 'app-root',
  imports: [TrackView],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly room = signal<Room | undefined>(undefined);
  protected readonly localTrack = signal<LocalVideoTrack | undefined>(undefined);
  protected readonly remoteTracks = signal<RemoteTrack[]>([]);

  protected async join() {
    const room = new Room();
    this.room.set(room);

    // Tracks arrive as events, one per camera, microphone or screen share
    // that any other participant publishes.
    room.on(RoomEvent.TrackSubscribed, (track) => {
      this.remoteTracks.update((tracks) => [...tracks, track]);
    });
    room.on(RoomEvent.TrackUnsubscribed, (track) => {
      this.remoteTracks.update((tracks) => tracks.filter((t) => t.sid !== track.sid));
    });

    const token = await this.getToken('support-desk', 'agent-' + Math.floor(Math.random() * 1000));

    await room.connect(OPENVIDU_URL, token);
    await room.localParticipant.enableCameraAndMicrophone();

    const camera = room.localParticipant.getTrackPublication(Track.Source.Camera);
    this.localTrack.set(camera?.videoTrack);
  }

  protected async leave() {
    await this.room()?.disconnect();
    this.room.set(undefined);
    this.localTrack.set(undefined);
    this.remoteTracks.set([]);
  }

  /** Your backend signs the token; the API secret never reaches the browser. */
  private async getToken(roomName: string, participantName: string): Promise<string> {
    const response = await fetch(`${BACKEND_URL}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName, participantName }),
    });
    const { token } = await response.json();
    return token;
  }
}
