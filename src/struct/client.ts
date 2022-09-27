import { existsSync, writeFileSync } from 'fs';
import { Stream } from 'stream';

import { This } from '@vodyani/class-decorator';

import { Axios, AxiosInstance, AxiosRequestConfig, FormData } from '../common';

export class HttpClient {
  private instance: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.instance = Axios.create(config);
  }

  /** Method GET */
  @This
  public async get(url: string, config?: AxiosRequestConfig) {
    const result = await this.instance.get(url, config);
    return result;
  }

  @This
  public async getData(url: string, config?: AxiosRequestConfig, key = 'data') {
    const result = await this.get(url, config);
    return this.getDataValue(result, key);
  }

  @This
  public async getBuffer(url: string, config?: AxiosRequestConfig) {
    const result = await this.get(
      url,
      Object.assign({ responseType: 'arraybuffer' }, config),
    );

    if (!result) return null;
    return result.data as Buffer;
  }

  @This
  public async getStream(url: string, config?: AxiosRequestConfig) {
    const result = await this.get(
      url,
      Object.assign({ responseType: 'stream' }, config),
    );

    if (!result) return null;
    return result.data as Stream;
  }

  @This
  public async getBase64(url: string, config?: AxiosRequestConfig) {
    const data = await this.getBuffer(url, config);

    if (!data) return null;
    return data.toString('base64');
  }

  @This
  public async getAndDownload(url: string, path: string, config?: AxiosRequestConfig) {
    if (!existsSync(path)) {
      throw new Error(`The ${path} does not exist`);
    }

    const buffer = await this.getBuffer(url, config);

    if (!buffer) return null;

    writeFileSync(path, buffer, 'binary');

    return path;
  }

  /** Method POST */
  @This
  public async post(url: string, config?: AxiosRequestConfig) {
    const result = await this.instance.post(url, config.data, config);
    return result;
  }

  @This
  public async postData(url: string, config?: AxiosRequestConfig, key = 'data') {
    const result = await this.post(url, config);
    return this.getDataValue(result, key);
  }

  @This
  public async postForm(url: string, data: Record<string, any>, config: AxiosRequestConfig) {
    const form = new FormData();
    const configs = Object.assign({ headers: form.getHeaders() }, config);

    Object.keys(data).forEach((key) => form.append(key, data[key]));

    const result = await this.instance.postForm(url, form, configs);
    return result;
  }

  /** Method PUT */
  @This
  public async put(url: string, config?: AxiosRequestConfig) {
    const result = await this.instance.put(url, config.data, config);
    return result;
  }

  @This
  public async putData(url: string, config?: AxiosRequestConfig, key = 'data') {
    const result = await this.put(url, config);
    return this.getDataValue(result, key);
  }

  @This
  public async putForm(url: string, data: Record<string, any>, config: AxiosRequestConfig) {
    const form = new FormData();
    const configs = Object.assign({ headers: form.getHeaders() }, config);

    Object.keys(data).forEach((key) => form.append(key, data[key]));

    const result = await this.instance.putForm(url, form, configs);
    return result;
  }

  /** Method PATCH */
  @This
  public async patch(url: string, config?: AxiosRequestConfig) {
    const result = await this.instance.patch(url, config.data, config);
    return result;
  }

  @This
  public async patchData(url: string, config?: AxiosRequestConfig, key = 'data') {
    const result = await this.patch(url, config);
    return this.getDataValue(result, key);
  }

  @This
  public async patchForm(url: string, data: Record<string, any>, config: AxiosRequestConfig) {
    const form = new FormData();
    const configs = Object.assign({ headers: form.getHeaders() }, config);

    Object.keys(data).forEach((key) => form.append(key, data[key]));

    const result = await this.instance.patchForm(url, form, configs);
    return result;
  }

  /** Method Delete */
  @This
  public async delete(url: string, config?: AxiosRequestConfig) {
    const result = await this.instance.delete(url, config);
    return result;
  }

  /** Method Options */
  @This
  public async options(url: string, config?: AxiosRequestConfig) {
    const result = await this.instance.options(url, config);
    return result;
  }

  /** Common */
  private async getDataValue(result: Record<string, any>, key = 'data') {
    return result?.data[key] || null;
  }
}
