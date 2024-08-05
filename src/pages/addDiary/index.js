import React, { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import {
  PinImg,
  PinImgNone,
  BookmarkImg,
  BookmarkImgNone,
  PublicSwitch,
  PrivateSwitch,
  Stampred,
  Stampblue,
  Stampgreen,
  Stampyellow,
} from "../../components/icons/cardIcons";
import Header from "../../components/common/Header";
import Menubar from "../../components/common/Menubar";
import instance from "../../api/axios";
import { getCookie } from "../../auth/cookie";
import { useNavigate } from "react-router-dom";

function AddDiary() {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState({
    title: "",
    carbonationIndex: "",
    diaryText: "",
    diaryDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [pinned, setPinned] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [switched, setSwitched] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState(null);

  const handlePinClick = () => {
    setPinned(!pinned);
    console.log(!pinned, "핀📍");
  };
  const handleBookmarkClick = () => {
    setBookmarked(!bookmarked);
    console.log(!bookmarked, " 즐겨찾기📚");
  };
  const handleSwitchClick = () => {
    setSwitched(!switched);
    console.log(!switched, "공개여부🍀");
  };

  const handleStampClick = (stampColor) => {
    setSelectedStamp(stampColor);
    console.log(stampColor, " 🛑");
  };

  // useEffect(() => {
  //   setPinned(!pinned);
  //   setBookmarked(!bookmarked);
  //   setSwitched(!switched);
  // }, [pinned, bookmarked, switched]);

  const handleSubmit = async () => {
    const diaryData = {
      diaryTitle: inputData.title,
      sodaIndex: parseInt(inputData.carbonationIndex, 10),
      content: inputData.diaryText,
      purpose: selectedStamp || "",
      diaryDate: inputData.diaryDate,
      isRepresentative: pinned,
      isFavorite: bookmarked,
      isShared: switched,
    };

    try {
      const response = await instance.post("/api/diary", diaryData, {
        headers: { Authorization: `Bearer ${getCookie("accessToken")}` },
      });
      console.log("Diary response Submitted: ", response.data);
      console.log("핀: ", diaryData.isRepresentative);
      console.log("즐찾: ", diaryData.isFavorite);
      console.log("공개: ", diaryData.isShared);
      navigate("/soda");
    } catch (error) {
      console.error("Error submitting diary: ", error);
    }

    console.log("Diary Submitted: ", diaryData);
  };

  const stamps = [
    { color: "red", Component: Stampred },
    { color: "yellow", Component: Stampyellow },
    { color: "green", Component: Stampgreen },
    { color: "blue", Component: Stampblue },
  ];

  return (
      <>
        <Header />
        <Wrapper>
          <Title>소다쓰기</Title>
          <Diary>
            <DiaryHeader>
              <IconDiv onClick={handlePinClick}>
                {pinned ? <PinImg /> : <PinImgNone />}
              </IconDiv>
              <IconDiv onClick={handleBookmarkClick}>
                {bookmarked ? <BookmarkImg /> : <BookmarkImgNone />}
              </IconDiv>
              <IconDiv onClick={handleSwitchClick}>
                {switched ? <PublicSwitch /> : <PrivateSwitch />}
              </IconDiv>
            </DiaryHeader>
            <input
                type="text"
                name="title"
                value={inputData.title}
                onChange={handleChange}
                placeholder="제목을 입력하세요"
            />
            <hr style={{ height: "2px" }} />
            <Row>
              <div>
                <p>오늘의 하루 탄산지수 :</p>
                <input
                    type="number"
                    name="carbonationIndex"
                    value={inputData.carbonationIndex}
                    onChange={handleChange}
                    style={{ width: "60px", padding: "5px", outline: "none" }}
                />
                <p>%</p>
              </div>
              <div>
                <input
                    type="date"
                    id="date"
                    name="diaryDate"
                    max="2094-10-19"
                    min="2004-10-19"
                    onChange={handleChange}
                    value={inputData.diaryDate}
                />
              </div>
            </Row>
            <hr />
            <DiaryText>
            <textarea
                name="diaryText"
                value={inputData.diaryText}
                onChange={handleChange}
                placeholder="일기를 입력하세요"
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "5px",
                  resize: "none",
                  fontFamily: "Ownglyph_meetme-Rg",
                  fontSize: "20px",
                }}
            ></textarea>
            </DiaryText>
            <hr />
            <Row>
              <span>소다가 필요한 이유</span>
            </Row>
            <hr />
            <DiaryText>
              <StampWrapper>
                {stamps.map(({ color, Component }) => (
                    <Stamp
                        key={color}
                        color={selectedStamp === color ? "#ffffff" : "#ffffff"}
                        isSelected={selectedStamp === color}
                        onClick={() => handleStampClick(color)}
                    >
                      <Component />
                    </Stamp>
                ))}
              </StampWrapper>
            </DiaryText>
            <hr />
            <ButtonContainer>
              <Btn onClick={handleSubmit}>작성완료</Btn>
            </ButtonContainer>
          </Diary>
        </Wrapper>
        <Menubar />
      </>
  );
}

export default AddDiary;

const Wrapper = styled.div`
  padding-top: 60px;
  padding-bottom: 70px;
  background: linear-gradient(
      ${({ theme }) => theme.backgroundColors.mainColor} 25%,
      white 100%
  );
  height: auto; /* isTall prop 제거 */
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "LOTTERIACHAB";
  color: white;
  @media (max-width: ${({ theme }) => theme.mobile}) {
    height: 100vh;
  }
`;

const Title = styled.p`
  display: flex;
  color: white;
  font-size: 40px;
  padding: 20px;
  text-align: center;
  text-shadow: 4px 4px ${({ theme }) => theme.backgroundColors.borderDark};
  font-family: "LOTTERIACHAB";
`;

const Diary = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px 30px 20px 30px;
  border-radius: 8px;
  background-color: ${({ theme }) =>
      theme.backgroundColors.cardbackgroundColor};
  p {
    font-family: "Ownglyph_meetme-Rg";
    font-size: 30px;
    color: ${({ theme }) => theme.colors.fontColor};
  }
  input {
    font-family: "Ownglyph_meetme-Rg";
    font-size: 30px;
    color: ${({ theme }) => theme.colors.fontColor};
    border-width: 0;
    width: 100%;
    padding: 5px;
    margin-top: 10px;
  }
  hr {
    margin: 30px 0;
    border: 0;
    background-color: black;
    height: 1px;
  }
  margin: 20px;
  width: ${({ theme }) => theme.tablet};
  border-radius: 13px;
  @media (max-width: ${({ theme }) => theme.mobile}) {
    width: 324px;
    padding: 10px;
    p {
      font-size: 20px;
    }
    hr {
      margin: 10px 0;
    }
    input {
      font-size: 20px;
    }
  }
`;

const DiaryHeader = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.backgroundColors.cardHeaderColor};
  border-radius: 8px;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  width: 100%;
  margin-bottom: 20px;
  @media (max-width: ${({ theme }) => theme.mobile}) {
    justify-content: space-between;
    padding: 5px;
    margin-bottom: 0px;
  }
`;

const IconDiv = styled.div`
  background-color: ${(props) => props.color};
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  span {
    font-size: 30px;
    font-weight: regular;
    margin: 0;
    color: ${({ theme }) => theme.colors.fontColor};
    font-family: "Ownglyph_meetme-Rg";
  }
  p {
    font-size: 20px;
    font-weight: regular;
    margin: 0 20px 0 0;
  }
  svg {
    cursor: pointer;
    margin-left: auto;
  }
  div {
    display: flex;
    height: auto;
    justify-content: center;
    align-items: center;
  }
  div input {
    outline: none;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: ${({ theme }) => theme.mobile}) {
    span {
      font-size: 20px;
    }
    p {
      font-size: 12px;
    }
    input {
      font-size: 18px;
    }
  }
`;

const DiaryText = styled.div`
  display: flex;
  flex-direction: column;
  p {
    font-size: 23px;
    font-weight: regular;
    margin: 10px;
    line-height: 2;
  }
  @media (max-width: ${({ theme }) => theme.mobile}) {
    p {
      font-size: 14px;
      line-height: 1;
    }
    textarea {
      font-size: 10px;
    }
  }
`;

const StampWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  svg {
    cursor: pointer;
  }
`;

const grow = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.2);
  }
`;

// 스타일드 컴포넌트 정의
const Stamp = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: ${({ color }) => color};
  width: 90px
  height: 90px;
  border-radius: 30px;
  cursor: pointer;

  &:hover {
    animation: ${grow} 0.2s forwards;
    transition: transform 0.2s;
  }
  svg {
    width: 90px;
    height: 90px;
  }
  @media (max-width: ${({ theme }) => theme.mobile}) {
    width: 50px;
    height: 50px;
    svg {
      width: 50px;
      height: 50px;
    }
  }

  ${({ isSelected }) =>
      isSelected &&
      css`
        animation: ${grow} 0.2s forwards;
      `}
`;

const Btn = styled.button`
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  font-family: "Ownglyph_meetme-Rg";
  font-size: 16px;
  width: 120px;
  background-color: ${({ theme }) => theme.card.btnColor};
  color: white;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
`;
