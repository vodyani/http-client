import { Injectable } from '@nestjs/common';
import { This } from '@vodyani/class-decorator';
import { Client } from '@vodyani/core';

import { AxiosRequestConfig } from '../common';
import { HttpClient } from '../struct';

@Injectable()
export class HttpClientProvider implements Client<HttpClient> {
  private instance: HttpClient;

  constructor(config?: AxiosRequestConfig) {
    this.instance = new HttpClient(config);
  }

  @This
  public getInstance() {
    return this.instance;
  }

  @This
  public close() {
    this.instance = null;
  }
}
