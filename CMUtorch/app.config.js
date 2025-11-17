import 'dotenv/config';

export default {
  expo: {
    name: "YourApp",
    slug: "YourApp",
    version: "1.0.0",

    extra: {
      apiUrl: process.env.API_URL,
    },
  },
};
