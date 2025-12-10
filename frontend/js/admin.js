// ===================================
// Admin Dashboard JavaScript
// ===================================

// Admin uses the API_BASE_URL from main.js
let allBookings = [];

// ===================================
// Load Bookings on Page Load
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  loadBookings();
  setupFilters();
});

// ===================================
// Check API and Database Connection
// ===================================
async function checkConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    
    if (data.status === 'OK') {
      updateStatus('apiStatus', '✅ Connected', 'success');
      updateStatus('dbStatus', '✅ MongoDB Connected', 'success');
      return true;
    }
  } catch (error) {
    updateStatus('apiStatus', '❌ Disconnected', 'error');
    updateStatus('dbStatus', '❌ Not Connected', 'error');
    return false;
  }
}

function updateStatus(elementId, text, status) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = text;
    element.className = `status-value status-${status}`;
  }
}

// ===================================
// Load All Bookings
// ===================================
async function loadBookings() {
  const loadingMessage = document.getElementById('loadingMessage');
  const errorMessage = document.getElementById('errorMessage');
  const bookingsContainer = document.getElementById('bookingsContainer');
  
  // Show loading
  loadingMessage.style.display = 'flex';
  errorMessage.style.display = 'none';
  bookingsContainer.style.display = 'none';

  try {
    // Check connection first
    const isConnected = await checkConnection();
    
    if (!isConnected) {
      throw new Error('Cannot connect to API server');
    }

    // Fetch bookings
    const response = await fetch(`${API_BASE_URL}/bookings`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      allBookings = result.data;
      
      // Update statistics
      updateStatistics(allBookings);
      
      // Display bookings
      displayBookings(allBookings);
      
      // Update last updated time
      document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
      
      // Hide loading, show table
      loadingMessage.style.display = 'none';
      bookingsContainer.style.display = 'block';
      
      if (allBookings.length === 0) {
        document.getElementById('noBookings').style.display = 'block';
        document.querySelector('.table-responsive').style.display = 'none';
      } else {
        document.getElementById('noBookings').style.display = 'none';
        document.querySelector('.table-responsive').style.display = 'block';
      }
    } else {
      throw new Error(result.message || 'Failed to load bookings');
    }
    
  } catch (error) {
    console.error('Error loading bookings:', error);
    
    // Show error message
    loadingMessage.style.display = 'none';
    errorMessage.style.display = 'flex';
    document.getElementById('errorText').textContent = error.message;
    
    updateStatus('apiStatus', '❌ Error', 'error');
    updateStatus('dbStatus', '❌ Error', 'error');
  }
}

// ===================================
// Update Statistics
// ===================================
function updateStatistics(bookings) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Total bookings
  document.getElementById('totalBookings').textContent = bookings.length;
  
  // Today's bookings
  const todayBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.createdAt);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate.getTime() === today.getTime();
  });
  document.getElementById('todayBookings').textContent = todayBookings.length;
  
  // Total visitors
  const totalVisitors = bookings.reduce((sum, booking) => sum + booking.numberOfVisitors, 0);
  document.getElementById('totalVisitors').textContent = totalVisitors;
  
  // Guided tours
  const guidedTours = bookings.filter(b => b.tourType === 'guided').length;
  document.getElementById('guidedTours').textContent = guidedTours;
  
  // Self-guided tours
  const selfGuidedTours = bookings.filter(b => b.tourType === 'self-guided').length;
  document.getElementById('selfGuidedTours').textContent = selfGuidedTours;
}

// ===================================
// Display Bookings in Table
// ===================================
function displayBookings(bookings) {
  const tbody = document.getElementById('bookingsTableBody');
  tbody.innerHTML = '';
  
  if (bookings.length === 0) {
    return;
  }
  
  bookings.forEach((booking, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><strong>${escapeHtml(booking.visitorName)}</strong></td>
      <td>${escapeHtml(booking.email)}</td>
      <td>${escapeHtml(booking.phone)}</td>
      <td>${formatDate(booking.visitDate)}</td>
      <td><span class="badge">${booking.numberOfVisitors}</span></td>
      <td><span class="badge badge-${booking.tourType}">${formatTourType(booking.tourType)}</span></td>
      <td>${booking.specialRequests ? escapeHtml(booking.specialRequests.substring(0, 30)) + '...' : '-'}</td>
      <td>${formatDateTime(booking.createdAt)}</td>
      <td>
        <button class="btn-icon" onclick="viewBooking('${booking._id}')" title="View Details">
          👁️
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ===================================
// Setup Filters
// ===================================
function setupFilters() {
  const tourTypeFilter = document.getElementById('tourTypeFilter');
  const dateFilter = document.getElementById('dateFilter');
  
  tourTypeFilter.addEventListener('change', applyFilters);
  dateFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
  const tourType = document.getElementById('tourTypeFilter').value;
  const dateValue = document.getElementById('dateFilter').value;
  
  let filtered = [...allBookings];
  
  // Filter by tour type
  if (tourType !== 'all') {
    filtered = filtered.filter(b => b.tourType === tourType);
  }
  
  // Filter by date
  if (dateValue) {
    const filterDate = new Date(dateValue);
    filtered = filtered.filter(b => {
      const visitDate = new Date(b.visitDate);
      return visitDate.toDateString() === filterDate.toDateString();
    });
  }
  
  displayBookings(filtered);
}

// ===================================
// View Booking Details
// ===================================
function viewBooking(bookingId) {
  const booking = allBookings.find(b => b._id === bookingId);
  
  if (!booking) return;
  
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = `
    <div class="booking-detail">
      <div class="detail-row">
        <span class="detail-label">Booking ID:</span>
        <span class="detail-value"><code>${booking._id}</code></span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Visitor Name:</span>
        <span class="detail-value"><strong>${escapeHtml(booking.visitorName)}</strong></span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email:</span>
        <span class="detail-value">${escapeHtml(booking.email)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Phone:</span>
        <span class="detail-value">${escapeHtml(booking.phone)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Visit Date:</span>
        <span class="detail-value">${formatDate(booking.visitDate)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Number of Visitors:</span>
        <span class="detail-value"><span class="badge">${booking.numberOfVisitors}</span></span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Tour Type:</span>
        <span class="detail-value"><span class="badge badge-${booking.tourType}">${formatTourType(booking.tourType)}</span></span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Special Requests:</span>
        <span class="detail-value">${booking.specialRequests ? escapeHtml(booking.specialRequests) : 'None'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Booked On:</span>
        <span class="detail-value">${formatDateTime(booking.createdAt)}</span>
      </div>
    </div>
  `;
  
  document.getElementById('bookingModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('bookingModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('bookingModal');
  if (event.target === modal) {
    closeModal();
  }
}

// ===================================
// Utility Functions
// ===================================
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatTourType(type) {
  return type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===================================
// Auto-refresh every 30 seconds
// ===================================
setInterval(() => {
  loadBookings();
}, 30000);
