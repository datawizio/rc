import { v4 as uuidv4 } from "uuid";
import {
  Player as VideoReact,
  BigPlayButton,
  LoadingSpinner,
  ControlBar
} from "video-react";

import type { FC, RefObject } from "react";
import type { Source } from "./types";
import type {
  PlayerReference,
  PlayerProps as VideoReactProps
} from "video-react";

import "video-react/dist/video-react.css";

export interface PlayerProps extends VideoReactProps {
  ref?: RefObject<PlayerReference | null>;
  source: Source | Source[];
  prefixCls?: string;
  fullscreen?: boolean;
}

const Player: FC<PlayerProps> = ({ ref, source, prefixCls, ...props }) => {
  const videoSource = Array.isArray(source) ? (
    source.map(({ src, type }) => (
      <source key={`source-${uuidv4()}`} src={src} type={type} />
    ))
  ) : (
    <source src={source.src} type={source.type} />
  );

  return (
    <VideoReact ref={ref} preload="auto" fluid={true} {...props}>
      {videoSource}
      <BigPlayButton
        position="center"
        className={`${prefixCls}-big-play-button`}
      />
      <LoadingSpinner />
      <ControlBar className={`${prefixCls}-control-bar`} />
    </VideoReact>
  );
};

export default Player;
