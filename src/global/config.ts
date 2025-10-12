export const CONFIG = {
  AUTH: {
    SECRET: process.env.AUTH_SECRET || "",
    GOOGLE: {
      ID: process.env.AUTH_GOOGLE_ID || "",
      SECRET: process.env.AUTH_GOOGLE_SECRET || "",
    },
    FACEBOOK: {
      ID: process.env.AUTH_FACEBOOK_ID || "",
      SECRET: process.env.AUTH_FACEBOOK_SECRET || "",
    },
    GITHUB: {
      ID: process.env.AUTH_GITHUB_ID || "",
      SECRET: process.env.AUTH_GITHUB_SECRET || "",
    },
    JWT_SECRET: process.env.JWT_SECRET || "",
  },

  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
    VERSION: process.env.NEXT_PUBLIC_API_VERSION || "",
    X_API_KEY: process.env.NEXT_PUBLIC_X_API_KEY || "",
    CHECK_STUDENT_CARD_URL:
      process.env.NEXT_PUBLIC_CHECK_STUDENT_CARD_URL || "",
  },

  DIGITALOCEAN: {
    ACCESS_KEY: process.env.DIGITALOCEAN_ACCESS_KEY || "",
    SECRET_KEY: process.env.DIGITALOCEAN_SECRET_KEY || "",
    ENDPOINT: process.env.DIGITALOCEAN_ENDPOINT || "",
    REGION: process.env.DIGITALOCEAN_REGION || "",
    BUCKET: process.env.DIGITALOCEAN_BUCKET || "",
  },
};
