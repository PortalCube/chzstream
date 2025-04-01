import CornerHandle from "@web/components/block/edit-block/handle/CornerHandle.tsx";
import LineHandle from "@web/components/block/edit-block/handle/LineHandle.tsx";

function Handle({}: HandleProps) {
  return (
    <>
      <CornerHandle direction={"top-left"} />
      <LineHandle direction={"top"} />
      <CornerHandle direction={"top-right"} />
      <LineHandle direction={"left"} />
      <LineHandle direction={"right"} />
      <CornerHandle direction={"bottom-left"} />
      <LineHandle direction={"bottom"} />
      <CornerHandle direction={"bottom-right"} />
    </>
  );
}
type HandleProps = {};

export default Handle;
