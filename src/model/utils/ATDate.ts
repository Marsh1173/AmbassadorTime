export abstract class ATTime {
  private static readonly time_zone: string = "MST";

  public static get_date_time_str(date: Date): string {
    return (
      date.toLocaleString("en-US", { timeZone: ATTime.time_zone }) +
      " (" +
      ATTime.time_zone +
      ")"
    );
  }

  public static get_date_str(date: Date): string {
    return date.toLocaleDateString();
  }

  public static get_hours_and_minutes_from_minutes(minutes: number): string {
    return Math.floor(minutes / 60) + ":" + (minutes % 60);
  }

  public static get_date_from_ms(ms: number): string {
    return ATTime.get_date_str(new Date(ms));
  }
}
