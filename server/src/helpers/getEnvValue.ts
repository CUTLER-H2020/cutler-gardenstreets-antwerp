export const getEnvValue = (envVarName: string) => {
    const value = process.env[envVarName];
    if (value === undefined) {
        console.error(`Please set the ${envVarName} environment variable`);
        process.exit(1);
    }
    return value;
};
