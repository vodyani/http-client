import { Injectable } from '@nestjs/common';
import { This } from '@vodyani/class-decorator';
import { IClientAdapter } from '@vodyani/core';

import { AxiosRequestConfig } from '../common';
import { HttpClient } from '../struct';

@Injectable()
export class HttpClientAdapter implements IClientAdapter<HttpClient> {
  private instance: HttpClient;

  @This
  public create(config?: AxiosRequestConfig) {
    this.instance = new HttpClient(config);
  }

  @This
  public connect() {
    return this.instance;
  }

  @This
  public close() {
    this.instance = null;
  }

  @This
  public redeploy(config?: AxiosRequestConfig) {
    this.instance = new HttpClient(config);
  }
}
