import { config } from 'dotenv';

if (process.env.NEXT_PUBLIC_NEXT_ENVIRONMENT !== 'production') {
  config();
}

const envConfig = {
  NEXT_ENV: process.env.NEXT_PUBLIC_NEXT_ENVIRONMENT as string,
  WEB_URL: process.env.NEXT_PUBLIC_WEB_URL as string,
  API_URL: process.env.NEXT_PUBLIC_API_URL as string,
  EMAIL: process.env.EMAIL as string,
  PASSWORD: process.env.PASSWORD as string,
};

export default envConfig;
