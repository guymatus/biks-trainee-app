import { TestBed } from '@angular/core/testing';
import { StateService } from './state.service';

describe('StateService', () => {
  let service: StateService;
  let mockLocalStorage: { [key: string]: string } = {};

  beforeEach(() => {
    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return mockLocalStorage[key] || null;
    });
    
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });
    
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete mockLocalStorage[key];
    });
    
    spyOn(localStorage, 'clear').and.callFake(() => {
      mockLocalStorage = {};
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(StateService);
  });

  afterEach(() => {
    mockLocalStorage = {};
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save and retrieve page state', () => {
    // Arrange
    const pageName = 'test-page';
    const testState = {
      currentPage: 2,
      filterText: 'test filter',
      selectedId: '100000001'
    };

    // Act
    service.setPageState(pageName, testState);
    const retrievedState = service.getPageState(pageName, {});

    // Assert
    expect(retrievedState).toEqual(testState);
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(localStorage.getItem).toHaveBeenCalled();
  });

  it('should return default state when no saved state exists', () => {
    // Arrange
    const pageName = 'new-page';
    const defaultState = { currentPage: 1, filterText: '' };

    // Act
    const retrievedState = service.getPageState(pageName, defaultState);

    // Assert
    expect(retrievedState).toEqual(defaultState);
  });

  it('should update existing page state', () => {
    // Arrange
    const pageName = 'test-page';
    const initialState = { currentPage: 1, filterText: '' };
    const updatedState = { currentPage: 3, filterText: 'updated' };

    // Act
    service.setPageState(pageName, initialState);
    service.updatePageState(pageName, updatedState);
    const retrievedState = service.getPageState(pageName, {});

    // Assert
    expect(retrievedState).toEqual(updatedState);
  });

  it('should clear specific page state', () => {
    // Arrange
    const pageName = 'test-page';
    const testState = { currentPage: 1, filterText: 'test' };

    // Act
    service.setPageState(pageName, testState);
    service.clearPageState(pageName);
    const retrievedState = service.getPageState(pageName, {});

    // Assert
    expect(retrievedState).toEqual({});
  });

  it('should clear all states', () => {
    // Arrange
    const page1 = 'page1';
    const page2 = 'page2';
    const state1 = { data: 'test1' };
    const state2 = { data: 'test2' };

    // Act
    service.setPageState(page1, state1);
    service.setPageState(page2, state2);
    service.clearAllStates();

    const retrievedState1 = service.getPageState(page1, {});
    const retrievedState2 = service.getPageState(page2, {});

    // Assert
    expect(retrievedState1).toEqual({});
    expect(retrievedState2).toEqual({});
    expect(localStorage.clear).toHaveBeenCalled();
  });

  it('should handle analysis page state correctly', () => {
    // Arrange
    const analysisState = {
      selectedStudentIds: ['100000001', '100000002'],
      selectedSubjects: ['Mathematics', 'Physics'],
      chartPositions: { chart1: 'left', chart2: 'right', chart3: 'bottom' }
    };

    // Act
    service.setAnalysisState(analysisState);
    const retrievedState = service.getAnalysisState();

    // Assert
    expect(retrievedState).toEqual(analysisState);
  });

  it('should handle monitor page state correctly', () => {
    // Arrange
    const monitorState = {
      selectedIds: ['100000001'],
      nameFilter: 'John',
      showPassed: true,
      showFailed: false
    };

    // Act
    service.setMonitorState(monitorState);
    const retrievedState = service.getMonitorState();

    // Assert
    expect(retrievedState).toEqual(monitorState);
  });

  it('should return default analysis state when none exists', () => {
    // Act
    const state = service.getAnalysisState();

    // Assert
    expect(state.selectedStudentIds).toEqual([]);
    expect(state.selectedSubjects).toEqual([]);
    expect(state.chartPositions).toBeDefined();
  });

  it('should return default monitor state when none exists', () => {
    // Act
    const state = service.getMonitorState();

    // Assert
    expect(state.selectedIds).toEqual([]);
    expect(state.nameFilter).toBe('');
    expect(state.showPassed).toBe(true);
    expect(state.showFailed).toBe(true);
  });

  it('should handle JSON parsing errors gracefully', () => {
    // Arrange
    mockLocalStorage['app_state'] = 'invalid json';

    // Act
    const state = service.getPageState('test-page', { default: 'value' });

    // Assert
    expect(state).toEqual({ default: 'value' });
  });

  it('should handle localStorage errors gracefully', () => {
    // Arrange
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = jasmine.createSpy('setItem').and.throwError('Storage quota exceeded');

    // Act & Assert
    expect(() => {
      service.setPageState('test-page', { data: 'test' });
    }).not.toThrow();

    // Restore original function
    localStorage.setItem = originalSetItem;
  });
});
