import {
  searchCategoryAtom,
  searchPlatformAtom,
} from "@web/librarys/search.ts";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;

  padding: 36px 0;

  flex-grow: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;

  &.hidden {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const Title = styled.p`
  font-weight: 600;
  font-size: 24px;
  color: rgb(255, 255, 255);
`;

const Description = styled.p`
  font-weight: 400;
  font-size: 16px;
  color: rgb(175, 175, 175);
`;

const Content = styled.div`
  width: 500px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
`;

const ContentItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
`;

const ContentItemTitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: rgb(255, 255, 255);
`;

const ContentItemDescription = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: rgb(175, 175, 175);
`;

const ContentItemExample = styled.div`
  padding: 8px 12px;
  border-radius: 4px;

  white-space: pre-wrap;

  font-size: 14px;
  font-weight: 400;
  font-family: "Ubuntu Mono", monospace;

  background-color: rgb(43, 43, 43);
  color: rgb(175, 175, 175);
`;

type YoutubeNoticeContent = {
  title: string;
  description?: string;
  example: string[];
};

const YOUTUBE_NOTICE_CONTENT: YoutubeNoticeContent[] = [
  {
    title: "유튜브 채널 핸들",
    description: "주의: 핸들은 반드시 @으로 시작해야 합니다.",
    example: ["@youtubekorea", "https://www.youtube.com/@youtubekorea"],
  },
  {
    title: "유튜브 채널 ID",
    example: [
      "UCOH52Yqq4-rdLvpt2Unsqsw",
      "https://www.youtube.com/channel/UCOH52Yqq4-rdLvpt2Unsqsw",
    ],
  },
  {
    title: "유튜브 동영상 ID",
    example: [
      "9OqoRxXUjGA",
      "https://youtu.be/9OqoRxXUjGA",
      "https://www.youtube.com/watch?v=9OqoRxXUjGA",
      "https://www.youtube.com/live/9OqoRxXUjGA",
    ],
  },
];

function SearchYoutubeNotice({}: SearchYoutubeNoticeProps) {
  const platform = useAtomValue(searchPlatformAtom);
  const category = useAtomValue(searchCategoryAtom);

  const className = classNames({
    hidden: platform !== "youtube" || category !== "youtube-notice",
  });

  const contentItems = YOUTUBE_NOTICE_CONTENT.map((item, index) => (
    <ContentItem key={index}>
      <ContentItemTitle>{item.title}</ContentItemTitle>
      <ContentItemDescription>{item.description}</ContentItemDescription>
      <ContentItemExample>{item.example.join("\n")}</ContentItemExample>
    </ContentItem>
  ));

  return (
    <Container className={className}>
      <Header>
        <Title>유튜브 채널 추가하기</Title>
        <Description>
          아래 중 하나를 검색창에 입력해 채널을 추가하세요.
        </Description>
      </Header>
      <Content>{contentItems}</Content>
    </Container>
  );
}

type SearchYoutubeNoticeProps = {};

export default SearchYoutubeNotice;
