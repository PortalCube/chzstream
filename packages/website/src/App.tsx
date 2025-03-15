import BlockContextMenu from "@web/components/block-context-menu/BlockContextMenu.tsx";
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
import { blockListAtom } from "@web/librarys/app.ts";
import { loadDefaultMixerAtom } from "@web/librarys/mixer.ts";
import {
  createPresetItemAtom,
  exportPresetListAtom,
} from "@web/librarys/preset.ts";
import { theme } from "@web/scripts/styled.ts";
import { useAtomValue, useSetAtom } from "jotai";
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
  const createPresetItem = useSetAtom(createPresetItemAtom);
  const presetList = useAtomValue(exportPresetListAtom);
  const blockList = useAtomValue(blockListAtom);

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

  useEffect(() => {
    const listener = (event: KeyboardEventInit) => {
      if (event.key === "F6") {
        const preset = createPresetItem("16:9");
        console.log(preset);
        window.navigator.clipboard.writeText(JSON.stringify(preset, null, 2));
        return;
      }

      if (event.key === "F8") {
        console.log(presetList);
        window.navigator.clipboard.writeText(
          JSON.stringify(presetList, null, 2)
        );
        return;
      }
    };

    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [blockList, presetList]);

  return (
    <ThemeProvider theme={theme}>
      <Modal />
      <BlockContextMenu />
      <Container>
        <Topbar />
        <Grid />
      </Container>
    </ThemeProvider>
  );
}

export default App;
