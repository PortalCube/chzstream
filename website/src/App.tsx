import { useSetAtom } from "jotai";
import { useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import Grid from "./components/grid/Grid.tsx";
import Modal from "./components/modal/Modal.tsx";
import Topbar from "./components/topbar/Topbar.tsx";
import { useDisplayPixelRatio } from "./hooks/useDisplayPixelRatio.tsx";
import { useFullscreenDetect } from "./hooks/useFullscreenDetect.tsx";
import { useShortcutKey } from "./hooks/useShortcutKey.tsx";
import { useStorage } from "./hooks/useStorage.tsx";
import { restrictedModeAtom } from "./librarys/app.ts";
import { loadDefaultMixerAtom } from "./librarys/mixer.ts";
import { initializeClientMessage, MessageClient } from "./scripts/message.ts";
import { theme } from "./scripts/styled.ts";

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
