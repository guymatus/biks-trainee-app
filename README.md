# Biks Trainee Management Application

A comprehensive Angular-based trainee management system with data visualization, analysis, and monitoring capabilities.

## Features

### 📊 Data Management
- **Student Records**: Manage trainee information with 9-digit IDs
- **Data Table**: Paginated view with search and filtering capabilities
- **Add/Remove Students**: Dynamic student management with form validation
- **Student Details**: Detailed view with comprehensive trainee information
- **State Persistence**: All filters, selections, and pagination states are saved

### 📈 Analysis Dashboard
- **Interactive Charts**: Three different chart types for data visualization
- **Drag & Drop Interface**: Reorganize charts by dragging between panels
- **Multi-select Filters**: Filter by student IDs and subjects
- **Real-time Updates**: Charts update dynamically based on filter selections
- **Responsive Design**: Adapts to different screen sizes

### 📋 Monitor Page
- **Performance Tracking**: Average grade calculations per student
- **Pass/Fail Status**: Automatic classification (≥65 = Passed, <65 = Failed)
- **Advanced Filtering**: Filter by IDs, names, and status
- **Statistics Dashboard**: Overview of total, passed, and failed students
- **Color-coded Display**: Visual indicators for performance status

## Technical Stack

- **Framework**: Angular 17 (Standalone Components)
- **UI Library**: Angular Material
- **State Management**: Custom State Service with localStorage
- **Styling**: SCSS with responsive design
- **Data Format**: DD/MM/YYYY date format, 9-digit student IDs

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/biks-trainee-app.git
   cd biks-trainee-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

## Testing

### Unit Testing

The application includes comprehensive unit tests using Angular's testing framework with Jasmine and Karma.

#### Running Unit Tests

```bash
npm test
```

#### Running Tests with Coverage

```bash
npm run test:coverage
```

#### Example Test Files

- `src/app/pages/data-page/data-page.component.spec.ts` - Data page component tests (8 test cases)
- `src/app/pages/monitor-page/monitor-page.component.spec.ts` - Monitor page component tests (10 test cases)
- `src/app/shared/components/add-student-dialog/add-student-dialog.component.spec.ts` - Dialog component tests (12 test cases)
- `src/app/core/services/data.service.spec.ts` - Data service tests (8 test cases)
- `src/app/core/services/state.service.spec.ts` - State management tests (12 test cases)
- `src/app/app.component.spec.ts` - Main app component tests (2 test cases)

**Total: 52+ comprehensive test cases**

#### Test Coverage Areas

- **Component Testing**: All Angular components have unit tests
- **Service Testing**: Mock data service and state persistence service
- **Filter Logic**: Data filtering and pagination functionality
- **State Management**: Local storage operations and state restoration
- **User Interactions**: Button clicks, form submissions, and navigation

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       ├── data.service.ts      # Mock data and CRUD operations
│   │       └── state.service.ts     # State persistence management
│   ├── pages/
│   │   ├── data-page/               # Student data management
│   │   ├── analysis-page/           # Charts and data visualization
│   │   └── monitor-page/            # Performance monitoring
│   └── shared/
│       └── components/
│           └── add-student-dialog/  # Student creation dialog
```

## Key Features Implementation

### State Persistence
- All page states (filters, selections, pagination) are automatically saved
- States are restored when returning to pages without refresh
- Uses localStorage for client-side persistence

### Data Format Standards
- **Student IDs**: 9-digit format (100000XXX)
- **Dates**: DD/MM/YYYY format
- **Grades**: Numeric values with pass/fail threshold at 65

### Responsive Design
- Mobile-friendly layouts
- Adaptive chart positioning
- Flexible grid systems

## Development Notes

- **Mock Data**: Currently uses 28 sample students with realistic data
- **Alphabetical Sorting**: Students sorted by first name, then last name
- **Auto-generated IDs**: New students receive sequential 9-digit IDs
- **Empty Filter Logic**: Empty filters show all data (no restrictions)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please contact the development team or create an issue in the repository.
