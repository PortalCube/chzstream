import { closeModalAtom, modalAtom } from "@web/librarys/modal.ts";
import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";

const Container = styled.div`
  padding: 24px;

  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);

  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;

  gap: 16px;

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
  padding: 0 8px;
  font-size: 28px;
  font-weight: 800;
  color: rgba(255, 255, 255, 1);
`;

function PresetModal({}: PresetModalProps) {
  const modal = useAtomValue(modalAtom);
  const closeModal = useSetAtom(closeModalAtom);

  const className = classNames({
    disable: modal.type !== "preset",
  });

  return (
    <Container className={className}>
      <Title>프리셋</Title>
    </Container>
  );
}

type PresetModalProps = {};

export default PresetModal;
