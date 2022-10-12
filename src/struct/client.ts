import { writeFileSync } from 'fs';
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

    return result.data as Buffer;
  }

  @This
  public async getStream(url: string, config?: AxiosRequestConfig) {
    const result = await this.get(
      url,
      Object.assign({ responseType: 'stream' }, config),
    );

    return result.data as Stream;
  }

  @This
  public async getBase64(url: string, config?: AxiosRequestConfig) {
    const data = await this.getBuffer(url, config);
    return data.toString('base64');
  }

  @This
  public async getAndDownload(url: string, path: string, config?: AxiosRequestConfig) {
    const buffer = await this.getBuffer(url, config);

    writeFileSync(path, buffer, 'binary');

    return path;
  }

  /** Method POST */
  @This
  public async post(url: string, config?: AxiosRequestConfig) {
    const result = await this.instance.post(url, config?.data, config);
    return result;
  }

  @This
  public async postData(url: string, config?: AxiosRequestConfig, key = 'data') {
    const result = await this.post(url, config);
    return this.getDataValue(result, key);
  }

  @This
  public async postForm(url: string, data: Record<string, any>, config?: Omit<AxiosRequestConfig, 'data'>) {
    const { configData, formData } = this.getFormDataConfig(data, config);
    const result = await this.instance.postForm(url, formData, configData);
    return result;
  }

  /** Method PUT */
  @This
  public async put(url: string, config?: AxiosRequestConfig) {
    const result = await this.instance.put(url, config?.data, config);
    return result;
  }

  @This
  public async putData(url: string, config?: AxiosRequestConfig, key = 'data') {
    const result = await this.put(url, config);
    return this.getDataValue(result, key);
  }

  @This
  public async putForm(url: string, data: Record<string, any>, config?: Omit<AxiosRequestConfig, 'data'>) {
    const { configData, formData } = this.getFormDataConfig(data, config);
    const result = await this.instance.putForm(url, formData, configData);
    return result;
  }

  /** Method PATCH */
  @This
  public async patch(url: string, config?: AxiosRequestConfig) {
    const result = await this.instance.patch(url, config?.data, config);
    return result;
  }

  @This
  public async patchData(url: string, config?: AxiosRequestConfig, key = 'data') {
    const result = await this.patch(url, config);
    return this.getDataValue(result, key);
  }

  @This
  public async patchForm(url: string, data: Record<string, any>, config?: Omit<AxiosRequestConfig, 'data'>) {
    const { configData, formData } = this.getFormDataConfig(data, config);
    const result = await this.instance.patchForm(url, formData, configData);
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
  private getFormDataConfig(data: Record<string, any>, config?: Omit<AxiosRequestConfig, 'data'>) {
    const formData = new FormData();
    const configData = Object.assign({ headers: formData.getHeaders() }, config);

    Object.keys(data).forEach((key) => formData.append(key, data[key]));

    return { formData, configData };
  }

  private getDataValue(result: Record<string, any>, key: string) {
    return result.data[key];
  }
}
