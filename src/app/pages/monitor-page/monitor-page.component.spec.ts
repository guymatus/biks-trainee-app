import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonitorPageComponent } from './monitor-page.component';
import { DataService } from '../../core/services/data.service';
import { StateService } from '../../core/services/state.service';
import { of } from 'rxjs';
import { Student } from '../../core/services/data.service';

describe('MonitorPageComponent', () => {
  let component: MonitorPageComponent;
  let fixture: ComponentFixture<MonitorPageComponent>;
  let dataService: jasmine.SpyObj<DataService>;
  let stateService: jasmine.SpyObj<StateService>;

  const mockStudents: Student[] = [
    {
      id: '100000001',
      name: 'John Doe',
      date: '15/03/2024',
      grade: 85,
      subject: 'Mathematics',
      email: 'john.doe@example.com',
      dateJoined: '01/01/2024',
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      zip: '10001'
    },
    {
      id: '100000001',
      name: 'John Doe',
      date: '20/03/2024',
      grade: 90,
      subject: 'Physics',
      email: 'john.doe@example.com',
      dateJoined: '01/01/2024',
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      zip: '10001'
    },
    {
      id: '100000002',
      name: 'Jane Smith',
      date: '18/03/2024',
      grade: 60,
      subject: 'Chemistry',
      email: 'jane.smith@example.com',
      dateJoined: '02/01/2024',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      country: 'USA',
      zip: '90210'
    }
  ];

  beforeEach(async () => {
    const dataServiceSpy = jasmine.createSpyObj('DataService', ['getAllStudents']);
    const stateServiceSpy = jasmine.createSpyObj('StateService', [
      'getMonitorState',
      'setMonitorState'
    ]);

    dataServiceSpy.getAllStudents.and.returnValue(of(mockStudents));
    stateServiceSpy.getMonitorState.and.returnValue({
      selectedIds: [],
      nameFilter: '',
      showPassed: true,
      showFailed: true
    });

    await TestBed.configureTestingModule({
      imports: [MonitorPageComponent],
      providers: [
        { provide: DataService, useValue: dataServiceSpy },
        { provide: StateService, useValue: stateServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MonitorPageComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    stateService = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on init', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(dataService.getAllStudents).toHaveBeenCalled();
    expect(component.studentMonitors.length).toBeGreaterThan(0);
  });

  it('should calculate average grades correctly', () => {
    // Arrange
    component.students = mockStudents;

    // Act
    component.processStudentData();

    // Assert
    const johnMonitor = component.studentMonitors.find(s => s.id === '100000001');
    expect(johnMonitor).toBeDefined();
    expect(johnMonitor?.average).toBe(87.5); // (85 + 90) / 2
    expect(johnMonitor?.status).toBe('Passed');
  });

  it('should mark students as failed when average < 65', () => {
    // Arrange
    component.students = mockStudents;

    // Act
    component.processStudentData();

    // Assert
    const janeMonitor = component.studentMonitors.find(s => s.id === '100000002');
    expect(janeMonitor).toBeDefined();
    expect(janeMonitor?.average).toBe(60);
    expect(janeMonitor?.status).toBe('Failed');
  });

  it('should filter by ID correctly', () => {
    // Arrange
    component.students = mockStudents;
    component.processStudentData();
    component.selectedIds = ['100000001'];

    // Act
    component.applyFilters();

    // Assert
    expect(component.filteredStudents.length).toBe(1);
    expect(component.filteredStudents[0].id).toBe('100000001');
  });

  it('should filter by name correctly', () => {
    // Arrange
    component.students = mockStudents;
    component.processStudentData();
    component.nameFilter = 'John';

    // Act
    component.applyFilters();

    // Assert
    expect(component.filteredStudents.length).toBe(1);
    expect(component.filteredStudents[0].name).toContain('John');
  });

  it('should filter by status correctly', () => {
    // Arrange
    component.students = mockStudents;
    component.processStudentData();
    component.showPassed = false;
    component.showFailed = true;

    // Act
    component.applyFilters();

    // Assert
    expect(component.filteredStudents.length).toBe(1);
    expect(component.filteredStudents[0].status).toBe('Failed');
  });

  it('should return correct status class', () => {
    // Act & Assert
    expect(component.getStatusClass('Passed')).toBe('status-passed');
    expect(component.getStatusClass('Failed')).toBe('status-failed');
  });

  it('should calculate statistics correctly', () => {
    // Arrange
    component.students = mockStudents;
    component.processStudentData();

    // Act & Assert
    expect(component.getTotalCount()).toBe(2); // 2 unique students
    expect(component.getPassedCount()).toBe(1); // John passed
    expect(component.getFailedCount()).toBe(1); // Jane failed
  });

  it('should save state when filters change', () => {
    // Arrange
    component.students = mockStudents;
    component.processStudentData();

    // Act
    component.onIdSelectionChange();

    // Assert
    expect(stateService.setMonitorState).toHaveBeenCalled();
  });

  it('should load saved state on init', () => {
    // Arrange
    const savedState = {
      selectedIds: ['100000001'],
      nameFilter: 'John',
      showPassed: true,
      showFailed: false,
      currentPage: 1,
      pageSize: 10
    };
    stateService.getMonitorState.and.returnValue(savedState);

    // Act
    component.ngOnInit();

    // Assert
    expect(component.selectedIds).toEqual(savedState.selectedIds);
    expect(component.nameFilter).toBe(savedState.nameFilter);
    expect(component.showPassed).toBe(savedState.showPassed);
    expect(component.showFailed).toBe(savedState.showFailed);
  });
});
