import { NextResponse } from "next/server";

export interface ApiResponseOptions<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
  status?: number;
}

export function apiResponse<T = any>({
  success,
  message,
  data,
  meta,
  status = 200,
}: ApiResponseOptions<T>) {
  return NextResponse.json(
    {
      success,
      message,
      data,
      meta,
    },
    { status }
  );
}

export function apiSuccess<T = any>(
  message: string,
  data?: T,
  meta?: any,
  status = 200
) {
  return apiResponse<T>({
    success: true,
    message,
    data,
    meta,
    status,
  });
}

export function apiError(message: string, status = 400, data?: any) {
  return apiResponse({
    success: false,
    message,
    data,
    status,
  });
}
