import { Server } from 'http';
import { Stream } from 'stream';
import { existsSync, mkdirSync, readFileSync, rmdirSync, rmSync } from 'fs';
import { resolve } from 'path';

import { describe, expect, it } from '@jest/globals';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as formidable from 'express-formidable';

import { AgentKeepAlive, HttpClientProvider } from '../src';

let server: Server = null;
let app: express.Express = null;

const baseURL = 'http://localhost:3000';
const imageBaseUrl = 'https://www.baidu.com';
const imageBasePath = '/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png';

const httpAgent = new AgentKeepAlive({ timeout: 15000 });
const provider = new HttpClientProvider({ baseURL, httpAgent });
const imageProvider = new HttpClientProvider({ baseURL: imageBaseUrl, httpAgent });

const tempPath = resolve(__dirname, './temp');

const client = provider.getInstance();
const imageClient = imageProvider.getInstance();

beforeAll(async () => {
  app = express();
  app.use(bodyParser.json());

  // /express base router
  app.get('/test', (req, res) => res.send({ data: req.query, message: 'success' }));
  app.get('/test/name', (req, res) => res.send({ name: req.query.name, message: 'success' }));
  app.post('/test', (req, res) => res.send({ data: req.body, message: 'success' }));
  app.put('/test', (req, res) => res.send({ data: req.body, message: 'success' }));
  app.patch('/test', (req, res) => res.send({ data: req.body, message: 'success' }));
  app.delete('/test', (req, res) => res.send({ data: req.body, message: 'success' }));
  app.options('/test', (req, res) => res.send({ data: req.body, message: 'success' }));

  // /express form router
  app.post('/test/form', formidable(), (req, res) => res.send({ name: req.fields.name, hasFile: !!req.fields.image }));
  app.put('/test/form', formidable(), (req, res) => res.send({ name: req.fields.name, hasFile: !!req.fields.image }));
  app.patch('/test/form', formidable(), (req, res) => res.send({ name: req.fields.name, hasFile: !!req.fields.image }));

  await new Promise((res) => {
    server = app.listen(3000, () => { res(1) });
  });

  mkdirSync(tempPath);
});

afterAll(async () => {
  await new Promise((res) => {
    server.close(() => { res(1) });
  });

  rmSync(tempPath + '/temp.png');
  rmdirSync(tempPath);

  provider.close();
  imageProvider.close();
});

describe('HttpClient', () => {
  it('get', async () => {
    const result = await client.get('/test', { params: { name: 'chogath' }});
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ data: { name: 'chogath' }, message: 'success' });
  });

  it('getData', async () => {
    const result = await client.getData('/test');
    expect(result).toEqual({});
  });

  it('getData', async () => {
    const result = await client.getData('/test/name', { params: { name: 'chogath' }}, 'name');
    expect(result).toBe('chogath');
  });

  it('getBuffer', async () => {
    const result = await imageClient.getBuffer(imageBasePath);
    expect(Buffer.isBuffer(result)).toBe(true);
  }, 15000);

  it('getStream', async () => {
    const result = await imageClient.getStream(imageBasePath);
    expect(result instanceof Stream).toBe(true);
  }, 15000);

  it('getBase64', async () => {
    const result = await imageClient.getBase64(imageBasePath);
    expect(typeof result === 'string').toBe(true);
  }, 15000);

  it('getAndDownload', async () => {
    const path = await imageClient.getAndDownload(imageBasePath, tempPath + '/temp.png');
    expect(existsSync(path)).toBe(true);
  }, 15000);

  it('post', async () => {
    const result = await client.post('/test', { data: { name: 'chogath' }});
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ data: { name: 'chogath' }, message: 'success' });
  });

  it('postData', async () => {
    const result = await client.postData('/test');
    expect(result).toEqual({});
  });

  it('postForm', async () => {
    const result = await client.postForm(
      '/test/form',
      { image: readFileSync(tempPath + '/temp.png'), name: 'chogath' },
    );

    expect(result.data).toEqual({ name: 'chogath', hasFile: true });
  });

  it('put', async () => {
    const result = await client.put('/test', { data: { name: 'chogath' }});
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ data: { name: 'chogath' }, message: 'success' });
  });

  it('putData', async () => {
    const result = await client.putData('/test');
    expect(result).toEqual({});
  });

  it('putForm', async () => {
    const result = await client.putForm(
      '/test/form',
      { image: readFileSync(tempPath + '/temp.png'), name: 'chogath' },
    );

    expect(result.data).toEqual({ name: 'chogath', hasFile: true });
  });

  it('patch', async () => {
    const result = await client.patch('/test', { data: { name: 'chogath' }});
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ data: { name: 'chogath' }, message: 'success' });
  });

  it('patchData', async () => {
    const result = await client.patchData('/test');
    expect(result).toEqual({});
  });

  it('patchForm', async () => {
    const result = await client.patchForm(
      '/test/form',
      { image: readFileSync(tempPath + '/temp.png'), name: 'chogath' },
    );

    expect(result.data).toEqual({ name: 'chogath', hasFile: true });
  });

  it('delete', async () => {
    const result = await client.delete('/test', { data: { name: 'chogath' }});
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ data: { name: 'chogath' }, message: 'success' });
  });

  it('options', async () => {
    const result = await client.options('/test', { data: { name: 'chogath' }});
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ data: { name: 'chogath' }, message: 'success' });
  });
});
