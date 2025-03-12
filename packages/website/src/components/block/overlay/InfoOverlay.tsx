import { removeBlockAtom } from "@web/librarys/layout.ts";
import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import { useContext, useMemo } from "react";
import styled, { css } from "styled-components";

import Channel from "@web/components/block/overlay/Channel.tsx";
import { InfoType } from "@web/components/block/overlay/InfoOverlay.ts";
import Keyword, {
  KeywordProps,
} from "@web/components/block/overlay/Keyword.tsx";
import OfflineIcon from "@web/components/block/overlay/OfflineIcon.tsx";
import { displayPixelRatioAtom } from "@web/hooks/useDisplayPixelRatio.tsx";
import { layoutModeAtom } from "@web/librarys/app.ts";
import { BlockContext } from "@web/librarys/context.ts";
import { Mixin } from "@web/scripts/styled.ts";
import { MdClose, MdLock } from "react-icons/md";

const Container = styled.div<{ $dpr: number }>`
  overflow: hidden;

  position: absolute;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  min-width: 210px;

  border: 1px solid #1f1f1f;
  background-color: #121212;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  ${Mixin.block.greater.extraLarge(css`
    padding: 48px 36px;
    gap: 16px;
  `)}

  ${Mixin.block.less.extraLarge(css`
    padding: 36px 28px;
    gap: 12px;
  `)}
  
  ${Mixin.block.less.large(css`
    padding: 28px 18px;
    gap: 8px;
  `)}
  
  ${Mixin.block.less.medium(css`
    padding: 0 12px;
    gap: 6px;
  `)}
  
  ${Mixin.block.less.small(css`
    padding: 0 8px;
    gap: 4px;
  `)}

  opacity: 1;
  transition: opacity 100ms;

  &.hidden {
    display: none;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;

  border: none;
  border-radius: 4px;
  padding: 4px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: rgba(255, 255, 255, 0.25);
  cursor: pointer;

  transition:
    color 100ms,
    background-color 100ms;
  background-color: rgba(255, 255, 255, 0);

  &:hover {
    color: rgba(255, 255, 255, 1);
    background-color: rgba(255, 255, 255, 0.1);
  }

  & > svg {
    transition:
      width 100ms,
      height 100ms;

    ${Mixin.block.greater.large(css`
      width: 24px;
      height: 24px;
    `)}

    ${Mixin.block.less.large(css`
      width: 20px;
      height: 20px;
    `)}
  
    ${Mixin.block.less.small(css`
      width: 16px;
      height: 16px;
    `)}
  }
`;

const Title = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  ${Mixin.block.greater.extraLarge(css`
    font-size: 40px;
    gap: 12px;
  `)}

  ${Mixin.block.less.extraLarge(css`
    font-size: 32px;
    gap: 12px;
  `)}
  
  ${Mixin.block.less.large(css`
    font-size: 24px;
    gap: 10px;
  `)}
  
  ${Mixin.block.less.medium(css`
    font-size: 18px;
    gap: 8px;
  `)}
  
  ${Mixin.block.less.small(css`
    font-size: 14px;
    gap: 8px;
  `)}
`;

const Row = styled.div`
  max-width: 100%;

  display: flex;
  align-items: center;
  white-space: pre-wrap;

  font-weight: 800;
`;

const Text = styled.span`
  flex-shrink: 0;
`;

const Description = styled.p`
  margin-top: 8px;
  font-weight: 400;
  color: rgba(159, 159, 159, 1);

  text-wrap: balance;
  word-break: keep-all;

  text-align: center;

  ${Mixin.block.greater.extraLarge(css`
    font-size: 18px;
  `)}

  ${Mixin.block.less.extraLarge(css`
    font-size: 15px;
  `)}
  
  ${Mixin.block.less.large(css`
    font-size: 12px;
  `)}
  
  ${Mixin.block.less.medium(css`
    font-size: 12px;
    line-height: 14px;
  `)}
  
  ${Mixin.block.less.small(css`
    font-size: 10px;
    line-height: 12px;
  `)}
`;

const KEYWORDS: Record<string, KeywordProps> = {
  offline: {
    text: "오프라인",
    icon: OfflineIcon,
    textColor: "rgb(200, 200, 200)",
    backgroundColor: "rgb(68, 68, 68)",
  },
  adult: {
    text: "연령 제한 방송",
    icon: MdLock,
    textColor: "rgb(255, 255, 255)",
    backgroundColor: "rgb(221, 31, 72)",
  },
};

type Info = {
  id: string;
  title: Template[];
  message: string;
};

type Template = (string | ElementInfo)[];

const INFOS: Info[] = [
  {
    id: "offline",
    title: [
      template`${"channel"}님은`,
      template`현재 ${"keyword:offline"} 입니다`,
    ],
    message: "방송이 시작되면 여기에 화면이 표시됩니다.",
  },
  {
    id: "adult",
    title: [
      template`${"channel"}님은`,
      template`현재 ${"keyword:adult"} 중입니다`,
    ],
    message: "방송을 시청하려면 해당 플랫폼에서 성인 계정으로 로그인하세요.",
  },
  {
    id: "error",
    title: [template`플레이어에서 오류가 발생했습니다`],
    message: "페이지를 새로 고치고 있습니다. 잠시만 기다려주세요...",
  },
  {
    id: "no-channel",
    title: [template`채널이 지정되지 않았습니다`],
    message: "편집 모드에서 이 블록의 채널을 지정하세요.",
  },
];

type ElementInfo = {
  type: "none" | "channel" | "keyword";
} & Record<string, unknown>;

function getElementInfo(token: string[]): ElementInfo {
  const elementType = token[0];

  if (elementType === "channel") {
    return {
      type: "channel",
    };
  } else if (elementType === "keyword") {
    const elementArg = token[1];

    if (elementArg in KEYWORDS) {
      return {
        type: "keyword",
        ...KEYWORDS[elementArg],
      };
    }
  }

  return {
    type: "none",
  };
}

function template(texts: TemplateStringsArray, ...tokens: string[]) {
  const result: Template = [];
  for (let i = 0; i < texts.length; i++) {
    result.push(texts[i]);

    if (i < tokens.length) {
      const token = tokens[i].split(":");
      const elementInfo = getElementInfo(token);
      result.push(elementInfo);
    }
  }
  return result;
}

function render(info: Info) {
  const title = info.title.map((row: Template, index: number) => {
    return (
      <Row key={index}>
        {row.map((element: string | ElementInfo, index: number) => {
          if (typeof element === "string") {
            return <Text key={index}>{element}</Text>;
          }

          if (element.type === "channel") {
            return <Channel key={index} />;
          } else if (element.type === "keyword") {
            const text = element.text as string;
            const icon = element.icon as (props: object) => React.ReactNode;
            const textColor = element.textColor as string;
            const backgroundColor = element.backgroundColor as string;

            return (
              <Keyword
                key={index}
                text={text}
                icon={icon}
                textColor={textColor}
                backgroundColor={backgroundColor}
              />
            );
          }

          return null;
        })}
      </Row>
    );
  });

  return (
    <>
      <Title>{title}</Title>
      <Description>{info.message}</Description>
    </>
  );
}

function InfoOverlay({ type }: InfoOverlayProps) {
  const displayPixelRatio = useAtomValue(displayPixelRatioAtom);
  const layoutMode = useAtomValue(layoutModeAtom);
  const removeBlock = useSetAtom(removeBlockAtom);
  const { id } = useContext(BlockContext);

  const isShow = useMemo(
    () => layoutMode === "view" && type !== "none",
    [layoutMode, type]
  );

  const content = useMemo(() => {
    if (type === "none") {
      return null;
    }

    const info = INFOS.find((info) => info.id === type);

    if (info === undefined) {
      return null;
    }

    return render(info);
  }, [type]);

  const className = classNames({
    hidden: !isShow,
  });

  const onRemoveButtonClick = () => {
    removeBlock(id);
  };

  const onDragEnter: React.DragEventHandler = (event) => {
    event.preventDefault();
  };

  const onDragOver: React.DragEventHandler = (event) => {
    event.preventDefault();
  };

  return (
    <Container
      className={className}
      $dpr={displayPixelRatio}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
    >
      <RemoveButton onClick={onRemoveButtonClick}>
        <MdClose />
      </RemoveButton>
      {content}
    </Container>
  );
}

type InfoOverlayProps = {
  type: InfoType;
};

export default InfoOverlay;
