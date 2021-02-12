export const getEnv = (varName: string) => {
  const value = process.env[varName];
  if (value === undefined) {
    console.error(`Environment variable ${varName} is not set`);
  }
  return value;
};
