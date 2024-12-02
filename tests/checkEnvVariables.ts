import envConfig from '@/envConfig';

export const checkEnvVariables = () => {
  const missingKeys = (
    Object.keys(envConfig) as Array<keyof typeof envConfig>
  ).filter((key) => envConfig[key] === undefined);

  // Check that there are no missing environment variables
  if (missingKeys.length > 0) {
    throw new Error(
      `Missing environment variables: \n${missingKeys.join('\n')}\n`,
    );
  }
};
