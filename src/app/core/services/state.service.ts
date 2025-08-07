import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PageState {
  [key: string]: any;
}

export interface AnalysisPageState {
  selectedStudentIds: string[];
  selectedSubjects: string[];
  chartPositions: { [key: string]: string };
}

export interface MonitorPageState {
  selectedIds: string[];
  nameFilter: string;
  showPassed: boolean;
  showFailed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private stateSubject = new BehaviorSubject<PageState>({});
  private state: PageState = {};

  constructor() {
    this.loadStateFromStorage();
  }

  // Get state for a specific page
  getPageState<T>(pageName: string, defaultValue: T): T {
    return this.state[pageName] || defaultValue;
  }

  // Set state for a specific page
  setPageState<T>(pageName: string, state: T): void {
    this.state[pageName] = state;
    this.saveStateToStorage();
    this.stateSubject.next(this.state);
  }

  // Update partial state for a specific page
  updatePageState<T>(pageName: string, partialState: Partial<T>): void {
    const currentState = this.getPageState(pageName, {});
    const updatedState = { ...currentState, ...partialState };
    this.setPageState(pageName, updatedState);
  }

  // Clear state for a specific page
  clearPageState(pageName: string): void {
    delete this.state[pageName];
    this.saveStateToStorage();
    this.stateSubject.next(this.state);
  }

  // Clear all states
  clearAllStates(): void {
    this.state = {};
    this.saveStateToStorage();
    this.stateSubject.next(this.state);
  }

  // Get state as observable
  getStateObservable(): Observable<PageState> {
    return this.stateSubject.asObservable();
  }

  // Save state to localStorage
  private saveStateToStorage(): void {
    try {
      localStorage.setItem('app_state', JSON.stringify(this.state));
    } catch (error) {
      console.warn('Failed to save state to localStorage:', error);
    }
  }

  // Load state from localStorage
  private loadStateFromStorage(): void {
    try {
      const savedState = localStorage.getItem('app_state');
      if (savedState) {
        this.state = JSON.parse(savedState);
        this.stateSubject.next(this.state);
      }
    } catch (error) {
      console.warn('Failed to load state from localStorage:', error);
      this.state = {};
    }
  }

  // Helper methods for specific pages
  getAnalysisState(): AnalysisPageState {
    return this.getPageState<AnalysisPageState>('analysis', {
      selectedStudentIds: [],
      selectedSubjects: [],
      chartPositions: {
        chart1: 'left',
        chart2: 'bottom',
        chart3: 'right'
      }
    });
  }

  setAnalysisState(state: AnalysisPageState): void {
    this.setPageState('analysis', state);
  }

  getMonitorState(): MonitorPageState {
    return this.getPageState<MonitorPageState>('monitor', {
      selectedIds: [],
      nameFilter: '',
      showPassed: true,
      showFailed: true
    });
  }

  setMonitorState(state: MonitorPageState): void {
    this.setPageState('monitor', state);
  }
} 