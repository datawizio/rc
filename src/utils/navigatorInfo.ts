import Bowser from "bowser";

export const browser = Bowser.getParser(window.navigator.userAgent);

/* Browser */

export const isSafari = () => {
  return browser.getBrowserName(true) === "safari";
};

export const isChrome = () => {
  return browser.getBrowserName(true) === "chrome";
};

/* Operating system */

export const isIOS = () => {
  return browser.getOSName(true) === "ios";
};

export const isAndroid = () => {
  return browser.getOSName(true) === "android";
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
