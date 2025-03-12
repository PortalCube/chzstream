import Grid from "@web/components/grid/Grid.tsx";
import Modal from "@web/components/modal/Modal.tsx";
import Topbar from "@web/components/topbar/Topbar.tsx";
import { useDisplayPixelRatio } from "@web/hooks/useDisplayPixelRatio.tsx";
import { useFullscreenDetect } from "@web/hooks/useFullscreenDetect.tsx";
import { useMessageClient } from "@web/hooks/useMessageClient.ts";
import { usePlayerControlListener } from "@web/hooks/usePlayerControlListener.tsx";
import { useRefreshChannel } from "@web/hooks/useRefreshChannel.tsx";
import { useSafariScrollPrevent } from "@web/hooks/useSafariScrollPrevent.ts";
import { useShortcutKey } from "@web/hooks/useShortcutKey.tsx";
import { useStorage } from "@web/hooks/useStorage.tsx";
import { loadDefaultMixerAtom } from "@web/librarys/mixer.ts";
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
  const loadDefaultMixer = useSetAtom(loadDefaultMixerAtom);

  useMessageClient();
  useDisplayPixelRatio();
  useFullscreenDetect();
  useShortcutKey();
  useStorage();
  useRefreshChannel();
  usePlayerControlListener();
  useSafariScrollPrevent();

  useEffect(() => {
    loadDefaultMixer();
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
