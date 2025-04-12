import { BlockContextMenuContext } from "@web/librarys/context.ts";
import {
  modifyBlockOptionsAtom,
  sendBlockOptionsAtom,
} from "@web/librarys/layout.ts";
import classNames from "classnames";
import { useSetAtom } from "jotai";
import { useContext } from "react";
import {
  MdAlignHorizontalLeft,
  MdAlignHorizontalRight,
  MdAlignVerticalBottom,
  MdAlignVerticalTop,
  MdAspectRatio,
  MdOpenInFull,
  MdOpenWith,
} from "react-icons/md";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  &.hidden {
    display: none;
  }
`;

const Button = styled.button`
  padding: 6px;
  border: none;

  display: flex;
  align-items: center;

  border-radius: 8px;
  background-color: rgb(42, 42, 42);
  color: rgb(255, 255, 255);

  cursor: pointer;
  transition: background-color 100ms;

  &:hover {
    background-color: rgb(50, 50, 50);
  }

  &.selected {
    color: rgb(24, 24, 24);
    background-color: rgb(220, 220, 220);
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: rgb(53, 53, 53);
`;

type ObjectPositionItem = {
  icon: React.ElementType;
  value: "left" | "right" | "top" | "bottom";
  direction?: "horizontal" | "vertical";
};

type ObjectFitItem = {
  icon: React.ElementType;
  value: string;
};

const objectPositionItems: ObjectPositionItem[] = [
  {
    icon: MdAlignHorizontalLeft,
    value: "left",
    direction: "horizontal",
  },
  {
    icon: MdAlignHorizontalRight,
    value: "right",
    direction: "horizontal",
  },
  {
    icon: MdAlignVerticalTop,
    value: "top",
    direction: "vertical",
  },
  {
    icon: MdAlignVerticalBottom,
    value: "bottom",
    direction: "vertical",
  },
];

const objectFitItems: ObjectFitItem[] = [
  {
    icon: MdAspectRatio,
    value: "contain",
  },
  {
    icon: MdOpenInFull,
    value: "cover",
  },
  {
    icon: MdOpenWith,
    value: "fill",
  },
];

function PositionMenu() {
  const block = useContext(BlockContextMenuContext);
  const modifyBlockOptions = useSetAtom(modifyBlockOptionsAtom);
  const sendBlockOptions = useSetAtom(sendBlockOptionsAtom);

  const onPositionClick = (
    item: ObjectPositionItem
  ): React.MouseEventHandler => {
    return () => {
      if (block === null) return;

      if (item.direction === "horizontal") {
        let horizontal = item.value as "left" | "center" | "right";

        const oldHorizontal = block.options.objectPosition.horizontal;

        if (oldHorizontal === horizontal) {
          horizontal = "center";
        }

        modifyBlockOptions(block.id, {
          objectPosition: {
            ...block.options.objectPosition,
            horizontal,
          },
        });

        sendBlockOptions(block.id);
      } else if (item.direction === "vertical") {
        let vertical = item.value as "top" | "center" | "bottom";

        const oldVertical = block.options.objectPosition.vertical;

        if (oldVertical === vertical) {
          vertical = "center";
        }

        modifyBlockOptions(block.id, {
          objectPosition: {
            ...block.options.objectPosition,
            vertical,
          },
        });

        sendBlockOptions(block.id);
      }
    };
  };

  const onFitClick = (item: ObjectFitItem): React.MouseEventHandler => {
    return () => {
      if (block === null) return;

      const objectFit = item.value as "contain" | "cover" | "fill";
      modifyBlockOptions(block.id, { objectFit });

      sendBlockOptions(block.id);
    };
  };

  const positionItems = objectPositionItems.map((item) => (
    <Button
      key={item.value}
      onClick={onPositionClick(item)}
      className={classNames({
        selected: block?.options.objectPosition[item.direction!] === item.value,
      })}
    >
      <item.icon size={20} />
    </Button>
  ));

  const fitItems = objectFitItems.map((item) => (
    <Button
      key={item.value}
      onClick={onFitClick(item)}
      className={classNames({
        selected: block?.options.objectFit === item.value,
      })}
    >
      <item.icon size={20} />
    </Button>
  ));

  const className = classNames({
    hidden: block?.type !== "stream",
  });

  return (
    <Container className={className}>
      <Row>{positionItems}</Row>
      <Row>{fitItems}</Row>
      <Divider />
    </Container>
  );
}

export default PositionMenu;
