import type { Dispatch, SetStateAction } from "react";
import type { ModalProps, ButtonProps as AntButtonProps } from "antd";
import type { PlayerState } from "video-react";
import type { Source } from "@/components/Player/types";

export type VoidCallback = () => void;

export type VideoStateChangeCallback = (playerState: PlayerState) => void;

export interface ThumbnailProps {
  url: string;
  onClick?: VoidCallback;
}

export interface VideoModalProps {
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  thumbnail?: string;
  buttonProps?: AntButtonProps & {
    text: string;
    border?: boolean;
    highlight?: boolean;
  };
  source: Source;
  modalProps?: ModalProps;
  onVideoStateChange?: VideoStateChangeCallback;
  onThumbnailClick?: () => void;
}
