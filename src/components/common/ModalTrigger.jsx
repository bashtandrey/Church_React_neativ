import React, { useState } from "react";

/**
 * usage:
 * <ModalTrigger
 *   opener={(open) => <Pressable onPress={open}>Open</Pressable>}
 * >
 *   {({ close }) => <CreateGroupModal visible onClose={close} onSubmit={...} />}
 * </ModalTrigger>
 */
export default function ModalTrigger({ opener, children }) {
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);

  return (
    <>
      {typeof opener === "function" ? opener(open) : null}
      {visible && typeof children === "function" ? children({ visible, close }) : null}
    </>
  );
}