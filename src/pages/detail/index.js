import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../components/card/card";
import Header from "../../components/common/Header";
import Menubar from "../../components/common/Menubar";
import Loading from "../../components/common/Loading";
import {
  PinImg,
  PinImgNone,
  BookmarkImg,
  BookmarkImgNone,
  PublicSwitch,
  PrivateSwitch,
} from "../../components/icons/cardIcons";
import instance from "../../api/axios";
import { getCookie } from "../../auth/cookie";

function Detail() {
  const { year, month, date } = useParams();
  const accessToken = getCookie("accessToken");
  const [dailyData, setDailyData] = useState("");

  const getDailyData = async () => {
    // year를 4자리로, month를 2자리로 date를 2자리로 채움
    const paddedYear = year.padStart(4, "0");
    const paddedMonth = month.padStart(2, "0");
    const paddedDate = date.padStart(2, "0");
    try {
      const response = await instance.get("/api/diary/daily", {
        headers: {
          Authorization: ` Bearer ${accessToken}`,
        },
        params: {
          date: `${paddedYear}-${paddedMonth}-${paddedDate}`,
        },
      });
      console.log("response:", response.data);
      setDailyData(response.data);
    } catch (e) {
      console.error("Error:", e);
      console.error("Error:", `${paddedYear}-${paddedMonth}-${paddedDate}`);
    }
  };
  // const [pinned, setPinned] = useState(false);
  // const handlePinClick = () => {
  //   setPinned(!pinned);
  //   console.log("📍 Pin toggled");
  // };

  useEffect(() => {
    getDailyData();
  }, [year, month, date]);

  if (!dailyData) {
    return (
      <>
        <Loading />
      </>
    );
  }

  const todayDate = dailyData.length > 0 ? dailyData[0].date : "날짜 없음";

  return (
    <>
      <Header />
      <Wrapper isTall={true}>
        <Title>
          {month}월 {date}일의 소다
        </Title>
        {dailyData.map((data, index) => (
          <Diary key={index}>
            <DiaryHeader>
              <IconDiv>
                {data.isRepresentative == true ? <PinImg /> : <PinImgNone />}
              </IconDiv>
              <IconDiv>
                {data.isFavorite == true ? (
                  <BookmarkImg />
                ) : (
                  <BookmarkImgNone />
                )}
              </IconDiv>
              <IconDiv>
                {data.isShared == true ? <PublicSwitch /> : <PrivateSwitch />}
              </IconDiv>
            </DiaryHeader>
            <Card dailyData={data} />
          </Diary>
        ))}
      </Wrapper>
      <Menubar />
    </>
  );
}

export default Detail;

const Wrapper = styled.div`
  padding-top: 60px;
  padding-bottom: 70px;
  background: linear-gradient(
    ${({ theme }) => theme.backgroundColors.mainColor} 25%,
    white 100%
  );

  height: ${(props) => (props.isTall ? "auto" : "100vh")};
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "LOTTERIACHAB";
  color: white;
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
  height: auto;
  padding: 30px 30px 20px 30px;
  border-radius: 8px;
  background-color: ${({ theme }) =>
    theme.backgroundColors.cardbackgroundColor};
  p {
    font-family: "Ownglyph_meetme-Rg";
    font-size: 30px;
    color: ${({ theme }) => theme.colors.fontColor};
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
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => color};
  width: 40px;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;
