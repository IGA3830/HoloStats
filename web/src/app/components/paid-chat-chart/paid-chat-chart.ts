import {
  Component,
  Input,
  ViewEncapsulation,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { PaidLiveChatMessage, Stream } from "src/app/models";
import { ApiService } from "src/app/shared";
import { fromEvent, Subscription } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  map,
} from "rxjs/operators";
import { ScaleLinear, scaleLinear } from "d3-scale";
import { flatRollup, sort, sum } from "d3-array";

import { hexToColorName, symbolToCurrency } from "./mapping";
import { PopperComponent } from "../popper/popper";

const splitAmount = (amount: string): [string, number] => {
  const idx = amount.split("").findIndex((c) => "0" <= c && c <= "9");

  return [
    amount.slice(0, idx).trim(),
    parseFloat(amount.slice(idx).replace(",", "")),
  ];
};

@Component({
  selector: "hs-paid-chat-chart",
  templateUrl: "paid-chat-chart.html",
  styleUrls: ["paid-chat-chart.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PaidLiveChat implements OnInit {
  @Input() stream: Stream;

  @ViewChild("popperComp")
  popperComp: PopperComponent;
  popper = {
    idx: -1,
  };

  readonly barHeight: number = 21;
  readonly innerPadding: number = 7;

  readonly leftMargin: number = 50;
  readonly rightMargin: number = 30;
  readonly topMargin: number = 30;
  readonly bottomMargin: number = 10;

  sum = 0;
  items: [
    string,
    {
      total: number;
      totalValue: number;
      currency: string;
      currencyCode: string;
      currencySymbol: string;
      items: [
        string,
        {
          name: string;
          total: number;
          totalValue: number;
        }
      ][];
    }
  ][] = [];

  sub: Subscription;

  width: number = 0;
  xScale: ScaleLinear<number, number> = scaleLinear();

  constructor(
    private api: ApiService,
    private host: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.width = this.host.nativeElement.getBoundingClientRect().width;

    this.api
      .liveChatHighlight(this.stream.streamId)
      .pipe(
        map((res) =>
          res.paid.map((msg) => {
            const [symbol, value] = splitAmount(msg.amount);
            const [currencyCode, currency] = symbolToCurrency[symbol] || [
              symbol,
              symbol,
            ];

            return {
              ...msg,
              value,
              currency,
              currencyCode,
              currencySymbol: symbol,
            } as PaidLiveChatMessage;
          })
        )
      )
      .subscribe((items) => {
        if (items.length === 0) return;

        this.items = sort(
          flatRollup(
            items,
            (items) => ({
              total: items.length,
              totalValue: sum(items, (msg) => msg.value),
              currency: items[0].currency,
              currencyCode: items[0].currencyCode,
              currencySymbol: items[0].currencySymbol,
              items: sort(
                flatRollup(
                  items,
                  (items) => ({
                    name: hexToColorName[items[0].color],
                    total: items.length,
                    totalValue: sum(items, (item) => item.value),
                  }),
                  (item) => item.color
                ),
                ([_, group]) => group.totalValue
              ),
            }),
            (item) => item.currencyCode
          ),
          ([_, group]) => -group.total,
          ([_, group]) => group.currencyCode.charCodeAt(0)
        );
        this.sum = sum(this.items, (item) => item[1].total);

        const max = Math.max(...this.items.map((i) => i[1].total));

        this.xScale
          .domain([0, max])
          .range([0, this.width - this.leftMargin - this.rightMargin]);
      });

    // TODO: switch to resize observer
    this.sub = fromEvent(window, "resize")
      .pipe(
        startWith({}),
        map(() => this.host.nativeElement.getBoundingClientRect().width),
        distinctUntilChanged(),
        debounceTime(500)
      )
      .subscribe((w) => {
        this.width = w;
        this.xScale.range([0, w - this.leftMargin - this.rightMargin]);
      });
  }

  _handleMousemove(e: MouseEvent) {
    if (e.target instanceof Element && e.target.hasAttribute("idx")) {
      const idx = Number(e.target.getAttribute("idx"));
      this.popper.idx = idx;
      this.popperComp.update({
        getBoundingClientRect: () => ({
          width: 0,
          height: 0,
          top: e.clientY,
          right: e.clientX,
          bottom: e.clientY,
          left: e.clientX,
        }),
      } as Element);
    } else {
      this.popperComp.hide();
    }
  }

  trackBy(idx, item) {
    return item[0];
  }

  _handleMouseleave() {
    this.popperComp.hide();
  }
}
