import { formatDate } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  LOCALE_ID,
  NgZone,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  addWeeks,
  eachDayOfInterval,
  fromUnixTime,
  getDate,
  getDay,
  isSameWeek,
  subWeeks,
} from "date-fns";
import SVG from "svg.js";

import type { VTuber } from "src/app/models";
import { ApiService } from "src/app/shared";
import { PopperComponent } from "../popper/popper";

const getFill = (v: number) => {
  if (v <= 0) return "#00bfa510";
  if (v <= 1.5 * 60 * 60) return "#00bfa544";
  if (v <= 3.0 * 60 * 60) return "#00bfa588";
  if (v <= 4.5 * 60 * 60) return "#00bfa5CC";
  return "#00bfa5FF";
};

const relativeInWeek = (date: Date, base: Date): number => {
  let i = 0;

  while (i < 50) {
    if (isSameWeek(addWeeks(base, i), date, { weekStartsOn: 0 })) {
      return i;
    }
    i++;
  }

  return i;
};

@Component({
  selector: "hs-stream-time",
  templateUrl: "stream-time.html",
  styleUrls: ["stream-time.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class StreamTime implements OnDestroy, AfterViewInit {
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private api: ApiService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  @Input() vtuber: VTuber;

  @ViewChild("popperComp")
  popperComp: PopperComponent;

  popper = {
    date: 0,
    value: 0,
  };

  @ViewChild("heatmap", { static: true })
  private heatmapEl: ElementRef;
  _svg: SVG.Doc;

  loading: boolean;

  ngAfterViewInit() {
    this.loading = true;

    this.ngZone.runOutsideAngular(() => this._drawShimmer());

    this.api.streamTimes(this.vtuber.id).subscribe((res) => {
      this.ngZone.runOutsideAngular(() => this._draw(res.times));
      this.loading = false;
    });
  }

  ngOnDestroy() {
    if (this._svg) this._svg.clear();
  }

  _handleMouseleave() {
    if (!this.loading) {
      this.popperComp.hide();
    }
  }

  _handleMouseover(e: MouseEvent) {
    if (
      !this.loading &&
      e.target instanceof Element &&
      e.target.tagName.toLowerCase() === "rect"
    ) {
      this.popper.date = Number(e.target.getAttribute("x-date"));
      this.popper.value = Number(e.target.getAttribute("x-value"));

      // Caveat: don't forget to trigger a re-render
      // before re-position popper
      this.cdr.detectChanges();

      this.popperComp.update(e.target);
    }
  }

  private _draw(times: [number, number][]) {
    const size = 16;
    const gutter = 4;
    const leftPadding = 20;
    const end = new Date();
    const start = subWeeks(end, 44);

    if (this._svg) {
      this._svg.clear();
    } else {
      this._svg = SVG(this.heatmapEl.nativeElement).size(920, 160);
    }

    const values = times.reduce((acc, [time, value]) => {
      const d = fromUnixTime(time);
      const week = relativeInWeek(d, start);
      const day = getDay(d);

      acc[week] ||= [];
      acc[week][day] ||= 0;
      acc[week][day] += value;

      return acc;
    }, [] as number[][]);

    eachDayOfInterval({ start, end }).forEach((d) => {
      const day = getDay(d);
      const week = relativeInWeek(d, start);

      const x = leftPadding + week * (size + gutter);
      const y = day * (size + gutter);
      const v = values[week]?.[day] || 0;

      // month ticks
      if (getDate(d) === 1) {
        this._svg
          .text(formatDate(d, "MMM", this.locale))
          .addClass("stream-time-tick")
          .font({
            anchor: "middle",
            size: "12px",
            weight: "400",
            family: "Fira Code",
            leading: size,
          })
          .move(x + size / 2, 7 * (size + gutter));
      }

      this._svg
        .rect(size, size)
        .radius(2, 2)
        .fill(getFill(v))
        .attr({ "x-value": v, "x-date": d.getTime() })
        .move(x, y);
    });

    // week ticks
    [0, 1, 2, 3, 4, 5, 6].forEach((day) => {
      this._svg
        .text(formatDate(new Date(2017, 0, day + 1), "EEEEE", this.locale))
        .addClass("stream-time-tick")
        .font({
          anchor: "start",
          size: "12px",
          weight: "400",
          family: "Fira Code",
          leading: size,
        })
        .move(leftPadding - gutter * 2, day * (size + gutter));
    });
  }

  private _drawShimmer() {
    const size = 16;
    const gutter = 4;
    const leftPadding = 20;
    const end = new Date();
    const start = subWeeks(end, 44);

    if (this._svg) {
      this._svg.clear();
    } else {
      this._svg = SVG(this.heatmapEl.nativeElement).size(920, 160);
    }

    eachDayOfInterval({ start, end }).forEach((d) => {
      const day = getDay(d);
      const week = relativeInWeek(d, start);

      const x = leftPadding + week * (size + gutter);
      const y = day * (size + gutter);

      this._svg.rect(size, size).radius(2, 2).fill(getFill(0)).move(x, y);
    });
  }
}
