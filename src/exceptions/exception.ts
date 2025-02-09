/* eslint-disable @typescript-eslint/no-empty-object-type */
export class HttpException extends Error {
  status: number;
  error: {} | undefined;
  constructor(status: number, message: string, error?: {}) {
    super(message);
    this.status = status;
    this.error = error;
  }
}
