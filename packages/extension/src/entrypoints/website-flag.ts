export default defineUnlistedScript(() => {
  // @ts-expect-error Custom Property
  window.__CHZSTREAM_EXTENSION__ = true;
});
