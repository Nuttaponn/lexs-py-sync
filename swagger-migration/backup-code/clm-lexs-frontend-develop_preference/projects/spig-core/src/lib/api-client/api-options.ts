export interface ApiOptions {
  observe?: string;
  responseType?: string;
  reportProgress?: boolean;
  ignoreLoading?: boolean;
}

export interface BodyApiOptions extends ApiOptions {
  observe?: 'body';
  responseType?: 'json';
}

export interface ResponseApiOptions extends ApiOptions {
  observe?: 'response';
  responseType?: 'json';
}

export interface EventApiOptions extends ApiOptions {
  observe?: 'events';
  responseType?: 'json';
}

export interface BlobApiOptions extends ApiOptions {
  observe?: 'body';
  responseType?: 'blob';
}
