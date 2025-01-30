import CornerHandle from "./CornerHandle.tsx";
import LineHandle from "./LineHandle.tsx";
import { PreviewBlockHandle } from "src/librarys/block.ts";

function Handle({ id }: HandleProps) {
  return (
    <>
      <CornerHandle id={id} direction={PreviewBlockHandle.TopLeft} />
      <LineHandle id={id} direction={PreviewBlockHandle.Top} />
      <CornerHandle id={id} direction={PreviewBlockHandle.TopRight} />
      <LineHandle id={id} direction={PreviewBlockHandle.Left} />
      <LineHandle id={id} direction={PreviewBlockHandle.Right} />
      <CornerHandle id={id} direction={PreviewBlockHandle.BottomLeft} />
      <LineHandle id={id} direction={PreviewBlockHandle.Bottom} />
      <CornerHandle id={id} direction={PreviewBlockHandle.BottomRight} />
    </>
  );
}
type HandleProps = {
  id: number;
};

export default Handle;
