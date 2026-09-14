import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="cards">
      <a class="card" routerLink="/meet-embedded">
        <h2>1. Embed OpenVidu Meet</h2>
        <p>A finished meeting UI, embedded with one HTML tag.</p>
        <code>&lt;openvidu-meet&gt;</code>
      </a>

      <a class="card" routerLink="/angular-components">
        <h2>2. Angular Components</h2>
        <p>Your own meeting screen, built from prebuilt pieces.</p>
        <code>&lt;ov-videoconference&gt;</code>
      </a>

      <a class="card" routerLink="/low-level-sdk">
        <h2>3. Low-level SDK</h2>
        <p>No UI at all: a Room and its audio and video tracks.</p>
        <code>room.connect(url, token)</code>
      </a>
    </div>
  `,
})
export class Home {}
