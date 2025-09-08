import { IResponse, IStatus } from "../Interface/response.inerfaces";

export class ResponseUtil {
  static success<T>(
    data: T,
    message: string = "Operation successful"
  ): IResponse<T> {
    return {
      responseStatusList: {
        statusList: [
          {
            statusCode: 200,
            statusType: "success",
            statusDesc: message,
          },
        ],
      },
      responseObject: {
        data,
      },
    };
  }

  static error(
    statusCode: number,
    message: string,
    error?: any
  ): IResponse<null> {
    return {
      responseStatusList: {
        statusList: [
          {
            statusCode,
            statusType: "error",
            statusDesc: message,
          },
        ],
      },
      responseObject: {
        error,
      },
    };
  }

  static customStatus(statusList: IStatus[], data?: any): IResponse<any> {
    return {
      responseStatusList: {
        statusList,
      },
      responseObject: {
        data,
      },
    };
  }
}
