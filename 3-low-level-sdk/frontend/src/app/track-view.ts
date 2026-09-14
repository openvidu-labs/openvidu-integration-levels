import { AfterViewInit, Component, ElementRef, OnDestroy, input, viewChild } from '@angular/core';
import { Track } from 'livekit-client';

/**
 * Renders one track. A track is not a DOM element: you attach it to a <video> or
 * an <audio> element, and detach it when the element goes away.
 */
@Component({
  selector: 'app-track-view',
  template: `
    @if (track().kind === Video) {
      <video #media autoplay playsinline muted></video>
      <span class="label">{{ label() }}</span>
    } @else {
      <audio #media autoplay></audio>
    }
  `,
  styleUrl: './track-view.css',
})
export class TrackView implements AfterViewInit, OnDestroy {
  protected readonly Video = Track.Kind.Video;

  readonly track = input.required<Track>();
  readonly label = input('');

  private readonly media = viewChild.required<ElementRef<HTMLMediaElement>>('media');

  ngAfterViewInit() {
    this.track().attach(this.media().nativeElement);
  }

  ngOnDestroy() {
    this.track().detach();
  }
}
