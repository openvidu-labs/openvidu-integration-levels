import { Component, ElementRef, signal, viewChild } from '@angular/core';

/** Where the backend of this example listens. */
const BACKEND_URL = 'http://localhost:6080';

/** The access links the backend returns for a new OpenVidu Meet room. */
type Meeting = { moderatorUrl: string; speakerUrl: string };

/** An <openvidu-meet> element, with the commands this page uses. */
type MeetElement = HTMLElement & { endMeeting: () => void };

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly call = signal<Meeting | null>(null);

  private readonly container = viewChild.required<ElementRef<HTMLElement>>('container');
  private meet?: MeetElement;

  /** Asks the backend for a room, then embeds the moderator link. */
  protected async startCall() {
    const response = await fetch(`${BACKEND_URL}/meetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName: 'Ticket #4821' }),
    });
    const meeting: Meeting = await response.json();

    this.embed(meeting.moderatorUrl);
    this.call.set(meeting);
  }

  /**
   * Builds the element with its attributes already set, because the Web Component
   * reads room-url the moment it enters the DOM: earlier than an Angular template
   * binding would be applied.
   */
  private embed(roomUrl: string) {
    const meet = document.createElement('openvidu-meet') as MeetElement;
    meet.setAttribute('room-url', roomUrl);
    meet.setAttribute('participant-name', 'Support agent');

    // Events tell your app what happens inside the meeting.
    meet.addEventListener('joined', (event) => {
      const { participantIdentity } = (event as CustomEvent).detail;
      console.log(`${participantIdentity} joined the meeting`);
    });
    meet.addEventListener('closed', () => this.reset());

    this.container().nativeElement.replaceChildren(meet);
    this.meet = meet;
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
