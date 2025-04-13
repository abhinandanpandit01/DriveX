class ApiError extends Error {
  status: number;
  errors?: [string];
  constructor(status: number, message: string, errors?: [string]) {
    super(message);
    this.status = status;
    this.message = message;
    if (errors) {
      this.errors = errors;
    }
  }
}

export default ApiError;
