import React, { useState, useEffect, useRef } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Switch,
  Paper,
  IconButton,
  Grid,
  Autocomplete,
  Chip,
  FormControlLabel,
  Divider,
  Avatar,
  AppBar,
  Toolbar,
  CircularProgress,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import axios from "axios";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AddIcon from "@mui/icons-material/Add";
import PublicIcon from "@mui/icons-material/Public";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import ScheduleIcon from "@mui/icons-material/Schedule";
import WatchIcon from "@mui/icons-material/Watch";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TimerIcon from "@mui/icons-material/Timer";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import SaveIcon from "@mui/icons-material/Save";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const API_URL = "http://localhost:8000";

const WatchFace = styled.div`
  width: 300px;
  height: 300px;
  border: 15px solid ${(props) => props.theme.palette.primary.main};
  border-radius: 50%;
  position: relative;
  background: ${(props) => props.theme.palette.background.paper};
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  }
`;

const WatchHand = styled.div`
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom;
  background: ${(props) => props.theme.palette.text.primary};
  border-radius: 4px;
  transition: transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44);
`;

const HourHand = styled(WatchHand)`
  width: 8px;
  height: 70px;
  transform: translateX(-50%)
    rotate(${(props) => props.hour * 30 + props.minute * 0.5}deg);
`;

const MinuteHand = styled(WatchHand)`
  width: 6px;
  height: 100px;
  transform: translateX(-50%) rotate(${(props) => props.minute * 6}deg);
`;

const SecondHand = styled(WatchHand)`
  width: 3px;
  height: 120px;
  background: ${(props) => props.theme.palette.error.main};
  transform: translateX(-50%) rotate(${(props) => props.second * 6}deg);
`;

const WatchCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  background: ${(props) => props.theme.palette.primary.main};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 10px;
    background: ${(props) => props.theme.palette.error.main};
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`;

const WatchNumber = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  transform: rotate(${(props) => props.angle}deg);
  span {
    display: inline-block;
    transform: rotate(${(props) => -props.angle}deg);
    font-size: 1.6rem;
    font-weight: bold;
    color: ${(props) => props.theme.palette.text.primary};
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }
`;

const DigitalClock = styled.div`
  font-family: "Digital-7", monospace;
  font-size: 4rem;
  color: ${(props) => props.theme.palette.primary.main};
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  .separator {
    animation: blink 1s infinite;
  }
  .ampm {
    font-size: 1.5rem;
    margin-left: 0.5rem;
    color: ${(props) => props.theme.palette.text.secondary};
  }
  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const StyledPaper = styled(Paper)`
  padding: 2rem;
  border-radius: 15px;
  background: ${(props) => props.theme.palette.background.paper};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const LandingPage = styled(Box)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.palette.background.default};
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) =>
      props.theme.palette.mode === "dark"
        ? "radial-gradient(circle at center, rgba(25, 118, 210, 0.1) 0%, transparent 70%)"
        : "radial-gradient(circle at center, rgba(25, 118, 210, 0.05) 0%, transparent 70%)"};
    z-index: 0;
  }
`;

const FeatureCard = styled(Paper)`
  padding: 2rem;
  margin: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(255, 255, 255, 0.8)"};
  backdrop-filter: blur(10px);
  border: 1px solid
    ${(props) =>
      props.theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)"};
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
`;

const GetStartedButton = styled(Button)`
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 30px;
  background: linear-gradient(
    45deg,
    ${(props) => (props.theme.palette.mode === "dark" ? "#ff4081" : "#f50057")},
    ${(props) => (props.theme.palette.mode === "dark" ? "#651fff" : "#3d5afe")}
  );
  color: white;
  position: relative;
  overflow: hidden;
  z-index: 1;
  animation: ${fadeIn} 1s ease-out;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      ${(props) =>
        props.theme.palette.mode === "dark" ? "#ff1744" : "#d50000"},
      ${(props) =>
        props.theme.palette.mode === "dark" ? "#6200ea" : "#304ffe"}
    );
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const FloatingIcon = styled(Box)`
  position: absolute;
  opacity: 0.1;
  animation: ${float} 6s ease-in-out infinite;
  z-index: 0;
`;

const ContentWrapper = styled(Box)`
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 1s ease-out;
`;

const Logo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 2;

  .logo-circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.palette.primary.main},
      ${(props) => props.theme.palette.secondary.main || "#f50057"}
    );
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      transform: rotate(15deg);
    }

    &::before {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.3) 0%,
        transparent 70%
      );
      opacity: 0.6;
    }
  }

  .logo-text {
    font-weight: 800;
    font-size: 1.4rem;
    letter-spacing: 0.5px;
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.palette.primary.main},
      ${(props) => props.theme.palette.secondary.main || "#f50057"}
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateX(5px);
    }
  }
`;

const Footer = styled(Box)`
  padding: 2.5rem 1.5rem;
  background: ${(props) =>
    props.theme.palette.mode === "dark"
      ? "linear-gradient(to bottom, transparent, rgba(15, 15, 15, 0.9))"
      : "linear-gradient(to bottom, transparent, rgba(245, 245, 245, 0.9))"};
  backdrop-filter: blur(15px);
  margin-top: auto;
  width: 100%;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 10px;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      ${(props) => props.theme.palette.primary.main}40,
      ${(props) => props.theme.palette.primary.main}55,
      ${(props) => props.theme.palette.primary.main}40,
      transparent
    );
    opacity: 0.7;
  }

  .social-icons {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .social-icon {
    transition: all 0.3s ease;
    color: ${(props) => props.theme.palette.text.secondary};
    background: ${(props) =>
      props.theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.05)"};
    border-radius: 50%;
    padding: 10px;

    &:hover {
      color: ${(props) => props.theme.palette.primary.main};
      transform: translateY(-8px) rotate(10deg);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      background: ${(props) =>
        props.theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.03)"};
    }
  }
`;

const AnimatedInput = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 12px;
    transition: all 0.3s ease;
    background: ${(props) =>
      props.theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.02)"};

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }

    &.Mui-focused {
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      border-color: ${(props) => props.theme.palette.primary.main};

      .MuiOutlinedInput-notchedOutline {
        border-width: 2px;
        border-color: ${(props) => props.theme.palette.primary.main};
      }
    }
  }

  .MuiInputLabel-root {
    &.Mui-focused {
      color: ${(props) => props.theme.palette.primary.main};
      font-weight: 500;
    }
  }
`;

const PulseButton = styled(Button)`
  position: relative;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: linear-gradient(
    135deg,
    ${(props) => (props.theme.palette.mode === "dark" ? "#ff4081" : "#f50057")},
    ${(props) => (props.theme.palette.mode === "dark" ? "#651fff" : "#3d5afe")}
  );
  min-width: 120px;
  color: white;
  font-weight: bold;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(1px) scale(0.98);
  }

  &::after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.8) 10%,
      transparent 10.01%
    );
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform 0.4s, opacity 0.8s;
  }

  &:active::after {
    transform: scale(0, 0);
    opacity: 0.3;
    transition: 0s;
  }

  .button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    z-index: 1;
  }

  .search-icon {
    transition: all 0.3s ease;
  }

  &:hover .search-icon {
    transform: rotate(15deg) scale(1.2);
  }
`;

const WatchMarker = styled.div`
  position: absolute;
  width: 2px;
  height: 10px;
  background: ${(props) => props.theme.palette.text.primary};
  transform-origin: bottom;
  transition: transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44);
`;

const MajorWatchMarker = styled(WatchMarker)`
  height: 15px;
  width: 4px;
`;

const MinorWatchMarker = styled(WatchMarker)`
  height: 8px;
  width: 2px;
`;

const WatchBranding = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => props.theme.palette.text.primary};
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  opacity: 0.8;
`;

const WatchBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    ${(props) => props.theme.palette.background.paper},
    ${(props) => props.theme.palette.background.default}
  );
  border-radius: 50%;
  opacity: 0.8;
`;

const WatchGlass = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 70%
  );
  border-radius: 50%;
  opacity: 0.8;
`;

const WatchFaceContainer = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: ${(props) => props.theme.palette.background.paper};
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
  }
`;

const WatchHandContainer = styled.div`
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom;
  background: ${(props) => props.theme.palette.text.primary};
  border-radius: 4px;
  transition: transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44);
`;

const HourHandContainer = styled(WatchHandContainer)`
  width: 8px;
  height: 70px;
  transform: translateX(-50%)
    rotate(${(props) => props.hour * 30 + props.minute * 0.5}deg);
`;

const MinuteHandContainer = styled(WatchHandContainer)`
  width: 6px;
  height: 100px;
  transform: translateX(-50%) rotate(${(props) => props.minute * 6}deg);
`;

const SecondHandContainer = styled(WatchHandContainer)`
  width: 3px;
  height: 120px;
  background: ${(props) => props.theme.palette.error.main};
  transform: translateX(-50%) rotate(${(props) => props.second * 6}deg);
`;

const WatchCenterContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  background: ${(props) => props.theme.palette.primary.main};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 10px;
    background: ${(props) => props.theme.palette.error.main};
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`;

const WatchNumberContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  transform: rotate(${(props) => props.angle}deg);
  span {
    display: inline-block;
    transform: rotate(${(props) => -props.angle}deg);
    font-size: 1.6rem;
    font-weight: bold;
    color: ${(props) => props.theme.palette.text.primary};
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }
`;

const DigitalClockContainer = styled.div`
  font-family: "Digital-7", monospace;
  font-size: 4rem;
  color: ${(props) => props.theme.palette.primary.main};
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  .separator {
    animation: blink 1s infinite;
  }
  .ampm {
    font-size: 1.5rem;
    margin-left: 0.5rem;
    color: ${(props) => props.theme.palette.text.secondary};
  }
  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const StyledPaperContainer = styled(Paper)`
  padding: 2rem;
  border-radius: 15px;
  background: ${(props) => props.theme.palette.background.paper};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const LandingPageContainer = styled(Box)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.palette.background.default};
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) =>
      props.theme.palette.mode === "dark"
        ? "radial-gradient(circle at center, rgba(25, 118, 210, 0.1) 0%, transparent 70%)"
        : "radial-gradient(circle at center, rgba(25, 118, 210, 0.05) 0%, transparent 70%)"};
    z-index: 0;
  }
`;

const FeatureCardContainer = styled(Paper)`
  padding: 2rem;
  margin: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(255, 255, 255, 0.8)"};
  backdrop-filter: blur(10px);
  border: 1px solid
    ${(props) =>
      props.theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.1)"};
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
`;

const GetStartedButtonContainer = styled(Button)`
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 30px;
  background: linear-gradient(
    45deg,
    ${(props) => (props.theme.palette.mode === "dark" ? "#ff4081" : "#f50057")},
    ${(props) => (props.theme.palette.mode === "dark" ? "#651fff" : "#3d5afe")}
  );
  color: white;
  position: relative;
  overflow: hidden;
  z-index: 1;
  animation: ${fadeInAnimation} 1s ease-out;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      ${(props) =>
        props.theme.palette.mode === "dark" ? "#ff1744" : "#d50000"},
      ${(props) =>
        props.theme.palette.mode === "dark" ? "#6200ea" : "#304ffe"}
    );
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const FloatingIconContainer = styled(Box)`
  position: absolute;
  opacity: 0.1;
  animation: ${floatAnimation} 6s ease-in-out infinite;
  z-index: 0;
`;

const ContentWrapperContainer = styled(Box)`
  position: relative;
  z-index: 1;
  animation: ${fadeInAnimation} 1s ease-out;
`;

const LogoContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 2;

  .logo-circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.palette.primary.main},
      ${(props) => props.theme.palette.secondary.main || "#f50057"}
    );
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      transform: rotate(15deg);
    }

    &::before {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.3) 0%,
        transparent 70%
      );
      opacity: 0.6;
    }
  }

  .logo-text {
    font-weight: 800;
    font-size: 1.4rem;
    letter-spacing: 0.5px;
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.palette.primary.main},
      ${(props) => props.theme.palette.secondary.main || "#f50057"}
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateX(5px);
    }
  }
`;

const FooterContainer = styled(Box)`
  padding: 2.5rem 1.5rem;
  background: ${(props) =>
    props.theme.palette.mode === "dark"
      ? "linear-gradient(to bottom, transparent, rgba(15, 15, 15, 0.9))"
      : "linear-gradient(to bottom, transparent, rgba(245, 245, 245, 0.9))"};
  backdrop-filter: blur(15px);
  margin-top: auto;
  width: 100%;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 10px;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      ${(props) => props.theme.palette.primary.main}40,
      ${(props) => props.theme.palette.primary.main}55,
      ${(props) => props.theme.palette.primary.main}40,
      transparent
    );
    opacity: 0.7;
  }

  .social-icons {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .social-icon {
    transition: all 0.3s ease;
    color: ${(props) => props.theme.palette.text.secondary};
    background: ${(props) =>
      props.theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.05)"};
    border-radius: 50%;
    padding: 10px;

    &:hover {
      color: ${(props) => props.theme.palette.primary.main};
      transform: translateY(-8px) rotate(10deg);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      background: ${(props) =>
        props.theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.03)"};
    }
  }
`;

const AnimatedInputContainer = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 12px;
    transition: all 0.3s ease;
    background: ${(props) =>
      props.theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.02)"};

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }

    &.Mui-focused {
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      border-color: ${(props) => props.theme.palette.primary.main};

      .MuiOutlinedInput-notchedOutline {
        border-width: 2px;
        border-color: ${(props) => props.theme.palette.primary.main};
      }
    }
  }

  .MuiInputLabel-root {
    &.Mui-focused {
      color: ${(props) => props.theme.palette.primary.main};
      font-weight: 500;
    }
  }
`;

const PulseButtonContainer = styled(Button)`
  position: relative;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: linear-gradient(
    135deg,
    ${(props) => (props.theme.palette.mode === "dark" ? "#ff4081" : "#f50057")},
    ${(props) => (props.theme.palette.mode === "dark" ? "#651fff" : "#3d5afe")}
  );
  min-width: 120px;
  color: white;
  font-weight: bold;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(1px) scale(0.98);
  }

  &::after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.8) 10%,
      transparent 10.01%
    );
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform 0.4s, opacity 0.8s;
  }

  &:active::after {
    transform: scale(0, 0);
    opacity: 0.3;
    transition: 0s;
  }

  .button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    z-index: 1;
  }
    background: ${(props) =>
      props.hovercolor || props.theme.palette.primary.dark};
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;

// Add this after imports but before component definition

const StopwatchDisplay = styled.div`
  font-family: "Digital-7", monospace;
  font-size: 3.5rem;
  color: ${(props) => props.theme.palette.primary.main};
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;

  .separator {
    animation: blink 1s infinite;
    opacity: 0.8;
  }

  .milliseconds {
    font-size: 2rem;
    color: ${(props) => props.theme.palette.secondary.main};
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const StopwatchButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const StopwatchButton = styled(Button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  min-width: auto;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  background: ${(props) => props.maincolor || props.theme.palette.primary.main};
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    background: ${(props) =>
      props.hovercolor || props.theme.palette.primary.dark};
  }

  &:active {
    transform: translateY(1px);
  }

  .MuiSvgIcon-root {
    color: white;
    font-size: 1.8rem;
  }
`;

// Update the EnhancedToggleButtonGroup and EnhancedToggleButton components with improved styling
const EnhancedToggleButtonGroup = styled(ToggleButtonGroup)`
  background: ${(props) =>
    props.theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.07)"
      : "rgba(0, 0, 0, 0.03)"};
  border-radius: 16px;
  padding: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid
    ${(props) =>
      props.theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)"};
  position: relative;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  .MuiToggleButtonGroup-grouped {
    margin: 4px;
    border: 0;
    border-radius: 12px !important;
    padding: 8px 20px;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
    font-weight: 600;
    min-width: 110px;
    position: relative;
    overflow: hidden;
    z-index: 1;
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        120deg,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 50%,
        transparent 100%
      );
      transform: translateX(-100%);
      transition: all 0.4s ease;
      z-index: -1;
    }

    &:hover {
      transform: translateY(-3px);
      &::before {
        transform: translateX(100%);
      }
    }

    &.Mui-selected {
      background: linear-gradient(
        135deg,
        ${(props) => props.theme.palette.primary.main},
        ${(props) => props.theme.palette.secondary.main}
      );
      color: white;
      font-weight: 700;
      box-shadow: 0 5px 15px ${(props) => props.theme.palette.primary.main}50;
      transform: translateY(-3px) scale(1.03);

      &:hover {
        background: linear-gradient(
          135deg,
          ${(props) => props.theme.palette.primary.dark},
          ${(props) => props.theme.palette.secondary.dark}
        );
      }

      svg {
        animation: pulse 2s infinite;
        filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.7));

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
      }
    }

    &:not(:first-of-type) {
      border-left: 0;
    }
  }
`;

const EnhancedToggleButton = styled(ToggleButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  svg {
    margin-right: 4px;
    transition: all 0.4s ease;
    font-size: 1.2rem;
  }

  &:hover svg {
    transform: rotate(15deg) scale(1.2);
  }

  &.Mui-selected {
    .MuiSvgIcon-root {
      color: white;
    }
  }
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [location, setLocation] = useState("");
  const [timeData, setTimeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timezones, setTimezones] = useState([]);
  const [cities, setCities] = useState([]);
  const [clockType, setClockType] = useState("analog");
  const [timeFormat, setTimeFormat] = useState("24");
  const [meetingDate, setMeetingDate] = useState(new Date());
  const [meetingTime, setMeetingTime] = useState("12:00");
  const [meetingTimezones, setMeetingTimezones] = useState([]);
  const [meetingResults, setMeetingResults] = useState([]);
  const [showMeetingScheduler, setShowMeetingScheduler] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [savedMeetings, setSavedMeetings] = useState([]);
  // Add stopwatch state variables
  const [showStopwatch, setShowStopwatch] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const intervalRef = React.useRef(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#651fff" : "#3d5afe",
      },
      secondary: {
        main: darkMode ? "#ff4081" : "#f50057",
      },
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
    },
  });

  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        const response = await axios.get(`${API_URL}/timezones`);
        setTimezones(response.data.timezones);
        setCities(response.data.cities);
      } catch (err) {
        console.error("Error fetching timezones:", err);
      }
    };
    fetchTimezones();
  }, []);

  useEffect(() => {
    let eventSource;
    if (location) {
      eventSource = new EventSource(`${API_URL}/time-stream/${location}`);
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setTimeData(data);
      };
      eventSource.onerror = () => {
        eventSource.close();
      };
    }
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [location]);

  const handleTimeSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}/time/${location}`);
      setTimeData(response.data);
    } catch (err) {
      setError(
        "Location not found. Please try a city name (e.g., 'New York') or timezone (e.g., 'America/New_York')"
      );
    }
    setLoading(false);
  };

  const handleClockTypeChange = (event, newType) => {
    if (newType !== null) {
      setClockType(newType);
    }
  };

  const handleTimeFormatChange = (event, newFormat) => {
    if (newFormat !== null) {
      setTimeFormat(newFormat);
    }
  };

  const options = [
    ...cities.map((city) => ({ label: city, type: "city" })),
    ...timezones.map((tz) => ({ label: tz, type: "timezone" })),
  ];

  const formatDigitalTime = (timeData) => {
    if (!timeData) return "";
    const [date, time] = timeData.current_time.split(" ");
    let [hours, minutes, seconds] = time.split(":");

    let ampm = "";
    if (timeFormat === "12") {
      const hourNum = parseInt(hours);
      ampm = hourNum >= 12 ? "PM" : "AM";
      hours = hourNum % 12 || 12;
      hours = hours.toString().padStart(2, "0");
    }

    return (
      <DigitalClock>
        <span>{hours}</span>
        <span className="separator">:</span>
        <span>{minutes}</span>
        <span className="separator">:</span>
        <span>{seconds}</span>
        {timeFormat === "12" && <span className="ampm">{ampm}</span>}
      </DigitalClock>
    );
  };

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  // After the existing useEffect hooks, add the stopwatch functions
  // Add stopwatch functions
  const formatStopwatchTime = (milliseconds) => {
    const ms = Math.floor((milliseconds % 1000) / 10);
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
      ms: ms.toString().padStart(2, "0"),
    };
  };

  const startStopwatch = () => {
    if (!isRunning) {
      setIsRunning(true);
      setStartTime(Date.now() - elapsedTime);
    }
  };

  const pauseStopwatch = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  };

  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setElapsedTime(0);
  };

  // Add useEffect for stopwatch timing
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, startTime]);

  const formatMeetingTime = (date, time, timezone) => {
    try {
      const [hours, minutes] = time.split(":");
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      // Create a date object in the specified timezone
      const formatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: timeFormat === "12",
        timeZone: timezone,
      });

      const localDate = new Date(
        year,
        month,
        day,
        parseInt(hours),
        parseInt(minutes)
      );
      return formatter.format(localDate);
    } catch (error) {
      console.error("Error formatting meeting time:", error);
      return "Invalid time";
    }
  };

  const calculateMeetingTimes = () => {
    if (meetingTimezones.length === 0) {
      return;
    }

    const results = meetingTimezones.map((timezone) => ({
      timezone,
      formattedTime: formatMeetingTime(meetingDate, meetingTime, timezone),
    }));

    setMeetingResults(results);
  };

  const handleAddTimezone = (timezone) => {
    if (timezone && !meetingTimezones.includes(timezone)) {
      setMeetingTimezones([...meetingTimezones, timezone]);
    }
  };

  const handleRemoveTimezone = (timezone) => {
    setMeetingTimezones(meetingTimezones.filter((tz) => tz !== timezone));
  };

  const saveMeeting = () => {
    if (!meetingTitle || meetingTimezones.length === 0 || !meetingTime) {
      return;
    }

    // Format date consistently to avoid serialization issues
    const formattedDate = meetingDate.toISOString().split("T")[0];

    const newMeeting = {
      id: Date.now(),
      title: meetingTitle,
      date: formattedDate,
      time: meetingTime,
      timezones: [...meetingTimezones],
    };

    console.log("Saving meeting:", newMeeting);
    setSavedMeetings((prev) => [...prev, newMeeting]);
    setMeetingTitle("");
  };

  const deleteMeeting = (id) => {
    setSavedMeetings(savedMeetings.filter((meeting) => meeting.id !== id));
  };

  if (showLanding) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LandingPage>
          <Box
            sx={{
              position: "absolute",
              top: "20px",
              right: "20px",
              zIndex: 10,
            }}
          >
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              color="inherit"
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                padding: "12px",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "rotate(180deg)",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.1)",
                },
              }}
            >
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>

          <Box
            sx={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}
          >
            <Logo>
              <div className="logo-circle">
                <PublicIcon sx={{ color: "white" }} />
              </div>
              <Typography variant="h6" className="logo-text">
                TimezoneBuddy
              </Typography>
            </Logo>
          </Box>

          <FloatingIcon sx={{ top: "10%", left: "10%", animationDelay: "0s" }}>
            <PublicIcon sx={{ fontSize: 100 }} />
          </FloatingIcon>
          <FloatingIcon sx={{ top: "20%", right: "10%", animationDelay: "2s" }}>
            <WatchIcon sx={{ fontSize: 80 }} />
          </FloatingIcon>
          <FloatingIcon
            sx={{ bottom: "20%", left: "15%", animationDelay: "4s" }}
          >
            <AccessTimeIcon sx={{ fontSize: 90 }} />
          </FloatingIcon>

          <ContentWrapper>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                TimezoneBuddy
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{
                  mb: 4,
                  maxWidth: "700px",
                  margin: "0 auto",
                }}
              >
                Your global time companion for seamless timezone management,
                meeting scheduling, and reminders
              </Typography>
            </Box>

            <Grid
              container
              spacing={4}
              sx={{ mb: 6, maxWidth: "1200px", margin: "0 auto" }}
            >
              <Grid item xs={12} md={4}>
                <FeatureCard elevation={3}>
                  <PublicIcon
                    sx={{
                      fontSize: 60,
                      color: "primary.main",
                      mb: 2,
                      animation: `${float} 3s ease-in-out infinite`,
                      animationDelay: "0s",
                    }}
                  />
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Global Time Lookup
                  </Typography>
                  <Typography color="text.secondary">
                    Instantly check the current time in any city or timezone
                    around the world
                  </Typography>
                </FeatureCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <FeatureCard elevation={3}>
                  <WatchIcon
                    sx={{
                      fontSize: 60,
                      color: "primary.main",
                      mb: 2,
                      animation: `${float} 3s ease-in-out infinite`,
                      animationDelay: "1s",
                    }}
                  />
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Beautiful Clocks
                  </Typography>
                  <Typography color="text.secondary">
                    Choose between elegant analog and digital clock displays
                    with 12h/24h formats
                  </Typography>
                </FeatureCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <FeatureCard elevation={3}>
                  <ScheduleIcon
                    sx={{
                      fontSize: 60,
                      color: "primary.main",
                      mb: 2,
                      animation: `${float} 3s ease-in-out infinite`,
                      animationDelay: "2s",
                    }}
                  />
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Meeting Scheduler
                  </Typography>
                  <Typography color="text.secondary">
                    Plan international meetings with automatic timezone
                    conversion for easier scheduling
                  </Typography>
                </FeatureCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <FeatureCard elevation={3}>
                  <SaveIcon
                    sx={{
                      fontSize: 60,
                      color: "primary.main",
                      mb: 2,
                      animation: `${float} 3s ease-in-out infinite`,
                      animationDelay: "1.5s",
                    }}
                  />
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Save & Manage Meetings
                  </Typography>
                  <Typography color="text.secondary">
                    Save important meetings and access them anytime with our
                    intuitive management system
                  </Typography>
                </FeatureCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <FeatureCard elevation={3}>
                  <AccessTimeIcon
                    sx={{
                      fontSize: 60,
                      color: "primary.main",
                      mb: 2,
                      animation: `${float} 3s ease-in-out infinite`,
                      animationDelay: "2.5s",
                    }}
                  />
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Real-time Updates
                  </Typography>
                  <Typography color="text.secondary">
                    Watch time update in real-time with smooth animations and
                    precise accuracy
                  </Typography>
                </FeatureCard>
              </Grid>
            </Grid>

            <GetStartedButton
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleGetStarted}
              sx={{
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              Get Started
            </GetStartedButton>
          </ContentWrapper>

          <Footer>
            <Box className="social-icons">
              <IconButton
                className="social-icon"
                component="a"
                href="https://github.com/yourusername/timezonebuddy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <GitHubIcon fontSize="medium" />
              </IconButton>
              <IconButton
                className="social-icon"
                component="a"
                href="https://twitter.com/timezonebuddy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <TwitterIcon fontSize="medium" />
              </IconButton>
              <IconButton
                className="social-icon"
                component="a"
                href="https://linkedin.com/company/timezonebuddy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon fontSize="medium" />
              </IconButton>
              <IconButton
                className="social-icon"
                component="a"
                href="mailto:contact@timezonebuddy.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email"
              >
                <EmailIcon fontSize="medium" />
              </IconButton>
            </Box>
            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                letterSpacing: 0.5,
                opacity: 0.8,
              }}
            >
              © {new Date().getFullYear()} TimezoneBuddy | All Rights Reserved
            </Typography>
            <Typography
              variant="caption"
              align="center"
              display="block"
              color="text.secondary"
              sx={{
                mt: 1,
                fontSize: "0.8rem",
                fontWeight: 300,
                letterSpacing: 1,
                opacity: 0.7,
              }}
            >
              Made with <span style={{ color: "#ff5c8d" }}>❤️</span> for global
              collaboration
            </Typography>
          </Footer>
        </LandingPage>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(to right, #1a237e, #311b92)"
                : "linear-gradient(to right, #3949ab, #5e35b1)",
            borderBottom: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
            backdropFilter: "blur(8px)",
            transition: "all 0.3s ease",
          }}
        >
          <Container maxWidth="lg">
            <Toolbar sx={{ py: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexGrow: 1,
                  "&:hover .logo-icon": {
                    transform: "rotate(20deg)",
                  },
                }}
              >
                <Box
                  className="logo-icon-container"
                  sx={{
                    mr: 2,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
                    p: 1,
                    borderRadius: "50%",
                    display: "flex",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                >
                  <PublicIcon
                    className="logo-icon"
                    sx={{
                      fontSize: 40,
                      color: "#fff",
                      transition:
                        "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background:
                      "linear-gradient(45deg, #ffffff, rgba(255,255,255,0.7))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 2px 10px rgba(0,0,0,0.15)",
                    letterSpacing: "0.5px",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -2,
                      left: 0,
                      width: "30%",
                      height: 3,
                      background:
                        "linear-gradient(to right, rgba(255,255,255,0.7), transparent)",
                      borderRadius: "2px",
                    },
                  }}
                >
                  TimezoneBuddy
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Button
                  variant="text"
                  color="inherit"
                  onClick={() => setShowStopwatch(!showStopwatch)}
                  startIcon={<TimerIcon />}
                  sx={{
                    color: "#fff",
                    fontSize: "0.9rem",
                    py: 1,
                    px: 2,
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.1)",
                    "&:hover": {
                      background: "rgba(255,255,255,0.2)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s ease",
                    display: { xs: "none", sm: "flex" },
                  }}
                >
                  Stopwatch
                </Button>

                <Button
                  variant="text"
                  color="inherit"
                  onClick={() => setShowMeetingScheduler(!showMeetingScheduler)}
                  startIcon={<AccessTimeIcon />}
                  sx={{
                    color: "#fff",
                    fontSize: "0.9rem",
                    py: 1,
                    px: 2,
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.1)",
                    "&:hover": {
                      background: "rgba(255,255,255,0.2)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s ease",
                    display: { xs: "none", sm: "flex" },
                  }}
                >
                  Meetings
                </Button>

                <IconButton
                  onClick={() => setDarkMode(!darkMode)}
                  sx={{
                    p: 1.5,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(4px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    "&:hover": {
                      background: "rgba(255,255,255,0.25)",
                      transform: "rotate(30deg)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {darkMode ? (
                    <Brightness7Icon sx={{ color: "#fff" }} />
                  ) : (
                    <Brightness4Icon sx={{ color: "#fff" }} />
                  )}
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="lg" sx={{ flex: 1, my: 4 }}>
          <Box sx={{ my: 4 }}>
            <StyledPaper elevation={3}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LocationOnIcon color="primary" />
                Timezone Lookup
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <Autocomplete
                  fullWidth
                  options={options}
                  value={
                    location ? { label: location, type: "location" } : null
                  }
                  onChange={(event, newValue) =>
                    setLocation(newValue?.label || "")
                  }
                  groupBy={(option) => option.type}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <AnimatedInput
                      {...params}
                      label="Enter city or timezone"
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  sx={{
                    "& .MuiAutocomplete-listbox": {
                      "& .MuiAutocomplete-option": {
                        transition: "background-color 0.2s ease",
                        borderLeft: "0px solid transparent",
                        "&:hover": {
                          borderLeft: `4px solid ${theme.palette.primary.main}`,
                        },
                      },
                      "& .MuiAutocomplete-groupLabel": {
                        background:
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.05)",
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                      },
                    },
                  }}
                />
                <PulseButton
                  variant="contained"
                  onClick={handleTimeSearch}
                  disabled={loading || !location}
                  sx={{
                    height: "56px",
                  }}
                >
                  <span className="button-content">
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        <SearchIcon className="search-icon" />
                        Search
                      </>
                    )}
                  </span>
                </PulseButton>
              </Box>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              {timeData && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 3,
                      mb: 4,
                      mt: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <EnhancedToggleButtonGroup
                      value={clockType}
                      exclusive
                      onChange={handleClockTypeChange}
                      aria-label="clock type"
                    >
                      <EnhancedToggleButton
                        value="analog"
                        aria-label="analog clock"
                      >
                        <WatchIcon />
                        Analog Clock
                      </EnhancedToggleButton>
                      <EnhancedToggleButton
                        value="digital"
                        aria-label="digital clock"
                      >
                        <AccessTimeIcon />
                        Digital Clock
                      </EnhancedToggleButton>
                    </EnhancedToggleButtonGroup>

                    {clockType === "digital" && (
                      <EnhancedToggleButtonGroup
                        value={timeFormat}
                        exclusive
                        onChange={handleTimeFormatChange}
                        aria-label="time format"
                      >
                        <EnhancedToggleButton
                          value="12"
                          aria-label="12 hour format"
                        >
                          <span
                            style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                          >
                            12
                          </span>
                          Hour Format
                        </EnhancedToggleButton>
                        <EnhancedToggleButton
                          value="24"
                          aria-label="24 hour format"
                        >
                          <span
                            style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                          >
                            24
                          </span>
                          Hour Format
                        </EnhancedToggleButton>
                      </EnhancedToggleButtonGroup>
                    )}
                  </Box>
                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: "300px",
                        }}
                      >
                        {clockType === "analog" ? (
                          <WatchFace>
                            {[...Array(12)].map((_, i) => (
                              <WatchNumber key={i} angle={i * 30}>
                                <span>{i + 1}</span>
                              </WatchNumber>
                            ))}
                            <HourHand
                              hour={timeData.hour}
                              minute={timeData.minute}
                            />
                            <MinuteHand minute={timeData.minute} />
                            <SecondHand second={timeData.second} />
                            <WatchCenter />
                          </WatchFace>
                        ) : (
                          formatDigitalTime(timeData)
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          textAlign: { xs: "center", md: "left" },
                          p: 2,
                        }}
                      >
                        <Typography
                          variant="h5"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          {timeData.timezone}
                        </Typography>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ color: "text.secondary" }}
                        >
                          Current Time: {timeData.current_time}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "text.secondary",
                            display: "inline-block",
                            p: 1,
                            borderRadius: "4px",
                            bgcolor: "action.hover",
                          }}
                        >
                          UTC Offset: {timeData.utc_offset}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </>
              )}

              <Box sx={{ mt: 4, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Button
                      onClick={() =>
                        setShowMeetingScheduler(!showMeetingScheduler)
                      }
                      color="primary"
                      variant="outlined"
                      startIcon={
                        showMeetingScheduler ? (
                          <ArrowForwardIcon />
                        ) : (
                          <AccessTimeIcon />
                        )
                      }
                      sx={{
                        borderRadius: "10px",
                        px: 3,
                        py: 1,
                        fontWeight: "medium",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      {showMeetingScheduler
                        ? "Hide Meeting Scheduler"
                        : "Meeting Scheduler"}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      onClick={() => setShowStopwatch(!showStopwatch)}
                      color="secondary"
                      variant="outlined"
                      startIcon={<TimerIcon />}
                      sx={{
                        borderRadius: "10px",
                        px: 3,
                        py: 1,
                        fontWeight: "medium",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      {showStopwatch ? "Hide Stopwatch" : "Stopwatch"}
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {showStopwatch && (
                <Box
                  sx={{
                    mt: 3,
                    p: 3,
                    bgcolor: "background.default",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", mb: 3 }}
                  >
                    Stopwatch
                  </Typography>

                  <StopwatchDisplay>
                    {(() => {
                      const time = formatStopwatchTime(elapsedTime);
                      return (
                        <>
                          <span>{time.hours}</span>
                          <span className="separator">:</span>
                          <span>{time.minutes}</span>
                          <span className="separator">:</span>
                          <span>{time.seconds}</span>
                          <span className="separator">.</span>
                          <span className="milliseconds">{time.ms}</span>
                        </>
                      );
                    })()}
                  </StopwatchDisplay>

                  <StopwatchButtons>
                    {!isRunning ? (
                      <StopwatchButton
                        onClick={startStopwatch}
                        maincolor={theme.palette.success.main}
                        hovercolor={theme.palette.success.dark}
                      >
                        <PlayArrowIcon />
                      </StopwatchButton>
                    ) : (
                      <StopwatchButton
                        onClick={pauseStopwatch}
                        maincolor={theme.palette.warning.main}
                        hovercolor={theme.palette.warning.dark}
                      >
                        <PauseIcon />
                      </StopwatchButton>
                    )}
                    <StopwatchButton
                      onClick={resetStopwatch}
                      maincolor={theme.palette.error.main}
                      hovercolor={theme.palette.error.dark}
                    >
                      <RestartAltIcon />
                    </StopwatchButton>
                  </StopwatchButtons>
                </Box>
              )}

              {showMeetingScheduler && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: "background.default",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold" }}
                  >
                    Schedule a Meeting Across Timezones
                  </Typography>

                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                      <TextField
                        label="Meeting Title"
                        fullWidth
                        value={meetingTitle}
                        onChange={(e) => setMeetingTitle(e.target.value)}
                        placeholder="e.g., Weekly Team Standup"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Date"
                        type="date"
                        fullWidth
                        value={meetingDate.toISOString().split("T")[0]}
                        onChange={(e) =>
                          setMeetingDate(new Date(e.target.value))
                        }
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Time"
                        type="time"
                        fullWidth
                        value={meetingTime}
                        onChange={(e) => setMeetingTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: "medium" }}
                  >
                    Add Timezones:
                  </Typography>

                  <Box
                    sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}
                  >
                    <Autocomplete
                      options={timezones}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Timezone"
                          variant="outlined"
                          sx={{ minWidth: "250px" }}
                        />
                      )}
                      onChange={(_, value) => handleAddTimezone(value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                        },
                        "& .MuiAutocomplete-option": {
                          '&[data-option-index*="Asia/Kolkata"]': {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255, 64, 129, 0.15)"
                                : "rgba(245, 0, 87, 0.08)",
                            fontWeight: "bold",
                          },
                        },
                      }}
                      renderOption={(props, option) => (
                        <li
                          {...props}
                          style={
                            option === "Asia/Kolkata"
                              ? {
                                  fontWeight: "bold",
                                  backgroundColor:
                                    theme.palette.mode === "dark"
                                      ? "rgba(255, 64, 129, 0.15)"
                                      : "rgba(245, 0, 87, 0.08)",
                                }
                              : {}
                          }
                        >
                          {option}
                        </li>
                      )}
                    />

                    <Box
                      sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 1 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ mr: 1, alignSelf: "center" }}
                      >
                        Quick Add:
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleAddTimezone("Asia/Kolkata")}
                        sx={{
                          borderRadius: "20px",
                          py: 0.5,
                          borderColor: theme.palette.secondary.main,
                          color: theme.palette.secondary.main,
                          "&:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255, 64, 129, 0.15)"
                                : "rgba(245, 0, 87, 0.08)",
                            borderColor: theme.palette.secondary.main,
                          },
                        }}
                      >
                        🇮🇳 India (Asia/Kolkata)
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleAddTimezone("America/New_York")}
                        sx={{
                          borderRadius: "20px",
                          py: 0.5,
                        }}
                      >
                        🇺🇸 New York
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleAddTimezone("Europe/London")}
                        sx={{
                          borderRadius: "20px",
                          py: 0.5,
                        }}
                      >
                        🇬🇧 London
                      </Button>
                    </Box>

                    <PulseButton
                      onClick={calculateMeetingTimes}
                      disabled={meetingTimezones.length === 0}
                      sx={{ height: "56px" }}
                    >
                      <span className="button-content">
                        <AccessTimeIcon className="search-icon" />
                        Calculate Times
                      </span>
                    </PulseButton>
                  </Box>

                  {meetingTimezones.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Selected Timezones:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        {meetingTimezones.map((tz) => (
                          <Chip
                            key={tz}
                            label={tz}
                            onDelete={() => handleRemoveTimezone(tz)}
                            color="primary"
                            variant="outlined"
                            sx={{
                              borderRadius: "8px",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 3px 5px rgba(0,0,0,0.1)",
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  {meetingResults.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ mb: 2, fontWeight: "medium" }}
                      >
                        Meeting Times:
                      </Typography>
                      <Grid container spacing={2}>
                        {meetingResults.map((result) => (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={result.timezone}
                          >
                            <Paper
                              elevation={2}
                              sx={{
                                p: 2,
                                borderRadius: "10px",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "translateY(-5px)",
                                  boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
                                },
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                color="primary"
                                sx={{ fontWeight: "bold" }}
                              >
                                {result.timezone}
                              </Typography>
                              <Typography variant="body1">
                                {result.formattedTime}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {meetingResults.length > 0 && (
                    <Box
                      sx={{
                        mt: 4,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={saveMeeting}
                        disabled={!meetingTitle}
                        sx={{
                          borderRadius: "10px",
                          transition: "all 0.3s ease",
                          background: theme.palette.success.main,
                          px: 3,
                          py: 1.2,
                          fontWeight: "bold",
                          "&:hover": {
                            background: theme.palette.success.dark,
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                          },
                        }}
                      >
                        Save Meeting
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </StyledPaper>
          </Box>

          {/* Saved meetings section with the enhanced styling */}
          {savedMeetings.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                }}
              >
                <AccessTimeIcon color="primary" />
                Saved Meetings
              </Typography>

              <Grid container spacing={3}>
                {savedMeetings.map((meeting) => {
                  const meetingDate = new Date(meeting.date);
                  const formattedDate = meetingDate.toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    }
                  );

                  return (
                    <Grid item xs={12} sm={6} md={4} key={meeting.id}>
                      <Paper
                        elevation={3}
                        sx={{
                          p: 0,
                          borderRadius: "16px",
                          position: "relative",
                          transition: "all 0.3s ease",
                          overflow: "hidden",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          "&:hover": {
                            transform: "translateY(-6px)",
                            boxShadow:
                              theme.palette.mode === "dark"
                                ? "0 12px 28px rgba(0,0,0,0.4)"
                                : "0 12px 28px rgba(0,0,0,0.2)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            background: `linear-gradient(120deg, ${theme.palette.primary.main}40, ${theme.palette.secondary.main}30)`,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              mb: 1,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {meeting.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              color: theme.palette.text.secondary,
                              fontWeight: "medium",
                            }}
                          >
                            <CalendarTodayIcon fontSize="small" />
                            {formattedDate} at {meeting.time}
                          </Typography>
                        </Box>

                        <Box sx={{ p: 2, flexGrow: 1 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ mb: 1, fontWeight: "medium" }}
                          >
                            Timezones:
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 1,
                            }}
                          >
                            {meeting.timezones.map((tz) => (
                              <Chip
                                key={tz}
                                label={tz}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{
                                  borderRadius: "16px",
                                  fontWeight: "medium",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    backgroundColor: theme.palette.action.hover,
                                    transform: "translateY(-2px)",
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            p: 1.5,
                            display: "flex",
                            justifyContent: "flex-end",
                            borderTop: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.background.default,
                          }}
                        >
                          <IconButton
                            onClick={() => deleteMeeting(meeting.id)}
                            color="error"
                            size="small"
                            sx={{
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.error.light + "30",
                                transform: "rotate(5deg) scale(1.1)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
        </Container>

        <Footer>
          <Box className="social-icons">
            <IconButton
              className="social-icon"
              component="a"
              href="https://github.com/yourusername/timezonebuddy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GitHubIcon fontSize="medium" />
            </IconButton>
            <IconButton
              className="social-icon"
              component="a"
              href="https://twitter.com/timezonebuddy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <TwitterIcon fontSize="medium" />
            </IconButton>
            <IconButton
              className="social-icon"
              component="a"
              href="https://linkedin.com/company/timezonebuddy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon fontSize="medium" />
            </IconButton>
            <IconButton
              className="social-icon"
              component="a"
              href="mailto:contact@timezonebuddy.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email"
            >
              <EmailIcon fontSize="medium" />
            </IconButton>
          </Box>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              letterSpacing: 0.5,
              opacity: 0.8,
            }}
          >
            © {new Date().getFullYear()} TimezoneBuddy | All Rights Reserved
          </Typography>
          <Typography
            variant="caption"
            align="center"
            display="block"
            color="text.secondary"
            sx={{
              mt: 1,
              fontSize: "0.8rem",
              fontWeight: 300,
              letterSpacing: 1,
              opacity: 0.7,
            }}
          >
            Made with <span style={{ color: "#ff5c8d" }}>❤️</span> for global
            collaboration
          </Typography>
        </Footer>
      </Box>
    </ThemeProvider>
  );
}

export default App;
