// --- DOM Elements ---
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const calendarGrid = document.getElementById('calendar-grid');
const currentMonthYear = document.getElementById('current-month-year');

// --- State Variables ---
let currentDate = new Date();

// --- Sidebar Logic ---
function toggleMenu() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
}

menuBtn.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// --- Calendar Logic ---

function renderCalendar() {
    calendarGrid.innerHTML = "";
    
    // Set Header Text (e.g., "November 2025")
    currentMonthYear.innerText = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Total days in this month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 1. Fill empty slots for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day-cell');
        emptyCell.style.backgroundColor = "#f8f9fa"; // Slightly grey for empty
        calendarGrid.appendChild(emptyCell);
    }

    // 2. Fill actual days
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.classList.add('day-cell');
        
        // Generate a unique ID for storage: "2025-10-31"
        // We add 1 to month because JS months are 0-11
        const dateKey = `${year}-${month + 1}-${day}`;

        // Check if this is "Today"
        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            cell.classList.add('today-highlight');
        }

        // HTML for the day number
        let cellContent = `<div class="day-number">${day}</div>`;
        
        // Load events from LocalStorage
        const storedEvents = JSON.parse(localStorage.getItem(dateKey)) || [];
        storedEvents.forEach(evt => {
            // Determine color based on keyword
            let typeClass = '';
            if(evt.toLowerCase().includes('exam') || evt.toLowerCase().includes('test')) typeClass = 'exam';
            if(evt.toLowerCase().includes('hw') || evt.toLowerCase().includes('homework')) typeClass = 'homework';
            
            cellContent += `<div class="event ${typeClass}">${evt}</div>`;
        });

        cell.innerHTML = cellContent;

        // Click to Add Event
        cell.onclick = () => addEvent(dateKey);

        calendarGrid.appendChild(cell);
    }
}

// --- Event Logic ---
function addEvent(dateKey) {
    const task = prompt(`Add task for ${dateKey}:\n(Tip: use 'Exam' or 'HW' in name for colors)`);
    
    if (task) {
        // Get existing, push new, save back
        const events = JSON.parse(localStorage.getItem(dateKey)) || [];
        events.push(task);
        localStorage.setItem(dateKey, JSON.stringify(events));
        
        renderCalendar(); // Refresh view
    }
}

// --- Navigation Logic ---
function changeMonth(direction) {
    // direction: -1 (prev) or 1 (next)
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}

function goToToday() {
    currentDate = new Date();
    renderCalendar();
}

// Initialize
renderCalendar();
