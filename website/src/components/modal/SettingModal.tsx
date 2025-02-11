import classNames from "classnames";
import { useAtomValue } from "jotai";
import { modalAtom, ModalType } from "src/librarys/modal.ts";
import styled from "styled-components";

const Container = styled.div`
  max-width: 500px;
  width: 100%;
  height: 600px;

  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 10px;

  color: rgba(255, 255, 255, 1);
  background-color: rgba(31, 31, 31, 1);
  border: 1px solid rgba(63, 63, 63, 1);

  transition: transform 200ms;

  &.disable {
    display: none;
    transform: scale(0.75);
  }
`;

const Title = styled.p`
  font-weight: 600;
  font-size: 22px;
`;

const Description = styled.p`
  font-weight: 400;
  font-size: 16px;
  color: rgba(200, 200, 200, 1);
`;

function SettingModal({}: SettingModalProps) {
  const modal = useAtomValue(modalAtom);

  const className = classNames({
    disable: modal.type !== ModalType.Setting,
  });

  return (
    <Container className={className}>
      <Title>준비중인 기능입니다</Title>
      <Description>설정 패널은 곧 추가될 예정입니다.</Description>
    </Container>
  );
}

type SettingModalProps = {};

export default SettingModal;
