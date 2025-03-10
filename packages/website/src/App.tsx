import Grid from "@web/components/grid/Grid.tsx";
import Modal from "@web/components/modal/Modal.tsx";
import Topbar from "@web/components/topbar/Topbar.tsx";
import { useDisplayPixelRatio } from "@web/hooks/useDisplayPixelRatio.tsx";
import { useFullscreenDetect } from "@web/hooks/useFullscreenDetect.tsx";
import { usePlayerControlListener } from "@web/hooks/usePlayerControlListener.tsx";
import { useRefreshChannel } from "@web/hooks/useRefreshChannel.tsx";
import { useShortcutKey } from "@web/hooks/useShortcutKey.tsx";
import { useStorage } from "@web/hooks/useStorage.tsx";
import { restrictedModeAtom } from "@web/librarys/app.ts";
import { loadDefaultMixerAtom } from "@web/librarys/mixer.ts";
import {
  initializeClientMessage,
  MessageClient,
} from "@web/scripts/message.ts";
import { theme } from "@web/scripts/styled.ts";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  background-color: #000000;
  color: white;
`;

function App() {
  const setRestrictedMode = useSetAtom(restrictedModeAtom);
  const loadDefaultMixer = useSetAtom(loadDefaultMixerAtom);

  useDisplayPixelRatio();
  useFullscreenDetect();
  useShortcutKey();
  useStorage();
  useRefreshChannel();
  usePlayerControlListener();

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

    initializeClientMessage().then(() => {
      setRestrictedMode(MessageClient === null);
    });
  });

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
