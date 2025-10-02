import { callLogOut } from "@/context/logOutHelper";
import { navigationRef } from "@/navigation/navigationRef";
import { CommonActions } from "@react-navigation/native";

export function errorJWT() {
  callLogOut();

  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    })
  );
}