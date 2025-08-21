export const config = {
  overwatch: {
    baseUrl: process.env.OVERWATCH_API_URL || 'https://overfast-api.tekrop.fr',
    timeout: 15000
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
    host: process.env.HOST || 'localhost'
  }
};