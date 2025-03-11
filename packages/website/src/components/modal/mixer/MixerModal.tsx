import classNames from "classnames";
import { useAtomValue, useSetAtom } from "jotai";
import {
  bandwidthAtom,
  batchMixerItemAtom,
  defaultMixerItemAtom,
  mixerItemsAtom,
  setupMixerAtom,
  updateBatchQualityAtom,
} from "@web/librarys/mixer.ts";
import {
  closeModalAtom,
  modalAtom,
  useModalListener,
} from "@web/librarys/modal.ts";
import styled from "styled-components";
import MixerItem from "@web/components/modal/mixer/MixerItem.tsx";

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

const List = styled.div`
  max-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2px;

  overflow-y: auto;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;

  background-color: rgba(255, 255, 255, 0.1);
`;

const Footer = styled.div`
  padding: 0 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BandwidthText = styled.p`
  font-weight: 600;
  font-size: 16px;
`;

const ApplyButton = styled.button`
  padding: 8px 24px;
  border: none;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(131, 54, 209, 1);
  color: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);

  font-weight: 600;
  font-size: 16px;

  transition: background-color 200ms;
  cursor: pointer;

  &:hover {
    background-color: rgba(146, 67, 224, 1);
  }
`;

function MixerModal({}: MixerModalProps) {
  const modal = useAtomValue(modalAtom);
  const closeModal = useSetAtom(closeModalAtom);
  const mixerItems = useAtomValue(mixerItemsAtom);
  const defaultMixerItem = useAtomValue(defaultMixerItemAtom);
  const batchMixerItem = useAtomValue(batchMixerItemAtom);
  const bandwidth = useAtomValue(bandwidthAtom);
  const updateAllQuality = useSetAtom(updateBatchQualityAtom);
  const setupMixer = useSetAtom(setupMixerAtom);

  const onApplyClick: React.MouseEventHandler = () => closeModal();

  const className = classNames({
    disable: modal.type !== "mixer",
  });

  const items = mixerItems.map((item) => (
    <MixerItem key={item.id} item={item} />
  ));

  useModalListener((_get, _set, newVal, prevVal) => {
    if (prevVal.type !== "mixer") return;
    if (newVal.type !== "none") return;
    updateAllQuality();
  });

  useModalListener((_get, _set, newVal, prevVal) => {
    if (prevVal.type === newVal.type) return;
    if (newVal.type !== "mixer") return;
    setupMixer();
  });

  return (
    <Container className={className}>
      <Title>스트림 믹서</Title>
      <List>
        <MixerItem item={defaultMixerItem} />
        <MixerItem item={batchMixerItem} />
      </List>
      <Divider />
      <List>{items}</List>
      <Footer>
        <BandwidthText>예상 네트워크 사용량: {bandwidth}</BandwidthText>
        <ApplyButton onClick={onApplyClick}>확인</ApplyButton>
      </Footer>
    </Container>
  );
}

type MixerModalProps = {};

export default MixerModal;
