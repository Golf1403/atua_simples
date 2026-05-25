import { format, getDate } from 'date-fns';
import { S3 } from 'aws-sdk';
import axios from 'axios';

export class AWSS3 {
  private s3: S3;
  private bucket = `sei-calculos-assets-${
    process.env.REACT_APP_ENV.includes('qa') ? 'dev' : process.env.REACT_APP_ENV || 'dev'
  }`;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    });
  }

  public upload = (file: string | File | Blob, url: string, contentType: string) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const axiosResponse = axios.create();
        await axiosResponse.put(url, file, { headers: { 'Content-Type': contentType } });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  public getKey(contentType: string, fileName: string, path: string) {
    return new Promise<{ key: string; url: string }>(resolve => {
      const Key = `${path}/${fileName}.msgpack`;

      this.s3.getSignedUrl(
        'putObject',
        {
          Bucket: this.bucket,
          ContentType: contentType,
          Key,
        },
        (error, url) => {
          resolve({ key: path, url });
        }
      );
    });
  }
  public getValue(key: string) {
    const data = this.s3
      .getObject({
        Bucket: this.bucket,
        Key: key,
      })
      .promise();
    return data;
  }
}
