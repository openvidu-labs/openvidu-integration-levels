import { AfterViewInit, Component, ElementRef, OnDestroy, input, viewChild } from '@angular/core';
import { Track } from 'livekit-client';

/** Renders one audio or video track by attaching it to a media element. */
@Component({
  selector: 'app-track-view',
  template: `
    @if (track().kind === Video) {
      <video #media autoplay playsinline muted></video>
      <span>{{ label() }}</span>
    } @else {
      <audio #media autoplay></audio>
    }
  `,
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
