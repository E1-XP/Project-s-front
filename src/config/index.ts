export default {
  API_URL:
    process.env.NODE_ENV === 'production'
      ? `${window.location.origin}/api`
      : 'https://project-s.gtxcodeworks.site',
};
