import './content-script.scss';

class Selected {
  static get(): Selection | null {
    return window.getSelection();
  }

  static text(): string {
    return Selected.get()?.toString().trim() || '';
  }

  static rect(): DOMRect | null {
    const get = Selected.get();
    if (!get?.rangeCount) return null;
    return get.getRangeAt(0).getBoundingClientRect();
  }
}

class Tooltip {
  public element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.id = 'est'; // everything-search-tooltip
    document.body.appendChild(this.element);
  }

  show(position: { top: number; left: number }, offset: { top: number; left: number } = { top: 0, left: 0 }) {
    Object.assign(this.element.style, {
      display: 'block',
      top: `${window.scrollY + position.top + offset.top}px`,
      left: `${window.scrollX + position.left + offset.left}px`,
    });
  }

  hide() {
    this.element.style.display = 'none';
  }
}

type State = 'Idle' | 'TextSelected' | 'TextSearching';

class StateMachine {
  private currentState: State = 'Idle';

  constructor(private tooltip: Tooltip) {
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('selectionchange', this.handleSelectionChange.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    document.addEventListener('click', this.handleClick.bind(this));
  }

  private transition(newState: State) {
    this.currentState = newState;
  }

  private handleMouseDown(event: MouseEvent) {
    if (this.currentState === 'TextSelected' && event.target === this.tooltip.element) {
      this.transition('TextSearching');
      event.preventDefault();
    } else {
      this.transition('Idle');
    }
  }

  private handleSelectionChange(event: Event) {
    if (this.currentState !== 'TextSearching') {
      this.tooltip.hide();
    }
  }

  private handleMouseUp(event: MouseEvent) {
    if (this.currentState === 'Idle' && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
      const text = Selected.text();
      const rect = Selected.rect();
      if (text.length > 0 && rect) {
        this.tooltip.show({ top: rect.top + rect.height / 2, left: rect.right + 50 });
        this.transition('TextSelected');
      }
    }
  }

  private handleClick(event: MouseEvent) {
    if (this.currentState === 'TextSearching' && event.target === this.tooltip.element) {
      chrome.runtime.sendMessage({
        action: 'processQuery',
        query: Selected.text(),
      });
    }
  }
}

new StateMachine(new Tooltip());
