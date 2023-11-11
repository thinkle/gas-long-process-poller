/* Mocks for client side testing without an 
   actual apps script environment */

// mock.ts
import {
  InterruptError,
  ProcessUpdater as OriginalProcessUpdater,
} from "./poller";
import {
  getFunctionStatusFlexible as originalGetFunctionStatus,
  interruptFunctionFlexible as originalInterruptFunction,
} from "./updater";
import type { ProcessUpdate } from "./status";

// Mock PropertiesService
const mockProperties = new Map<string, string>();
const MockPropertiesService = {
  getUserProperties: () => ({
    setProperty: (key: string, value: string) => {
      mockProperties.set(key, value);
    },
    getProperty: (key: string) => {
      return mockProperties.get(key);
    },
  }),
};

export class ProcessUpdater extends OriginalProcessUpdater {
  constructor(fname: string, init: Partial<ProcessUpdate> = {}) {
    super(
      fname,
      init,
      MockPropertiesService as GoogleAppsScript.Properties.PropertiesService
    );
  }
}

export function getFunctionStatus(fname: string) {
  return originalGetFunctionStatus(
    fname,
    MockPropertiesService as GoogleAppsScript.Properties.PropertiesService
  );
}
export function interruptFunction(fname: string) {
  return originalInterruptFunction(
    fname,
    MockPropertiesService as GoogleAppsScript.Properties.PropertiesService
  );
}
