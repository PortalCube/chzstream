import { useAtom } from "jotai";
import { useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import Grid from "./components/grid/Grid.tsx";
import Modal from "./components/modal/Modal.tsx";
import Topbar from "./components/topbar/Topbar.tsx";
import { useDisplayPixelRatio } from "./hooks/useDisplayPixelRatio.tsx";
import { useFullscreenDetect } from "./hooks/useFullscreenDetect.tsx";
import { useShortcutKey } from "./hooks/useShortcutKey.tsx";
import { useStorage } from "./hooks/useStorage.tsx";
import { initializeClientMessage, MessageClient } from "./scripts/message.ts";
import { theme } from "./scripts/styled.ts";
import { restrictedModeAtom } from "./librarys/app.ts";

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
  useDisplayPixelRatio();
  useFullscreenDetect();
  useShortcutKey();
  useStorage();

  const [restrictedMode, setRestrictedMode] = useAtom(restrictedModeAtom);

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
    if (MessageClient.available === false) {
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
