import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { postJson } from './api';

/** The access links the backend returns for a new OpenVidu Meet room. */
type Meeting = { moderatorUrl: string; speakerUrl: string };

/** An <openvidu-meet> element, with the commands this page uses. */
type MeetElement = HTMLElement & { endMeeting: () => void };

/**
 * LEVEL 1 — Embed OpenVidu Meet.
 *
 * The backend creates the room through the Meet REST API. This page embeds the
 * returned link with <openvidu-meet>, which brings the whole meeting UI with it.
 */
@Component({
  selector: 'app-meet-embedded',
  template: `
    <header class="bar">
      @if (call(); as meeting) {
        <span>Open this link in another tab to join as the customer:</span>
        <a [href]="meeting.speakerUrl" target="_blank">customer link</a>
        <button (click)="endCall()">End meeting for everyone</button>
      } @else {
        <button class="primary" (click)="startCall()">Start call</button>
      }
    </header>

    <div #container class="stage"></div>
  `,
})
export class MeetEmbedded {
  protected readonly call = signal<Meeting | null>(null);
  private readonly container = viewChild.required<ElementRef<HTMLElement>>('container');
  private meet?: MeetElement;

  /** Asks the backend for a room and embeds the moderator link. */
  protected async startCall() {
    const meeting = await postJson<Meeting>('/meetings', { roomName: 'Ticket #4821' });

    // Build the element with its attributes already set: the Web Component reads
    // them when it enters the DOM, before an Angular binding would be applied.
    const meet = document.createElement('openvidu-meet') as MeetElement;
    meet.setAttribute('room-url', meeting.moderatorUrl);
    meet.setAttribute('participant-name', 'Support agent');

    // Events carry their payload in `detail`, like any CustomEvent.
    meet.addEventListener('joined', (event) => {
      const { roomId, participantIdentity } = (event as CustomEvent).detail;
      console.log(`${participantIdentity} joined ${roomId}`);
    });
    meet.addEventListener('closed', () => this.reset());

    this.container().nativeElement.replaceChildren(meet);
    this.meet = meet;
    this.call.set(meeting);
  }

  /** Commands are plain methods on the element. */
  protected endCall() {
    this.meet?.endMeeting();
  }

  private reset() {
    this.container().nativeElement.replaceChildren();
    this.meet = undefined;
    this.call.set(null);
  }
}
