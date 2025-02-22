import { Inject, Pipe, PipeTransform } from "@angular/core";
import { formatDuration } from "date-fns";

import { DATE_FNS_LOCALE } from "src/i18n";

@Pipe({ name: "formatDuration" })
export class FormatDurationPipe implements PipeTransform {
  constructor(@Inject(DATE_FNS_LOCALE) private dateFnsLocale: Locale) {}

  transform(value: number): string {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value - hours * 3600) / 60);

    return formatDuration({ hours, minutes }, { locale: this.dateFnsLocale });
  }
}
