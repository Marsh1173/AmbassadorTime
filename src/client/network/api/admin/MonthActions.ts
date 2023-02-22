export interface MonthActionsMsg {
  type: "MonthActionsMsg";
  data: string | undefined;
  year: number;
  month: number;
}
