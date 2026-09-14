import { Component, signal } from '@angular/core';
import { LocalVideoTrack, RemoteTrack, Room, RoomEvent, Track } from 'livekit-client';
import { OPENVIDU_URL, postJson } from './api';
import { TrackView } from './track-view';

/**
 * LEVEL 3 — Low-level SDK.
 *
 * No UI comes with the SDK: you connect to a Room, publish your tracks and decide
 * how every track other participants publish is rendered.
 */
@Component({
  selector: 'app-low-level-sdk',
  imports: [TrackView],
  template: `
    <header class="bar">
      @if (room()) {
        <button (click)="leave()">Leave</button>
      } @else {
        <button class="primary" (click)="join()">Join</button>
      }
      <span>Open this page in another tab to join as a second participant.</span>
    </header>

    <div class="grid stage">
      @if (localTrack(); as track) {
        <app-track-view [track]="track" label="You" />
      }
      @for (track of remoteTracks(); track track.sid) {
        <app-track-view [track]="track" label="Participant" />
      }
    </div>
  `,
})
export class LowLevelSdk {
  protected readonly room = signal<Room | undefined>(undefined);
  protected readonly localTrack = signal<LocalVideoTrack | undefined>(undefined);
  protected readonly remoteTracks = signal<RemoteTrack[]>([]);

  protected async join() {
    const room = new Room();
    this.room.set(room);

    // A track arrives as an event, one per published camera, microphone or screen.
    room.on(RoomEvent.TrackSubscribed, (track) => {
      this.remoteTracks.update((tracks) => [...tracks, track]);
    });
    room.on(RoomEvent.TrackUnsubscribed, (track) => {
      this.remoteTracks.update((tracks) => tracks.filter((t) => t.sid !== track.sid));
    });

    const participantName = 'participant-' + Math.floor(Math.random() * 1000);
    const { token } = await postJson<{ token: string }>('/token', {
      roomName: 'support-desk',
      participantName,
    });

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
}
