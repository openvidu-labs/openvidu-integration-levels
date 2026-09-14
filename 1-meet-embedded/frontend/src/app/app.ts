import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, signal, viewChild } from '@angular/core';

/** Where the backend of this example listens. */
const BACKEND_URL = 'http://localhost:6080';

/** The access links the backend returns for a new OpenVidu Meet room. */
type MeetRoom = { moderatorUrl: string; speakerUrl: string };

/** An <openvidu-meet> element, with the commands this page uses. */
type MeetElement = HTMLElement & { endMeeting: () => void };

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  // <openvidu-meet> is a Web Component, not an Angular component.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class App {
  protected readonly room = signal<MeetRoom | null>(null);

  private readonly meet = viewChild<ElementRef<MeetElement>>('meet');

  /** Asks the backend for a room. Once set, the template embeds its moderator link. */
  protected async createRoom() {
    const response = await fetch(`${BACKEND_URL}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName: 'Ticket #4821' }),
    });

    this.room.set(await response.json());
  }

  /** Events carry their payload in `detail`, like any CustomEvent. */
  protected onJoined(event: Event) {
    const { participantIdentity } = (event as CustomEvent).detail;
    console.log(`${participantIdentity} joined the meeting`);
  }

  protected onClosed() {
    this.room.set(null);
  }

  /** Commands are methods on the element. */
  protected endMeeting() {
    this.meet()?.nativeElement.endMeeting();
  }
}
