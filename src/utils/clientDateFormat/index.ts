export type DateFormatToken = "day" | "month" | "year";
export type DateFormatOrder = "DMY" | "MDY" | "YMD";

export type ClientDateFormatConfig = Partial<Record<DateFormatToken, string>>;

interface ClientDateFormatSettings {
  separator?: string;
}

const TOKENS_ORDER_MAP: Record<DateFormatOrder, DateFormatToken[]> = {
  DMY: ["day", "month", "year"],
  MDY: ["month", "day", "year"],
  YMD: ["year", "month", "day"]
};

export class ClientDateFormat {
  public static readonly DEFAULT_CONFIG: ClientDateFormatConfig = {
    day: "DD",
    month: "MM",
    year: "YYYY"
  };

  public static readonly DEFAULT_SETTINGS: ClientDateFormatSettings = {
    separator: "-"
  };

  public static order: DateFormatOrder = "DMY";

  constructor(
    private cfg: ClientDateFormatConfig | null = ClientDateFormat.DEFAULT_CONFIG,
    private settings: ClientDateFormatSettings = ClientDateFormat.DEFAULT_SETTINGS
  ) {}

  public get config() {
    return this.cfg ?? ClientDateFormat.DEFAULT_CONFIG;
  }

  public toString() {
    return TOKENS_ORDER_MAP[ClientDateFormat.order]
      .map(token => this.config[token])
      .filter(Boolean)
      .join(this.settings.separator);
  }
}
