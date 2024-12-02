import { config } from 'dotenv';

if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
  config();
}

const envConfig = {
  NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV as string,
  WEB_URL: process.env.NEXT_PUBLIC_WEB_URL as string,
  API_URL: process.env.NEXT_PUBLIC_API_URL as string,
  EMAIL: process.env.NEXT_PUBLIC_EMAIL as string,
  PASSWORD: process.env.NEXT_PUBLIC_PASSWORD as string,
};

export default envConfig;
