import ButtonMenuSlider from "@web/components/block-context-menu/ButtonMenuSlider";
import { BlockContextMenuContext } from "@web/librarys/context.ts";
import { modifyBlockOptionsAtom } from "@web/librarys/layout.ts";
import { useSetAtom } from "jotai";
import { useContext } from "react";
import { MdZoomIn } from "react-icons/md";
import styled from "styled-components";

const Slider = styled(ButtonMenuSlider)`
  padding: 6px 8px;
  padding-top: 0;
`;

function ZoomLevel({}: ZoomLevelProps) {
  const block = useContext(BlockContextMenuContext);
  const modifyBlockOptions = useSetAtom(modifyBlockOptionsAtom);

  const id = block?.id ?? 0;
  const zoom = block?.options.zoom ?? 1.0;

  const displayValue = zoom.toFixed(2) + "x";

  const onInput = (value: number) => {
    modifyBlockOptions(id, { zoom: value });
  };

  const options = {
    icon: MdZoomIn,
    value: zoom,
    displayValue,
    min: 0.5,
    max: 1.5,
    step: 0.1,
    onInput,
  };

  return <Slider options={options} />;
}

type ZoomLevelProps = {};

export default ZoomLevel;
