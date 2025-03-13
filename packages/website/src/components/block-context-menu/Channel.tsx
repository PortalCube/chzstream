import { getProfileImageUrl } from "@web/librarys/chzzk-util.ts";
import { BlockContextMenuContext } from "@web/librarys/context.ts";
import { useContext, useMemo } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 8px;

  border: 2px dashed rgb(53, 53, 53);
  border-style: dashed;
  border-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;

  cursor: pointer;

  transition-property: background-color;
  transition-duration: 100ms;

  &:hover {
    background-color: rgba(255, 255, 255, 0.025);
  }
`;

const Image = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 2px;
`;

const Name = styled.div`
  color: rgb(255, 255, 255);
  font-size: 16px;
  font-weight: 600;
`;

const Description = styled.div`
  color: rgb(127, 127, 127);
  font-size: 14px;
  font-weight: 500;
`;

function Channel() {
  const block = useContext(BlockContextMenuContext);

  const { iconUrl, name, description } = useMemo(() => {
    if (block === null || block.channel === null) {
      return {
        iconUrl: getProfileImageUrl(),
        name: "채널 없음",
        description: "클릭해서 채널 지정",
      };
    }

    return {
      iconUrl: block.channel.iconUrl,
      name: block.channel.name,
      description: "클릭하거나 드래그",
    };
  }, [block]);

  return (
    <Container>
      <Image src={iconUrl} />
      <Info>
        <Name>{name}</Name>
        <Description>{description}</Description>
      </Info>
    </Container>
  );
}

export default Channel;
