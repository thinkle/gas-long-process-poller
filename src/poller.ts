import { getPropertyName } from "./names";
import {
  ProcessUpdatePartial,
  ProcessUpdate,
  Action,
  UNKNOWN_STATUS,
  Status,
} from "./status";
import { isInterrupted } from "./updater";

export function updateProcess(update: ProcessUpdate) {
  let fname = update.func;
  let props = PropertiesService.getUserProperties();
  props.setProperty(getPropertyName(fname, "status"), JSON.stringify(update));
}

export class Updater {
  private processUpdate: ProcessUpdate;
  public currentAction?: Action;
  constructor(
    public fname: string,
    {
      status: Status = "unknown",
      name = "",
      description = "",
    }: Partial<ProcessUpdate> = {
      status: "unknown",
      name: "",
      description: "",
    }
  ) {
    let confirmedStatus: Status = (status || "unknown") as Status;
    this.processUpdate = {
      func: fname,
      status: confirmedStatus,
      name,
      description,
      actions: [],
    };
  }
  addAction(action: Action, update = true) {
    if (!action.startTime) {
      action.startTime = Date.now();
    }
    this.processUpdate.actions.push(action);
    this.currentAction = action;
    this.doUpdate();
  }

  checkInterrupt() {
    if (isInterrupted(this.fname)) {
      this.processUpdate.status = "interrupted";
      if (this.currentAction) {
        this.currentAction.status = "interrupted";
        this.currentAction.endTime = Date.now();
      }
      updateProcess(this.processUpdate);
      throw new Error("interrupted");
    }
  }

  doUpdate() {
    this.checkInterrupt();
    updateProcess(this.processUpdate);
  }
}
