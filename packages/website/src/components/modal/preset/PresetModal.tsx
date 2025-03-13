import PresetButton from "@web/components/modal/preset/PresetItem.tsx";
import { modalAtom } from "@web/librarys/modal.ts";
import { PresetItem, presetListAtom } from "@web/librarys/preset.ts";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import { useMemo, useRef, useState } from "react";
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

  color: rgb(255, 255, 255);
  background-color: rgb(31, 31, 31);
  border: 1px solid rgb(63, 63, 63);

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
  color: rgb(255, 255, 255);
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`;

const List = styled.div`
  max-height: 480px;
  padding-right: 16px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 32px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  gap: 8px;
`;

const SectionTitle = styled.p`
  width: 100%;
  margin-left: 10px;

  font-size: 18px;
  font-weight: 500;
  color: rgb(255, 255, 255);
`;

const SectionList = styled.div`
  display: grid;
  gap: 16px;

  grid-template-columns: repeat(3, 1fr);
`;

const SectionMenu = styled.div`
  width: 140px;
  padding: 4px;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  gap: 4px;

  background-color: rgb(36, 36, 36);
`;

const SectionMenuItem = styled.button`
  border-radius: 4px;
  padding: 8px;

  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;

  text-align: left;
  color: rgb(133, 133, 133);

  transition-property: color, background-color;
  transition-duration: 100ms;

  &.active {
    color: rgb(255, 255, 255);
    background-color: rgb(45, 45, 45);
  }
`;

function PresetModal({}: PresetModalProps) {
  const modal = useAtomValue(modalAtom);
  const presetList = useAtomValue(presetListAtom);
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const [currentSection, setCurrentSection] = useState<number | null>(null);

  const className = classNames({
    disable: modal.type !== "preset",
  });

  const sections = useMemo(() => {
    const sections: {
      description: string;
      streamCount: number;
      items: PresetItem[];
    }[] = [];

    presetList.forEach((preset) => {
      let section = sections.find(
        (section) => section.streamCount === preset.streamCount
      );

      if (section === undefined) {
        section = {
          description: `채널 ${preset.streamCount}개`,
          streamCount: preset.streamCount,
          items: [],
        };

        sections.push(section);
      }

      section.items.push(preset);
    });

    sections.sort((a, b) => a.streamCount - b.streamCount);
    sections.forEach((section) => {
      section.items.sort((a, b) => a.chatCount - b.chatCount);
    });

    return sections;
  }, [presetList]);

  const menuItems = useMemo(
    () =>
      sections.map((section) => {
        const onMenuItemClick: React.MouseEventHandler = () => {
          const element = sectionRef.current.get(section.streamCount);
          if (element) {
            element.scrollIntoView();
            setTimeout(() => setCurrentSection(section.streamCount), 1);
          }
        };

        const className = classNames({
          active: currentSection === section.streamCount,
        });

        return (
          <SectionMenuItem
            key={section.streamCount}
            className={className}
            onClick={onMenuItemClick}
          >
            {section.description}
          </SectionMenuItem>
        );
      }),
    [sections, currentSection]
  );

  const listItems = useMemo(
    () =>
      sections.map((section) => {
        const items = section.items.map((preset, index) => (
          <PresetButton key={index} preset={preset} />
        ));

        const refCallback = (item: HTMLDivElement) => {
          sectionRef.current.set(section.streamCount, item);

          const options = {
            root: ref.current,
            threshold: 1,
          };

          const callback: IntersectionObserverCallback = (
            entries,
            _observer
          ) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setCurrentSection(section.streamCount);
              }
            });
          };

          const observer = new IntersectionObserver(callback, options);
          observer.observe(item);

          return () => {
            sectionRef.current.delete(section.streamCount);
            observer.disconnect();
          };
        };

        return (
          <Section ref={refCallback} key={section.streamCount}>
            <SectionTitle>{section.description}</SectionTitle>
            <SectionList>{items}</SectionList>
          </Section>
        );
      }),
    [ref, sections]
  );

  return (
    <Container className={className}>
      <Title>프리셋</Title>
      <Content>
        <SectionMenu>{menuItems}</SectionMenu>
        <List ref={ref}>{listItems}</List>
      </Content>
    </Container>
  );
}

type PresetModalProps = {};

export default PresetModal;
