import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { APP_CONSTANTS } from '../constants/app.constants';
import { UtilsService } from './utils.service';

export interface Student {
  id: string;
  name: string;
  date: string;
  grade: number;
  subject: string;
  email?: string;
  dateJoined?: string;
  address?: string;
  city?: string;
  country?: string;
  zip?: string;
}

export interface DataResponse {
  students: Student[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Mock data for trainee test results (ordered alphabetically by first name, then last name)
  private mockStudents: Student[] = [
    {
      id: '100000020',
      name: 'Andrew Young',
      date: '04/02/2024',
      grade: 85,
      subject: 'Film Studies',
      email: 'andrew.young@email.com',
      dateJoined: '20/09/2023',
      address: '258 Poplar Way',
      city: 'Washington',
      country: 'USA',
      zip: '20001'
    },
    {
      id: '100000002',
      name: 'Alex Johnson',
      date: '16/01/2024',
      grade: 85,
      subject: 'Physics',
      email: 'alex.johnson@email.com',
      dateJoined: '02/09/2023',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      country: 'USA',
      zip: '90210'
    },
    {
      id: '100000011',
      name: 'Amanda Taylor',
      date: '25/01/2024',
      grade: 87,
      subject: 'Literature',
      email: 'amanda.taylor@email.com',
      dateJoined: '11/09/2023',
      address: '852 Ash St',
      city: 'Austin',
      country: 'USA',
      zip: '73301'
    },
    {
      id: '100000024',
      name: 'Brandon Baker',
      date: '08/02/2024',
      grade: 83,
      subject: 'Astronomy',
      email: 'brandon.baker@email.com',
      dateJoined: '24/09/2023',
      address: '963 Maple Street',
      city: 'Portland',
      country: 'USA',
      zip: '97201'
    },
    {
      id: '100000012',
      name: 'Christopher Lee',
      date: '26/01/2024',
      grade: 93,
      subject: 'Economics',
      email: 'christopher.lee@email.com',
      dateJoined: '12/09/2023',
      address: '963 Oak Ridge',
      city: 'Jacksonville',
      country: 'USA',
      zip: '32201'
    },
    {
      id: '100000006',
      name: 'David Miller',
      date: '20/01/2024',
      grade: 88,
      subject: 'Statistics',
      email: 'david.miller@email.com',
      dateJoined: '06/09/2023',
      address: '987 Cedar Ln',
      city: 'Philadelphia',
      country: 'USA',
      zip: '19101'
    },
    {
      id: '100000014',
      name: 'Daniel Thompson',
      date: '28/01/2024',
      grade: 91,
      subject: 'Sociology',
      email: 'daniel.thompson@email.com',
      dateJoined: '14/09/2023',
      address: '258 Cedar Heights',
      city: 'Columbus',
      country: 'USA',
      zip: '43201'
    },
    {
      id: '100000005',
      name: 'Emily Wilson',
      date: '19/01/2024',
      grade: 95,
      subject: 'Calculus',
      email: 'emily.wilson@email.com',
      dateJoined: '05/09/2023',
      address: '654 Maple Dr',
      city: 'Phoenix',
      country: 'USA',
      zip: '85001'
    },
    {
      id: '100000025',
      name: 'Hannah Adams',
      date: '09/02/2024',
      grade: 89,
      subject: 'Meteorology',
      email: 'hannah.adams@email.com',
      dateJoined: '25/09/2023',
      address: '147 Oak Drive',
      city: 'Oklahoma City',
      country: 'USA',
      zip: '73101'
    },
    {
      id: '100000008',
      name: 'James Rodriguez',
      date: '22/01/2024',
      grade: 24,
      subject: 'English',
      email: 'james.rodriguez@email.com',
      dateJoined: '08/09/2023',
      address: '258 Spruce Ct',
      city: 'San Diego',
      country: 'USA',
      zip: '92101'
    },
    {
      id: '100000009',
      name: 'Jennifer Martinez',
      date: '23/01/2024',
      grade: 89,
      subject: 'History',
      email: 'jennifer.martinez@email.com',
      dateJoined: '09/09/2023',
      address: '369 Willow Pl',
      city: 'Dallas',
      country: 'USA',
      zip: '75201'
    },
    {
      id: '100000013',
      name: 'Jessica White',
      date: '27/01/2024',
      grade: 86,
      subject: 'Psychology',
      email: 'jessica.white@email.com',
      dateJoined: '13/09/2023',
      address: '147 Pine Valley',
      city: 'Fort Worth',
      country: 'USA',
      zip: '76101'
    },
    {
      id: '100000028',
      name: 'Jonathan Mitchell',
      date: '12/02/2024',
      grade: 93,
      subject: 'Botany',
      email: 'jonathan.mitchell@email.com',
      dateJoined: '28/09/2023',
      address: '741 Elm Avenue',
      city: 'Kansas City',
      country: 'USA',
      zip: '64101'
    },
    {
      id: '100000016',
      name: 'Kevin Clark',
      date: '30/01/2024',
      grade: 84,
      subject: 'Political Science',
      email: 'kevin.clark@email.com',
      dateJoined: '16/09/2023',
      address: '741 Birch Lane',
      city: 'San Francisco',
      country: 'USA',
      zip: '94101'
    },
    {
      id: '100000023',
      name: 'Lauren Green',
      date: '07/02/2024',
      grade: 94,
      subject: 'Archaeology',
      email: 'lauren.green@email.com',
      dateJoined: '23/09/2023',
      address: '852 Cedar Road',
      city: 'Detroit',
      country: 'USA',
      zip: '48201'
    },
    {
      id: '100000007',
      name: 'Lisa Garcia',
      date: '21/01/2024',
      grade: 91,
      subject: 'Computer Science',
      email: 'lisa.garcia@email.com',
      dateJoined: '07/09/2023',
      address: '147 Birch Way',
      city: 'San Antonio',
      country: 'USA',
      zip: '78201'
    },
    {
      id: '100000004',
      name: 'Michael Brown',
      date: '18/01/2024',
      grade: 78,
      subject: 'Biology',
      email: 'michael.brown@email.com',
      dateJoined: '04/09/2023',
      address: '321 Elm St',
      city: 'Houston',
      country: 'USA',
      zip: '77001'
    },
    {
      id: '100000019',
      name: 'Michelle Hall',
      date: '03/02/2024',
      grade: 92,
      subject: 'Drama',
      email: 'michelle.hall@email.com',
      dateJoined: '19/09/2023',
      address: '147 Spruce Drive',
      city: 'Denver',
      country: 'USA',
      zip: '80201'
    },
    {
      id: '100000001',
      name: 'Morgan Smith',
      date: '15/01/2024',
      grade: 98,
      subject: 'Algebra',
      email: 'morgan.smith@email.com',
      dateJoined: '01/09/2023',
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
      zip: '10001'
    },
    {
      id: '100000015',
      name: 'Nicole Harris',
      date: '29/01/2024',
      grade: 89,
      subject: 'Philosophy',
      email: 'nicole.harris@email.com',
      dateJoined: '15/09/2023',
      address: '369 Maple Grove',
      city: 'Charlotte',
      country: 'USA',
      zip: '28201'
    },
    {
      id: '100000017',
      name: 'Rachel Lewis',
      date: '01/02/2024',
      grade: 96,
      subject: 'Art History',
      email: 'rachel.lewis@email.com',
      dateJoined: '17/09/2023',
      address: '852 Willow Creek',
      city: 'Indianapolis',
      country: 'USA',
      zip: '46201'
    },
    {
      id: '100000010',
      name: 'Robert Anderson',
      date: '24/01/2024',
      grade: 94,
      subject: 'Geography',
      email: 'robert.anderson@email.com',
      dateJoined: '10/09/2023',
      address: '741 Poplar Blvd',
      city: 'San Jose',
      country: 'USA',
      zip: '95101'
    },
    {
      id: '100000022',
      name: 'Ryan Wright',
      date: '06/02/2024',
      grade: 87,
      subject: 'Anthropology',
      email: 'ryan.wright@email.com',
      dateJoined: '22/09/2023',
      address: '741 Pine Street',
      city: 'Nashville',
      country: 'USA',
      zip: '37201'
    },
    {
      id: '100000003',
      name: 'Sarah Davis',
      date: '17/01/2024',
      grade: 92,
      subject: 'Chemistry',
      email: 'sarah.davis@email.com',
      dateJoined: '03/09/2023',
      address: '789 Pine Rd',
      city: 'Chicago',
      country: 'USA',
      zip: '60601'
    },
      {
      id: '100000003',
      name: 'Sarah Davis',
      date: '19/01/2024',
      grade: 92,
      subject: 'Chemistry',
      email: 'sarah.davis@email.com',
      dateJoined: '03/09/2023',
      address: '789 Pine Rd',
      city: 'Chicago',
      country: 'USA',
      zip: '60601'
    },
    {
      id: '100000027',
      name: 'Samantha Carter',
      date: '11/02/2024',
      grade: 86,
      subject: 'Geology',
      email: 'samantha.carter@email.com',
      dateJoined: '27/09/2023',
      address: '369 Willow Street',
      city: 'Cleveland',
      country: 'USA',
      zip: '44101'
    },
    {
      id: '100000021',
      name: 'Stephanie King',
      date: '05/02/2024',
      grade: 90,
      subject: 'Linguistics',
      email: 'stephanie.king@email.com',
      dateJoined: '21/09/2023',
      address: '369 Ash Avenue',
      city: 'Boston',
      country: 'USA',
      zip: '02101'
    },
    {
      id: '100000018',
      name: 'Steven Walker',
      date: '02/02/2024',
      grade: 88,
      subject: 'Music Theory',
      email: 'steven.walker@email.com',
      dateJoined: '18/09/2023',
      address: '963 Elm Court',
      city: 'Seattle',
      country: 'USA',
      zip: '98101'
    },
    {
      id: '100000026',
      name: 'Tyler Nelson',
      date: '10/02/2024',
      grade: 91,
      subject: 'Oceanography',
      email: 'tyler.nelson@email.com',
      dateJoined: '26/09/2023',
      address: '258 Birch Lane',
      city: 'Las Vegas',
      country: 'USA',
      zip: '89101'
    }
  ];

  constructor(
    private http: HttpClient,
    private utilsService: UtilsService
  ) {}

  getStudents(page: number = 1, pageSize: number = APP_CONSTANTS.DEFAULT_PAGE_SIZE, filter?: string): Observable<DataResponse> {
    let filteredStudents = [...this.mockStudents];

    // Apply filter if provided
    if (filter && filter.trim()) {
      filteredStudents = this.applyFilter(filteredStudents, filter);
    }

    // Sort students alphabetically by name
    filteredStudents.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    // Calculate pagination
    const total = filteredStudents.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

    // Simulate API delay
    return of({
      students: paginatedStudents,
      total,
      page,
      pageSize
    }).pipe(delay(300)); // Simulate network delay
  }

  private applyFilter(students: Student[], filter: string): Student[] {
    const filterLower = filter.toLowerCase();
    
    return students.filter(student => {
      // Check for specific filter patterns
      if (filterLower.startsWith('id:')) {
        const idFilter = filterLower.replace('id:', '').trim();
        return student.id.toLowerCase().includes(idFilter);
      }
      
      if (filterLower.includes('>')) {
        const parts = filterLower.split('>');
        if (parts.length === 2) {
          const field = parts[0].trim();
          const value = parts[1].trim();
          
          if (field === 'grade') {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              return student.grade > numValue;
            }
          }
          if (field === 'date') {
            // Handle DD/MM/YYYY format
            const studentDate = this.utilsService.parseDate(student.date);
            const filterDate = this.utilsService.parseDate(value);
            if (studentDate && filterDate) {
              return studentDate > filterDate;
            }
          }
        }
      }
      
      if (filterLower.includes('<')) {
        const parts = filterLower.split('<');
        if (parts.length === 2) {
          const field = parts[0].trim();
          const value = parts[1].trim();
          
          if (field === 'grade') {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              return student.grade < numValue;
            }
          }
          if (field === 'date') {
            // Handle DD/MM/YYYY format
            const studentDate = this.utilsService.parseDate(student.date);
            const filterDate = this.utilsService.parseDate(value);
            if (studentDate && filterDate) {
              return studentDate < filterDate;
            }
          }
        }
      }

      // Check for comma-separated names
      if (filterLower.includes(',')) {
        const names = filterLower.split(',').map(name => name.trim()).filter(name => name.length > 0);
        return names.some(name => student.name.toLowerCase().includes(name));
      }
      
      // General search across all fields
      return (
        student.id.toLowerCase().includes(filterLower) ||
        student.name.toLowerCase().includes(filterLower) ||
        student.subject.toLowerCase().includes(filterLower) ||
        student.email?.toLowerCase().includes(filterLower) ||
        student.city?.toLowerCase().includes(filterLower) ||
        student.country?.toLowerCase().includes(filterLower)
      );
    });
  }



  addStudent(student: Omit<Student, 'id'>): Observable<Student> {
    const newStudent: Student = {
      ...student,
      id: `100000${String(this.mockStudents.length + 1).padStart(3, '0')}`
    };
    
    this.mockStudents.push(newStudent);
    return of(newStudent).pipe(delay(300));
  }

  updateStudent(id: string, student: Partial<Student>): Observable<Student> {
    const index = this.mockStudents.findIndex(s => s.id === id);
    if (index !== -1) {
      this.mockStudents[index] = { ...this.mockStudents[index], ...student };
      return of(this.mockStudents[index]).pipe(delay(300));
    }
    throw new Error('Student not found');
  }

  deleteStudent(id: string): Observable<void> {
    const index = this.mockStudents.findIndex(s => s.id === id);
    if (index !== -1) {
      this.mockStudents.splice(index, 1);
      return of(void 0).pipe(delay(300));
    }
    throw new Error('Student not found');
  }

  getStudentById(id: string): Observable<Student> {
    const student = this.mockStudents.find(s => s.id === id);
    if (student) {
      return of(student).pipe(delay(300));
    }
    throw new Error('Student not found');
  }

  getAllStudents(): Observable<Student[]> {
    return of([...this.mockStudents]).pipe(delay(300));
  }
} 