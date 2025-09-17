module.exports = () => ({
  'content-manager': {
    config: {
      // Disable preview URLs to avoid documentId validation errors
      // when accessing content types without specific document context
      previewUrl: false,
    },
  },
});
