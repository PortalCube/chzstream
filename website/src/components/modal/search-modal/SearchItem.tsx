import classNames from "classnames";
import { useMemo } from "react";
import { MdVerified } from "react-icons/md";
import { getProfileImageUrl } from "src/librarys/chzzk-util.ts";
import { useModal } from "src/librarys/modal.ts";
import { SearchItemType } from "src/librarys/search";
import { formatFollowerCount } from "src/scripts/format.ts";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;

  margin: -0px -8px;
  padding: 4px 8px;
  border-radius: 4px;

  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 12px;

  cursor: pointer;

  transition: background-color 100ms;

  &:hover {
    background-color: rgba(63, 63, 63, 1);
  }
`;

const Profile = styled.div`
  width: 36px;
  height: 36px;

  position: relative;
`;

const Verified = styled(MdVerified)`
  position: absolute;
  right: -4px;
  top: -1px;

  width: 16px;
  height: 16px;

  color: rgba(45, 254, 153, 1);
  filter: drop-shadow(0 0 1px rgba(0, 0, 0, 1));

  &.hidden {
    display: none;
  }
`;

const ProfileImage = styled.img`
  flex-shrink: 0;

  width: 36px;
  height: 36px;
  border-radius: 50%;

  object-fit: cover;

  background-color: rgba(63, 63, 63, 1);
`;

const Info = styled.div`
  min-width: 0;
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  gap: 2px;
`;

const Title = styled.p`
  width: 100%;
  color: rgba(243, 243, 243, 1);
  font-weight: 600;
  font-size: 16px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Description = styled.p`
  width: 100%;

  color: rgba(159, 159, 159, 1);
  font-weight: 400;
  font-size: 15px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Count = styled.span`
  flex-shrink: 0;

  color: rgba(159, 159, 159, 1);
  font-weight: 400;
  font-size: 15px;

  font-variant-numeric: tabular-nums;
`;

function SearchItem({ item }: SearchItemProps) {
  const { modal, closeModal } = useModal();
  const className = classNames({});

  const verifiedClassName = classNames({
    hidden: item.verified === false,
  });

  const profileImage = useMemo(
    () => getProfileImageUrl(item.profileImage),
    [item]
  );

  const count = useMemo(
    () => [item.countPrefix, formatFollowerCount(item.count)].join(" "),
    [item]
  );

  const onClick: React.MouseEventHandler = () => {
    modal.callback?.(item);
    closeModal();
  };

  return (
    <Container className={className} onClick={onClick}>
      <Profile>
        <ProfileImage src={profileImage} />
        <Verified className={verifiedClassName} />
      </Profile>
      <Info>
        <Title>{item.title}</Title>
        <Description>{item.description}</Description>
      </Info>
      <Count>{count}</Count>
    </Container>
  );
}

export type SearchItemProps = {
  item: SearchItemType;
};

export default SearchItem;
