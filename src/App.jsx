/* eslint-disable import/no-anonymous-default-export */
import SmoothScroll from "smooth-scroll";
import { Header } from "./components/header";
import { RefreshContextProvider } from "./data/utils";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

export default () => (
  <RefreshContextProvider>
    <div>
      <Header />
    </div>
  </RefreshContextProvider>
);
