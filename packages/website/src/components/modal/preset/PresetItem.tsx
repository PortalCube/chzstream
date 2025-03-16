import PresetBlock from "@web/components/modal/preset/PresetBlock.tsx";
import { displayPixelRatioAtom } from "@web/hooks/useDisplayPixelRatio.tsx";
import { closeModalAtom } from "@web/librarys/modal.ts";
import { applyPresetItemAtom, PresetItem } from "@web/librarys/preset.ts";
import { useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";

const Container = styled.div<{ $dpr: number; $ratio: number }>`
  width: 240px;
  margin: ${(props) => 4 / props.$dpr + "px"};
  padding: ${(props) => 2 / props.$dpr + "px"};
  aspect-ratio: ${(props) => props.$ratio};
  border-radius: 4px;

  background-color: rgb(37, 37, 37);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);

  cursor: pointer;

  transition-property: transform, box-shadow;
  transition-duration: 100ms;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

const Grid = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

function PresetButton({ preset }: PresetButtonProps) {
  const displayPixelRatio = useAtomValue(displayPixelRatioAtom);
  const applyPresetItem = useSetAtom(applyPresetItemAtom);
  const closeModal = useSetAtom(closeModalAtom);

  const blocks = preset.blocks.map((block, index) => (
    <PresetBlock key={index} position={block.position} type={block.type} />
  ));

  const onClick: React.MouseEventHandler = () => {
    applyPresetItem(preset);
    closeModal();
  };

  return (
    <Container
      $ratio={16 / 9}
      $dpr={displayPixelRatio}
      onClick={onClick}
      title={preset.name}
    >
      <Grid>{blocks}</Grid>
    </Container>
  );
}

type PresetButtonProps = {
  preset: PresetItem;
};

export default PresetButton;
