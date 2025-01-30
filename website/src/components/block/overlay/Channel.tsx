import { useMemo } from "react";
import styled, { css } from "styled-components";

import { IconType } from "react-icons";
import {
  extraLargeBlockMixin,
  extraSmallBlockMixin,
  largeBlockMixin,
  mediumBlockMixin,
  smallBlockMixin,
} from "src/scripts/styled.ts";
import { findBlock } from "src/librarys/grid.ts";

const Container = styled.div`
  overflow: hidden;

  display: flex;
  align-items: center;

  ${extraLargeBlockMixin(css`
    gap: 12px;
  `)}

  ${largeBlockMixin(css`
    gap: 10px;
  `)}

  ${mediumBlockMixin(css`
    gap: 8px;
  `)}

  ${smallBlockMixin(css`
    gap: 6px;
  `)}

  ${extraSmallBlockMixin(css`
    gap: 4px;
  `)}
`;

const Icon = styled.img`
  ${extraLargeBlockMixin(css`
    width: 44px;
    height: 44px;
  `)}

  ${largeBlockMixin(css`
    width: 36px;
    height: 36px;
  `)}

  ${mediumBlockMixin(css`
    width: 28px;
    height: 28px;
  `)}

  ${smallBlockMixin(css`
    width: 20px;
    height: 20px;
  `)}

  ${extraSmallBlockMixin(css`
    width: 14px;
    height: 14px;
  `)}

  border-radius: 50%;
  object-fit: cover;
`;

const Name = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

function Channel({ id }: ChannelProps) {
  const { channel } = findBlock(id);

  const name = channel?.name ?? "스트리머";
  const iconUrl = channel?.iconUrl ?? "";

  return (
    <Container>
      <Icon src={iconUrl} alt={name} />
      <Name>{name}</Name>
    </Container>
  );
}

type ChannelProps = {
  id: number;
};

export default Channel;
