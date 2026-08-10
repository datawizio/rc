import Bowser from "bowser";

export const browser = Bowser.getParser(window.navigator.userAgent);

/* Helpers */

export const isSafari = () => {
  return browser.isBrowser("safari");
};

export const isChromium = () => {
  return browser.isEngine("blink");
};

export const getBrowserWithVersion = () => {
  const name = browser.getBrowserName();
  const version = browser.getBrowserVersion()?.split(".").slice(0, 2).join(".");
  return !version ? name : `${name} ${version}`;
};

/* Geolocation */

export type GeolocationCallback = (
  pos: Pick<GeolocationCoordinates, "latitude" | "longitude">
) => void;

export const getGeolocation = (callback: GeolocationCallback) => {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(pos => {
    callback({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    });
  });
};
