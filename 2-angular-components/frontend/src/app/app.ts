import { Component, signal } from '@angular/core';
import { OpenViduComponentsModule } from 'openvidu-components-angular';

/** Where the backend of this example listens. */
const BACKEND_URL = 'http://localhost:6080';

@Component({
  selector: 'app-root',
  imports: [OpenViduComponentsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  /** The OpenVidu deployment, as OpenVidu Local serves it. */
  protected readonly OPENVIDU_URL = 'ws://localhost:7880';

  protected readonly token = signal('');
  protected readonly resolved = signal(false);

  /**
   * The component asks for a token when the participant is ready to join, and
   * takes over from there: prejoin, devices, publishing, layout and panels.
   */
  protected async onTokenRequested(participantName: string) {
    const response = await fetch(`${BACKEND_URL}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomName: 'support-desk', participantName }),
    });
    const { token } = await response.json();

    this.token.set(token);
  }

  /** Your own business logic, running inside the meeting UI. */
  protected resolveTicket() {
    this.resolved.set(true);
  }
}
