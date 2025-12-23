// global/config.ts

// ================================
// 🌐 SERVER CONFIG (Private, chỉ dùng backend)
// ================================
export const SERVER_CONFIG = {
  AUTH: {
    SECRET: process.env.AUTH_SECRET || "", // Server only
    JWT_SECRET: process.env.JWT_SECRET || "", // Server only
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
  },

  DIGITALOCEAN: {
    ACCESS_KEY: process.env.DIGITALOCEAN_ACCESS_KEY || "",
    SECRET_KEY: process.env.DIGITALOCEAN_SECRET_KEY || "",
    ENDPOINT: process.env.DIGITALOCEAN_ENDPOINT || "",
    REGION: process.env.DIGITALOCEAN_REGION || "",
    BUCKET: process.env.DIGITALOCEAN_BUCKET || "",
  },
};

// ================================
// 🌐 CLIENT CONFIG (Public, dùng FE)
// ================================
// Chỉ chứa những biến có NEXT_PUBLIC_
// Nếu muốn runtime, có thể override bằng window._env_
export const CLIENT_CONFIG = {
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
    CHAT_URL: process.env.NEXT_PUBLIC_CHAT_API || "",
    VIDEO_URL: process.env.NEXT_PUBLIC_VIDEO_API || "",
    VERSION: process.env.NEXT_PUBLIC_API_VERSION || "",
    X_API_KEY: process.env.NEXT_PUBLIC_X_API_KEY || "",
    CHECK_STUDENT_CARD_URL:
      process.env.NEXT_PUBLIC_CHECK_STUDENT_CARD_URL || "",
    CHECK_POST_URL: process.env.NEXT_PUBLIC_CHECK_POST_URL || "",
  },
};
