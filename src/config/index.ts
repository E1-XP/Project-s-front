export default {
  API_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://project--s.herokuapp.com'
      : 'http://localhost:3001',
};
