import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import { closeModalAtom, modalAtom, ModalType } from "src/librarys/modal.ts";
import styled from "styled-components";
import MixerModal from "./mixer/MixerModal.tsx";
import SearchModal from "./search-modal/SearchModal.tsx";
import SettingModal from "./SettingModal.tsx";

const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);

  transition: opacity 200ms;

  &.disable {
    opacity: 0;
    pointer-events: none;
  }
`;

function Modal({}: ModalProps) {
  const modal = useAtomValue(modalAtom);
  const closeModal = useSetAtom(closeModalAtom);

  const className = classNames({
    disable: modal.type === ModalType.None,
  });

  const onPointerDown: React.MouseEventHandler = (event) => {
    if (event.target !== event.currentTarget) return;
    closeModal();
  };

  return (
    <Container className={className} onPointerDown={onPointerDown}>
      <SettingModal />
      <SearchModal />
      <MixerModal />
    </Container>
  );
}

type ModalProps = {};

export default Modal;
