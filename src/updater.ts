import { getPropertyName } from "./names";
import { ProcessUpdate, UNKNOWN_STATUS } from "./status";

export function getFunctionStatus(fname: string): ProcessUpdate {
  let props = PropertiesService.getUserProperties();
  let prop = props.getProperty(getPropertyName(fname, "status"));
  if (prop) {
    return JSON.parse(prop);
  } else {
    return { ...UNKNOWN_STATUS, func: fname };
  }
}

export function isInterrupted(fname: string) {
  let props = PropertiesService.getUserProperties();
  let prop = props.getProperty(getPropertyName(fname, "interrupt"));
  return prop === "true";
}

export function interruptFunction(fname: string) {
  let props = PropertiesService.getUserProperties();
  props.setProperty(getPropertyName(fname, "interrupt"), "true");
}
