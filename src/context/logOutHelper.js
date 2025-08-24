let logOutFn = null;

export function setLogOut(fn) {
  logOutFn = fn;
}

export function callLogOut() {
  if (typeof logOutFn === "function") {
    logOutFn();
  }
}
