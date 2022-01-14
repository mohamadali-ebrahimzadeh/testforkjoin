import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Options {
  id?: string;
  notify?: boolean;
  force?: boolean;
  headers?: any;
  body?: any;
  formData?: boolean;
  params?: any;
  options?: any;
}

type SuccessCallback = (res: any) => void;
type ErrorCallback = (err: any) => void;

@Injectable()
export class ApiService {
  private _requests: Array<Observable<ArrayBuffer>> = [];

  constructor(private _http: HttpClient) {}
  public httpParams(params: any): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    for (let key in params) {
      if ((Array.isArray(params[key]) && !params[key].length) || !params[key])
        continue;
      httpParams = httpParams.append(key.toString(), params[key].toString());
    }
    return httpParams;
  }
  private _bodyHandler(method: Method, options: Options): any {
    if (!options.body) return null;
    if (options.formData) return this.formData(options.body);
    return options.body;
  }
  public formData(params: any): FormData {
    let formData = new FormData();
    for (let key in params) {
      formData.append(key, params[key]);
    }

    return formData;
  }
  public set(
    url: string,
    method: Method,
    options: Options,
    success?: SuccessCallback,
    error?: ErrorCallback
  ): Observable<any> {
    // let key: string = options.id || url;
    let req = this._http.request(method, url, {
      headers: options.headers || {},
      body: this._bodyHandler(method, options),
      params: this.httpParams(options.params),
      ...options.options
    });

    // if (!!success && (!this._requests[key] || options.force)) {
    //   this.remove(key);
    //   this._requests[key] = req;
    //   this._trigger(key, success, error);
    // }
    return req;
  }
  private _trigger(
    key: string,
    success: SuccessCallback,
    error: ErrorCallback
  ): void {
    this._requests[key] = this._requests[key].subscribe(
      (res) => {
        this.remove(key);
        success(res);
      },
      (err) => {
        this.remove(key);
        if (error) error(err);
      }
    );
  }
  public remove(key: string): void {
    if (!!this._requests[key]) {
      this._requests[key].unsubscribe();
      delete this._requests[key];
    }
  }
}
