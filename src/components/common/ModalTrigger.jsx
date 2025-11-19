import React, { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
export default function ModalTrigger({ opener, children }) {
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);

  return (
    <>
      {typeof opener === "function" ? opener(open) : null}

      {visible && typeof children === "function" ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children({ visible, close })}
        </KeyboardAvoidingView>
      ) : null}
    </>
  );
}

/**
 * usage:
 * <ModalTrigger
 *   opener={(open) => <Pressable onPress={open}>Open</Pressable>}
 * >
 *   {({ close }) => <CreateGroupModal visible onClose={close} onSubmit={...} />}
 * </ModalTrigger>
 */
