export type Status =
  | "unknown"
  | "queued"
  | "running"
  | "complete"
  | "error"
  | "interrupted";

export const UNKNOWN_STATUS: ProcessUpdate = {
  func: "",
  name: "",
  description: "",
  status: "unknown",
  actions: [],
};

export type ProcessUpdate = {
  func: string;
  name: string;
  description: string;
  status: Status;
  error?: string;
  actions: Action[];
};
export type ProcessUpdatePartial = {
  func?: string;
  name: string;
  description: string;
  status: Status;
  error?: string;
  actions?: Action[];
};

export type Action = {
  name: string;
  description: string;
  total?: number;
  current?: number;
  startTime?: number;
  endTime?: number;
  status?: Status;
};
