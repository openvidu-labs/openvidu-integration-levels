import { Component, signal } from '@angular/core';
import { OpenViduComponentsModule } from 'openvidu-components-angular';
import { OPENVIDU_URL, postJson } from './api';

/**
 * LEVEL 2 — OpenVidu Angular Components.
 *
 * <ov-videoconference> renders the whole meeting: prejoin, toolbar, layout and
 * panels. It asks for an access token when the participant is ready to join, and
 * any piece of it can be extended or replaced with your own markup.
 */
@Component({
  selector: 'app-angular-components',
  imports: [OpenViduComponentsModule],
  template: `
    @if (resolved()) {
      <header class="bar">Ticket #4821 marked as resolved</header>
    }

    <ov-videoconference
      class="stage"
      [token]="token()"
      [livekitUrl]="OPENVIDU_URL"
      (onTokenRequested)="onTokenRequested($event)"
    >
      <!-- Your own button, next to the default controls. -->
      <div *ovToolbarAdditionalButtons>
        <button (click)="resolveTicket()">Resolve ticket</button>
      </div>
    </ov-videoconference>
  `,
})
export class AngularComponents {
  protected readonly OPENVIDU_URL = OPENVIDU_URL;
  protected readonly token = signal('');
  protected readonly resolved = signal(false);

  /** The component asks for a token when the participant joins; your backend signs it. */
  protected async onTokenRequested(participantName: string) {
    const { token } = await postJson<{ token: string }>('/token', {
      roomName: 'support-desk',
      participantName,
    });
    this.token.set(token);
  }

  /** Your business logic, running inside the meeting UI. */
  protected resolveTicket() {
    this.resolved.set(true);
  }
}
