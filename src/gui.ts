import { WorkerItem, WorkerStatus } from "./worker-queue";

export class Gui {

  public onCanvasSizeChange!: (size: number) => void;
  public onWorkersNumberChange!: (size: number) => void;
  public onSingleWorkerSizeChange!: (size: number) => void;
  public onSamplesPerPixelChange!: (value: number) => void;
  public onMaxDepthChange!: (value: number) => void;
  public onRender!: () => void;

  constructor(defaultWorkerSize: number) {
    this.renderWorkersTable(defaultWorkerSize);

    this.connectSlider('sizeOfCanvasSlider', (value: number) => this.onCanvasSizeChange(value));

    this.connectSlider('numberOfWorkersSlider', (value: number) => {
      this.renderWorkersTable(value);
      this.onWorkersNumberChange(value);
    });

    this.connectSlider('sizeOfSingleWorkerSlider', (value: number) => {
      this.onSingleWorkerSizeChange(value);
      const renderCanvas = document.querySelector<HTMLCanvasElement>('#renderCanvas')!;
      renderCanvas.style.backgroundSize = `${value}px ${value}px`;
    });

    this.connectSlider('samplesPerPixelSlider', (value: number) => this.onSamplesPerPixelChange(value));

    this.connectSlider('maxDepthSlider', (value: number) => this.onMaxDepthChange(value));


    const renderButton = document.querySelector<HTMLInputElement>('#renderButton')!;
    renderButton.addEventListener('click', (event: MouseEvent) => {
      this.onRender();
    });
  }

  private connectSlider(selector: string, callback: (value: number) => void): void {
    const slider = document.querySelector<HTMLInputElement>(`#${selector}`)!;
    slider.addEventListener('input', (event: Event) => {
      const value = +(event.target as HTMLInputElement).value;
      callback(value);
    });
  }

  private renderWorkersTable(numberOfWorkers: number): void {
    const workersTable = document.querySelector<HTMLTableElement>('#workersTable')!;
    workersTable.innerHTML = '';
    // Generate header
    const thead = workersTable.createTHead();
    let row = thead.insertRow();
    for (let i = 0; i <= numberOfWorkers; i++) {
      const th = document.createElement(i == 0 ? 'td' : 'th');
      const text = document.createTextNode(i == 0 ? '' : `Worker ${i}`);
      th.appendChild(text);
      row.appendChild(th);
    }
    // Generate status row
    row = workersTable.insertRow();
    for (let j = 0; j <= numberOfWorkers; j++) {
      let cell, text;
      if (j == 0) {
        cell = document.createElement('th');
        text = document.createTextNode('Status');
      } else {
        cell = row.insertCell();
        cell.setAttribute('class', `worker-${j}-status`);
        text = document.createTextNode(WorkerStatus.AVAILABLE);
      }
      cell.appendChild(text);
      row.appendChild(cell);
    }
  }

  private statusChanged(index: number, status: WorkerStatus): void {
    const currentStatusCell = document.querySelector<HTMLTableCellElement>(`.worker-${index + 1}-status`)!
    currentStatusCell.innerHTML = status;
  }

  public changed(workedItem: WorkerItem): void {
    this.statusChanged(workedItem.getIndex(), workedItem.getStatus());
  }

}