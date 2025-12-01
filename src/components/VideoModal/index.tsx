import Button from "../Button";
import Player from "../Player";
import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import { Thumbnail } from "./components/Thumbnail";

import type { FC } from "react";
import type { PlayerReference } from "video-react";
import type { VideoModalProps } from "./types";

import "./index.less";

const VideoModal: FC<VideoModalProps> = ({
  open,
  setOpen,
  thumbnail,
  buttonProps,
  source,
  modalProps,
  onThumbnailClick,
  onVideoStateChange
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (open !== undefined) {
      setModalVisible(open);
    }
  }, [open]);

  const player = useRef<PlayerReference>(null);

  useEffect(() => {
    if (player.current) {
      player.current.subscribeToStateChange(playerState => {
        if (playerState.ended) {
          setModalVisible(false);
          setOpen?.(false);
        }
        onVideoStateChange?.(playerState);
      });
    }
  });

  const handleThumbnailClick = () => {
    setModalVisible(true);
    setOpen?.(true);
    player.current?.play();
    onThumbnailClick?.();
  };
  const handleCancel = () => {
    setModalVisible(false);
    setOpen?.(false);
  };

  const handleClose = () => {
    player.current?.pause();
  };

  return (
    <div className="modal-player">
      {thumbnail && (
        <Thumbnail url={thumbnail} onClick={handleThumbnailClick} />
      )}
      {buttonProps && (
        <Button {...buttonProps} onClick={handleThumbnailClick}>
          {buttonProps.text}
        </Button>
      )}
      <Modal
        {...modalProps}
        open={modalVisible}
        footer={null}
        title={null}
        centered
        width="80%"
        closeIcon={null}
        closable={false}
        maskClosable
        afterClose={handleClose}
        onCancel={handleCancel}
        styles={{ body: { padding: 0 } }}
      >
        <Player
          fullscreen
          prefixCls="player"
          ref={player}
          source={source}
          autoPlay
        />
      </Modal>
    </div>
  );
};

export default VideoModal;
