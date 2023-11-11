import { getPropertyName } from "./names";
import { ProcessUpdate, Action, Status } from "./status";
import { isInterruptedFlexible } from "./updater";
export class InterruptError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InterruptError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Updates the process status in the properties service.
 * @param {ProcessUpdate} update - The update object containing the process information.
 */
export function updateProcess(
  update: ProcessUpdate,
  propertiesService = PropertiesService
) {
  const props = propertiesService.getUserProperties();
  try {
    const updateJson = JSON.stringify(update);
    props.setProperty(getPropertyName(update.func, "status"), updateJson);
  } catch (error) {
    console.error("Error stringifying process update:", error);
    throw error; // or handle it as needed
  }
}

/**
 * The Updater class manages process updates and handles interruptions.
 */
export class ProcessUpdater {
  public processUpdate: ProcessUpdate;
  public currentAction?: Action;
  private propertiesService: GoogleAppsScript.Properties.PropertiesService;
  /**
   * Creates an instance of Updater.
   * @param {string} fname - The function name associated with this process.
   * @param {Partial<ProcessUpdate>} init - Initial values to set up the process update.
   */
  constructor(
    fname: string,
    init: Partial<ProcessUpdate> = {},
    propertiesService = PropertiesService
  ) {
    this.propertiesService = propertiesService;
    this.processUpdate = {
      func: fname,
      status: init.status ?? "unknown",
      name: init.name ?? "",
      description: init.description ?? "",
      actions: [],
    };
  }

  completeProcess(status: Status = "complete") {
    this.processUpdate.status = status;
    if (this.currentAction) {
      this.currentAction.status = "complete";
    }
    this.doUpdate();
  }

  /**
   * Adds an action to the current process update.
   * @param {Action} action - The action to add.
   * @param {boolean} update - Whether to update the process immediately.
   */
  addAction(action: Action, update: boolean = true) {
    action.startTime = action.startTime || Date.now();
    this.processUpdate.actions.push(action);
    this.currentAction = action;
    if (update) {
      this.doUpdate();
    }
    const complete = (updates: Partial<Action> = {}) => {
      action.endTime = Date.now();
      action.status = "complete";
      for (let key in updates) {
        // @ts-ignore - we know key is in Action
        action[key] = updates[key];
      }
      this.doUpdate();
    };
    return {
      action,
      complete,
    };
  }

  /**
   * Checks for an interruption and throws an InterruptError if one has occurred.
   */
  checkInterrupt() {
    if (
      isInterruptedFlexible(this.processUpdate.func, this.propertiesService)
    ) {
      this.processUpdate.status = "interrupted";
      if (this.currentAction) {
        this.currentAction.status = "interrupted";
        this.currentAction.endTime = Date.now();
      }
      updateProcess(this.processUpdate);
      throw new InterruptError("Process was interrupted by user");
    }
  }

  /**
   * Updates the process status and checks for interruptions.
   */
  doUpdate() {
    this.checkInterrupt();
    updateProcess(this.processUpdate, this.propertiesService);
  }
}
