export interface ServerError {
  status: string;
  statusCode: number;
  message: string;
  trace?: string;
}

export function isServerError(obj: unknown): obj is ServerError {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'status' in obj &&
    typeof (obj as ServerError).status === 'string' &&
    'statusCode' in obj &&
    typeof (obj as ServerError).statusCode === 'number' &&
    'message' in obj &&
    typeof (obj as ServerError).message === 'string'
  );
}
