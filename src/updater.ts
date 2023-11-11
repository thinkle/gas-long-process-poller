import { getPropertyName } from "./names";
import { ProcessUpdate, UNKNOWN_STATUS } from "./status";

export function getFunctionStatusFlexible(
  fname: string,
  propertiesService = PropertiesService
): ProcessUpdate {
  let props = propertiesService.getUserProperties();
  let prop = props.getProperty(getPropertyName(fname, "status"));
  if (prop) {
    return JSON.parse(prop);
  } else {
    return { ...UNKNOWN_STATUS, func: fname };
  }
}
export function getFunctionStatus(fname: string): ProcessUpdate {
  return getFunctionStatusFlexible(fname, PropertiesService);
}

export function isInterrupted(fname: string) {
  return isInterruptedFlexible(fname, PropertiesService);
}
export function isInterruptedFlexible(
  fname: string,
  propertiesService = PropertiesService
) {
  let props = propertiesService.getUserProperties();
  let prop = props.getProperty(getPropertyName(fname, "interrupt"));
  return prop === "true";
}

export function interruptFunctionFlexible(
  fname: string,
  propertiesService = PropertiesService
) {
  let props = propertiesService.getUserProperties();
  props.setProperty(getPropertyName(fname, "interrupt"), "true");
}

export function interruptFunction(fname: string) {
  return interruptFunctionFlexible(fname, PropertiesService);
}
