import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import { closeModalAtom, modalAtom, ModalType } from "@web/librarys/modal.ts";
import styled from "styled-components";
import MixerModal from "@web/components/modal/mixer/MixerModal.tsx";
import SearchModal from "@web/components/modal/search-modal/SearchModal.tsx";
import SettingModal from "@web/components/modal/SettingModal.tsx";

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
