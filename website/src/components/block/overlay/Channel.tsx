import styled, { css } from "styled-components";

import { findBlock } from "src/librarys/grid.ts";
import { Mixin } from "src/scripts/styled.ts";

const Container = styled.div`
  overflow: hidden;

  display: flex;
  align-items: center;

  ${Mixin.block.greater.extraLarge(css`
    gap: 12px;
  `)}

  ${Mixin.block.less.extraLarge(css`
    gap: 10px;
  `)}
  
  ${Mixin.block.less.large(css`
    gap: 8px;
  `)}
  
  ${Mixin.block.less.medium(css`
    gap: 6px;
  `)}
  
  ${Mixin.block.less.small(css`
    gap: 4px;
  `)}
`;

const Icon = styled.img`
  ${Mixin.block.greater.extraLarge(css`
    width: 44px;
    height: 44px;
  `)}

  ${Mixin.block.less.extraLarge(css`
    width: 36px;
    height: 36px;
  `)}
  
  ${Mixin.block.less.large(css`
    width: 28px;
    height: 28px;
  `)}
  
  ${Mixin.block.less.medium(css`
    width: 20px;
    height: 20px;
  `)}
  
  ${Mixin.block.less.small(css`
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
