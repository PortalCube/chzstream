import CornerHandle from "@web/components/block/edit-block/handle/CornerHandle.tsx";
import LineHandle from "@web/components/block/edit-block/handle/LineHandle.tsx";
import { PreviewBlockHandle } from "@web/librarys/block.ts";

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
