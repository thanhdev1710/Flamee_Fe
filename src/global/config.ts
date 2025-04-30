export const CONFIG = {
  API_GATEWAY: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || "",
    API_VERSION: process.env.NEXT_PUBLIC_API_VERSION || "",
  },
  X_API_KEY: process.env.NEXT_PUBLIC_X_API_KEY || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  DIGITALOCEAN_ACCESS_KEY: process.env.DIGITALOCEAN_ACCESS_KEY || "",
  DIGITALOCEAN_SECRET_KEY: process.env.DIGITALOCEAN_SECRET_KEY || "",
  DIGITALOCEAN_ENDPOINT: process.env.ENDPOINT || "",
  DIGITALOCEAN_REGION: process.env.REGION || "",
};
