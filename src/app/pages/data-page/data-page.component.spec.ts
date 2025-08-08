import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataPageComponent } from './data-page.component';
import { DataService } from '../../core/services/data.service';
import { StateService } from '../../core/services/state.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Student } from '../../core/services/data.service';

describe('DataPageComponent', () => {
  let component: DataPageComponent;
  let fixture: ComponentFixture<DataPageComponent>;
  let dataService: jasmine.SpyObj<DataService>;
  let stateService: jasmine.SpyObj<StateService>;
  let dialog: jasmine.SpyObj<MatDialog>;

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
    }
  ];

  beforeEach(async () => {
    const dataServiceSpy = jasmine.createSpyObj('DataService', [
      'getStudents', 
      'getStudentById', 
      'addStudent', 
      'deleteStudent'
    ]);
    const stateServiceSpy = jasmine.createSpyObj('StateService', [
      'getPageState', 
      'setPageState'
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    // Setup default return values
    dataServiceSpy.getStudents.and.returnValue(of({ students: mockStudents, total: 1, page: 1, pageSize: 10 }));
    dataServiceSpy.getStudentById.and.returnValue(of(mockStudents[0]));
    stateServiceSpy.getPageState.and.returnValue({
      currentPage: 1,
      filterText: '',
      pageSize: 10
    });

    await TestBed.configureTestingModule({
      imports: [DataPageComponent],
      providers: [
        { provide: DataService, useValue: dataServiceSpy },
        { provide: StateService, useValue: stateServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DataPageComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    stateService = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load students on init', () => {
    // Arrange
    const mockResponse = { students: mockStudents, total: 1, page: 1, pageSize: 10 };
    dataService.getStudents.and.returnValue(of(mockResponse));
    stateService.getPageState.and.returnValue({
      currentPage: 1,
      filterText: '',
      pageSize: 10
    });

    // Act
    component.ngOnInit();

    // Assert
    expect(dataService.getStudents).toHaveBeenCalledWith(1, 10, '');
    expect(component.students()).toEqual(mockStudents);
    expect(component.totalStudents()).toBe(1);
  });

  it('should filter students when filter text changes', () => {
    // Arrange
    const mockResponse = { students: mockStudents, total: 1, page: 1, pageSize: 10 };
    dataService.getStudents.and.returnValue(of(mockResponse));
    component.filterValue = 'John';

    // Act
    component.onFilterChange();

    // Assert
    expect(component.filterText()).toBe('John');
    expect(component.currentPage()).toBe(1);
    expect(dataService.getStudents).toHaveBeenCalledWith(1, 10, 'John');
  });

  it('should select a student', () => {
    // Arrange
    const student = mockStudents[0];

    // Act
    component.onSelectStudent(student);

    // Assert
    expect(component.selectedStudent()).toBe(student);
    expect(stateService.setPageState).toHaveBeenCalled();
  });

  it('should unselect a student', () => {
    // Arrange
    component.selectedStudent.set(mockStudents[0]);

    // Act
    component.onUnselectStudent();

    // Assert
    expect(component.selectedStudent()).toBeNull();
    expect(stateService.setPageState).toHaveBeenCalled();
  });

  it('should calculate total pages correctly', () => {
    // Arrange
    component.totalStudents.set(25);
    component.pageSize.set(10);

    // Act
    const totalPages = component.totalPages;

    // Assert
    expect(totalPages).toBe(3);
  });

  it('should generate correct pagination info', () => {
    // Arrange
    component.totalStudents.set(25);
    component.currentPage.set(2);
    component.pageSize.set(10);

    // Act
    const paginationInfo = component.paginationInfo;

    // Assert
    expect(paginationInfo).toBe('Showing 11 to 20 of 25 results');
  });

  it('should load saved state on init', () => {
    // Arrange
    const savedState = {
      currentPage: 2,
      filterText: 'test',
      pageSize: 10,
      selectedStudentId: '100000001'
    };
    stateService.getPageState.and.returnValue(savedState);
    dataService.getStudentById.and.returnValue(of(mockStudents[0]));

    // Act
    component.ngOnInit();

    // Assert
    expect(component.currentPage()).toBe(2);
    expect(component.filterText()).toBe('test');
    expect(component.filterValue).toBe('test');
    expect(component.pageSize()).toBe(10);
  });
});
