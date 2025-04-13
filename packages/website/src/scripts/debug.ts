export function printStartupMessage() {
  const BUILD_TIMESTAMP = import.meta.env.VITE_BUILD_TIMESTAMP;
  const BUILD_COMMIT_SHA = import.meta.env.VITE_BUILD_COMMIT_SHA;
  const BUILD_VERSION = import.meta.env.VITE_BUILD_VERSION;

  console.log(`
   ██████ ██   ██ ███████ ███████ ████████ ██████  ███████  █████  ███    ███ 
  ██      ██   ██    ███  ██         ██    ██   ██ ██      ██   ██ ████  ████ 
  ██      ███████   ███   ███████    ██    ██████  █████   ███████ ██ ████ ██ 
  ██      ██   ██  ███         ██    ██    ██   ██ ██      ██   ██ ██  ██  ██ 
   ██████ ██   ██ ███████ ███████    ██    ██   ██ ███████ ██   ██ ██      ██ 
  
  v${BUILD_VERSION} (${BUILD_COMMIT_SHA})
  ${BUILD_TIMESTAMP}`);
}
