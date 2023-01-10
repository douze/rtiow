export enum WorkerStatus {
  AVAILABLE = "Available",
  BUSY = "Busy"
}

export class WorkerItem {

  private index: number;
  private worker: Worker;
  private status: WorkerStatus;

  constructor(index: number, script: string) {
    this.index = index;
    this.worker = new Worker(new URL(script, import.meta.url), { type: 'module' });
    this.status = WorkerStatus.AVAILABLE;
  }

  public getIndex(): number { return this.index; }
  public getWorker(): Worker { return this.worker; }
  public getStatus(): WorkerStatus { return this.status; }
  public setAvailabe(): void { this.status = WorkerStatus.AVAILABLE; }
  public setBusy(): void { this.status = WorkerStatus.BUSY; }

}

export interface WorkerQueueSettings {
  queueSize: number,
  workerScript: string,
  workerSize: number
}

export class WorkerQueue {

  private workerItems: Array<WorkerItem> = [];
  private messageQueue: Array<((worker: Worker) => void)> = [];

  public onChange!: (wokerItem: WorkerItem) => void;

  constructor(private workerQueueSettings: WorkerQueueSettings) {
    for (let i = 0; i < workerQueueSettings.queueSize; i++) {
      this.workerItems[i] = new WorkerItem(i, workerQueueSettings.workerScript);
    }
  }

  public getDefaultWorkerSize(): number {
    return this.workerQueueSettings.workerSize;
  }

  private grabWorkerItem(): WorkerItem {
    const workerItem = this.workerItems.shift()!;
    workerItem.setBusy();
    this.onChange(workerItem);
    return workerItem;
  }

  private releaseWorkerItem(workerItem: WorkerItem): void {
    workerItem.setAvailabe();
    this.onChange(workerItem);
    this.workerItems.push(workerItem);
    this.handleNextJob();
  }

  public registerJob(
    preRenderCallback: (worker: Worker) => void,
    askRenderCallback: (worker: Worker) => void,
    applyRenderCallback: (event: MessageEvent) => void): void {
    if (this.workerItems.length > 0) {
      // Do job if worker available
      const workerItem = this.grabWorkerItem();
      const worker = workerItem.getWorker();
      preRenderCallback(workerItem.getWorker());
      askRenderCallback(worker);
      worker.addEventListener('message', (event: MessageEvent) => {
        applyRenderCallback(event);
        this.releaseWorkerItem(workerItem);
      });
    } else {
      // Or queue job
      this.messageQueue.push(askRenderCallback);
    }
  }

  private handleNextJob(): void {
    if (this.messageQueue.length > 0) {
      const askRenderCallback = this.messageQueue.shift()!;
      setTimeout(() => {
        const workerItem = this.grabWorkerItem();
        askRenderCallback(workerItem.getWorker());
      }, 100); // slow down callback for blinking effect of worker status (demo effect ;))
    }
  }

}