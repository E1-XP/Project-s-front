export default {
  API_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://project-s.gtxcodeworks.site'
      : 'http://localhost:3001',
};
