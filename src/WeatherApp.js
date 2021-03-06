import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { ReactComponent as CloudyIcon } from "./images/cloudy.svg";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as RedoIcon } from "./images/redo.svg";

const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: #212121;
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: #828282;
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: #757575;
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const Cloudy = styled(CloudyIcon)`
  flex-basis: 30%;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  margin-bottom: 20px;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;

  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Redo = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: #828282;

  svg {
    margin-left: 10px;
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
`;

const WeatherApp = () => {
  console.log("---invoke function component---");

  useEffect(() => {
    fetchCurrentEffect();
  }, []);

  const fetchCurrentEffect = () => {
    console.log("execute function in useEffect");
  };

  const [currentWeather, setCurrentWeather] = useState({
    observationTime: "2019-10-02 22:10:00",
    locationName: "?????????...",
    description: "????????????",
    temperature: 27.8,
    windSpeed: 0.3,
    humid: 0.88
  });
  // STEP 1????????? handleClick ????????????????????????????????? API
  const handleClick = () => {
    fetch(
      "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-FD84E19D-4614-40E0-A8C6-7D3D5017A47F&locationName=??????"
    )
      .then((response) => response.json())
      .then((data) => {
        // STEP 1????????? `locationData` ????????????????????????????????????????????????
        const locationData = data.records.location[0];
        // console.log(locationData);
        // STEP 2???????????????WDSD???????????????TEMP???????????????HUMD??????????????????
        const weatherElements = locationData.weatherElement.reduce(
          (neededElements, item) => {
            if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
              neededElements[item.elementName] = item.elementValue;
            }
            return neededElements;
          },
          {}
        );

        // STEP 3??????????????? React ??????????????????
        setCurrentWeather({
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          description: "????????????",
          temperature: weatherElements.TEMP,
          windSpeed: weatherElements.WDSD,
          humid: weatherElements.HUMD
        });
      });
  };

  return (
    <Container>
      {console.log("render")}
      <WeatherCard>
        <Location>{currentWeather.locationName}</Location>
        <Description>{currentWeather.description}</Description>
        <CurrentWeather>
          <Temperature>
            {Math.round(currentWeather.temperature)} <Celsius>??C</Celsius>
          </Temperature>
          <Cloudy />
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon />
          {currentWeather.windSpeed} m/h
        </AirFlow>
        <Rain>
          <RainIcon />
          {Math.round(currentWeather.humid * 100)} %
        </Rain>

        <Redo onClick={handleClick}>
          ?????????????????????
          {new Intl.DateTimeFormat("zh-TW", {
            hour: "numeric",
            minute: "numeric"
          }).format(new Date(currentWeather.observationTime))}{" "}
          <RedoIcon />
        </Redo>
      </WeatherCard>
    </Container>
  );
};

export default WeatherApp;
