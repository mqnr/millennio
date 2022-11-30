/* eslint-disable max-classes-per-file */
import fetch, { Response } from 'node-fetch';
import { Readable } from 'stream';
import { FormDataEncoder } from 'form-data-encoder';
import { FormData } from 'formdata-node';
import {
  CanvasError,
  ConflictError,
  InvalidAccessTokenError,
  ResourceDoesNotExistError,
  UnauthorizedError,
  UnprocessableEntityError,
} from './errors';

class BaseCanvasClient {
  apiUrl: string;
  apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  get(route: string, parameters: URLSearchParams): Promise<Response> {
    return this.request('GET', route, parameters);
  }

  post(
    route: string,
    parameters: URLSearchParams | FormData
  ): Promise<Response> {
    return this.request('POST', route, parameters);
  }

  async request(
    method: string,
    route: string,
    parameters: URLSearchParams | FormData
  ): Promise<Response> {
    const shouldUrlEncode = parameters instanceof URLSearchParams;

    const url = shouldUrlEncode
      ? `${this.apiUrl}${route}?${parameters}`
      : `${this.apiUrl}${route}`;
    const encoder = shouldUrlEncode
      ? undefined
      : new FormDataEncoder(parameters);

    const response = await fetch(url, {
      method,
      body: shouldUrlEncode ? undefined : Readable.from(encoder),
      headers: shouldUrlEncode
        ? { Authorization: `Bearer ${this.apiKey}` }
        : {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': encoder.headers['Content-Type'],
            'Content-Length': encoder.headers['Content-Length'],
          },
    });

    switch (response.status) {
      case 400:
        throw new CanvasError(await response.text());
      case 401:
        if (response.headers.has('WWW-Authenticate')) {
          throw new InvalidAccessTokenError(await response.text());
        } else {
          throw new UnauthorizedError(await response.text());
        }
      case 404:
        throw new ResourceDoesNotExistError('Not found');
      case 409:
        throw new ConflictError(await response.text());
      case 422:
        throw new UnprocessableEntityError(await response.text());
      default:
        if (response.status > 400) {
          throw new CanvasError(
            `Encountered an error: status code ${response.status}`
          );
        }
    }

    return response;
  }
}

export class CanvasClient extends BaseCanvasClient {}
