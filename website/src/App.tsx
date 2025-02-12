import { useSetAtom } from "jotai";
import { useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import Grid from "src/components/grid/Grid.tsx";
import Modal from "src/components/modal/Modal.tsx";
import Topbar from "src/components/topbar/Topbar.tsx";
import { useDisplayPixelRatio } from "src/hooks/useDisplayPixelRatio.tsx";
import { useFullscreenDetect } from "src/hooks/useFullscreenDetect.tsx";
import { useShortcutKey } from "src/hooks/useShortcutKey.tsx";
import { useStorage } from "src/hooks/useStorage.tsx";
import { restrictedModeAtom } from "src/librarys/app.ts";
import { loadDefaultMixerAtom } from "src/librarys/mixer.ts";
import { initializeClientMessage, MessageClient } from "src/scripts/message.ts";
import { theme } from "src/scripts/styled.ts";
import { useRefreshChannel } from "src/hooks/useRefreshChannel.tsx";

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  background-color: #000000;
  color: white;
`;

initializeClientMessage();

function App() {
  const setRestrictedMode = useSetAtom(restrictedModeAtom);
  const loadDefaultMixer = useSetAtom(loadDefaultMixerAtom);

  useDisplayPixelRatio();
  useFullscreenDetect();
  useShortcutKey();
  useStorage();
  useRefreshChannel();

  // iOS Safari prevent scrolling
  useEffect(() => {
    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();
    };

    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  useEffect(() => {
    loadDefaultMixer();

    if (MessageClient.active === false) {
      setRestrictedMode(true);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Modal />
      <Container>
        <Topbar />
        <Grid />
      </Container>
    </ThemeProvider>
  );
}

export default App;
