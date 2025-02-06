import CornerHandle from "./CornerHandle.tsx";
import LineHandle from "./LineHandle.tsx";
import { PreviewBlockHandle } from "src/librarys/block.ts";

function Handle({}: HandleProps) {
  return (
    <>
      <CornerHandle direction={PreviewBlockHandle.TopLeft} />
      <LineHandle direction={PreviewBlockHandle.Top} />
      <CornerHandle direction={PreviewBlockHandle.TopRight} />
      <LineHandle direction={PreviewBlockHandle.Left} />
      <LineHandle direction={PreviewBlockHandle.Right} />
      <CornerHandle direction={PreviewBlockHandle.BottomLeft} />
      <LineHandle direction={PreviewBlockHandle.Bottom} />
      <CornerHandle direction={PreviewBlockHandle.BottomRight} />
    </>
  );
}
type HandleProps = {};

export default Handle;
