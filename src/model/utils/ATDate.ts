export abstract class ATTime {
  private static readonly time_zone: string = "MST";

  public static get_date_time_str(date: Date): string {
    return date.toLocaleString("en-US", { timeZone: ATTime.time_zone }) + " (" + ATTime.time_zone + ")";
  }

  public static get_date_str(date: Date): string {
    console.log("get_date_str");
    const ret_value = date.toLocaleDateString();
    console.log(ret_value);
    return ret_value;
  }

  public static get_hours_and_minutes_from_minutes(minutes: number): string {
    console.log("get_hours_and_minutes_from_minutes");
    const ret_value = Math.floor(minutes / 60) + ":" + (minutes % 60).toString().padStart(2, "0");
    console.log(ret_value);
    return ret_value;
  }

  public static get_date_from_ms(ms: number): string {
    console.log("get_date_from_ms");
    const ret_value = ATTime.get_date_str(new Date(ms));
    console.log(ret_value);
    return ret_value;
  }

  public static month_to_string(month: number) {
    switch (month) {
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
      default:
        return "Month";
    }
  }
}
