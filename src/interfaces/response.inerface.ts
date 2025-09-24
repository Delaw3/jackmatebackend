export interface IApiResponse {
  status: "success" | "error";
  message: string;
  data?: any;
}
