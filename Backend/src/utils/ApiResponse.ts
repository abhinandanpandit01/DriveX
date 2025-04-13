class ApiResponse {
  constructor(
    public success: number,
    public message: string,
    public data?: any
  ) {}
}
export default ApiResponse;
