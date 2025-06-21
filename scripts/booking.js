// Handle booking form submission
document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const email = document.getElementById("email").value.trim();
  const checkinValue = document.getElementById("checkin").value;
  const checkoutValue = document.getElementById("checkout").value;
  const guests = parseInt(document.getElementById("guests").value);
  const villa = document.getElementById("villa").value;
  const breakfast = document.getElementById("breakfast").value;

  if (!name || !mobile || !email || !checkinValue || !checkoutValue || !guests || !villa || !breakfast) {
    alert("Please fill in all fields before proceeding.");
    return;
  }

  const checkin = new Date(checkinValue);
  const checkout = new Date(checkoutValue);
  const days = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    alert("Check-out must be after Check-in.");
    return;
  }

  const blocked = isBlockedDateRange(checkin, checkout);
  if (blocked.length > 0) {
    alert(`Booking not allowed. Blocked date(s): ${blocked.join(", ")}`);
    return;
  }

  const selectedRooms = Array.from(document.querySelectorAll('input[name="rooms"]:checked'));
  let totalRoomCount = 0;
  selectedRooms.forEach((room) => {
    const dropdown = document.querySelector(`select[data-room="${room.value}"]`);
    totalRoomCount += parseInt(dropdown?.value || 0);
  });

  if (selectedRooms.length === 0 || totalRoomCount === 0) {
    alert("Please select at least one room and set the count.");
    return;
  }

  let totalPrice = 0;
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(checkin);
    currentDate.setDate(currentDate.getDate() + i);
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    totalPrice += (breakfast === "yes") ? 1200 : 1000;
  }
  totalPrice *= guests;

  const bookingData = {
    name,
    mobile,
    email,
    checkin: checkin.toISOString().split("T")[0],
    checkout: checkout.toISOString().split("T")[0],
    guests,
    villa,
    breakfast,
    days,
    totalPrice,
    selectedRooms: selectedRooms.map(r => r.value),
  };

  localStorage.setItem("bookingData", JSON.stringify(bookingData));
  selectedRooms.forEach((room) => {
  const dropdown = document.querySelector(`select[data-room="${room.value}"]`);
  localStorage.setItem(`roomCount-${room.value}`, dropdown.value);
});

  window.location.href = "confirmation.html";
});

// Update room options based on villa
function updateRoomOptions() {
  const villa = document.getElementById("villa").value;
  const roomOptions = document.getElementById("room-options");

  let html = '<label><strong>Select Rooms:</strong></label>';

  const roomRow = (value, label, countName, maxCount) => {
    let options = '';
    for (let i = 0; i <= maxCount; i++) {
      options += `<option value="${i}">${i}</option>`;
    }

    return `
      <div class="room-select-row">
        <div class="room-label-group">
          <input type="checkbox" name="rooms" value="${value}" onchange="toggleRoomCount(this)">
          <label for="${value}">${label}</label>
        </div>
        <select name="${countName}" class="room-count" data-room="${value}" disabled>
          ${options}
        </select>
      </div>
    `;
  };

  if (villa === "Villa 1") {
    html += roomRow("GF-2BHK", "Ground Floor – 2BHK", "count_GF_2BHK", 2);
    html += roomRow("FF-1BHK", "First Floor – 1BHK", "count_FF_1BHK", 1);
  } else if (villa === "Villa 2") {
    html += roomRow("GF-3BHK", "Ground Floor – 3BHK", "count_GF_3BHK", 3);
    html += roomRow("FF-3BHK", "First Floor – 3BHK", "count_FF_3BHK", 3);
  } else if (villa === "Full Property") {
    html += roomRow("Villa1-GF", "Villa 1 – Ground Floor (2BHK)", "count_V1_GF", 2);
    html += roomRow("Villa1-FF", "Villa 1 – First Floor (1BHK)", "count_V1_FF", 1);
    html += roomRow("Villa2-GF", "Villa 2 – Ground Floor (3BHK)", "count_V2_GF", 3);
    html += roomRow("Villa2-FF", "Villa 2 – First Floor (3BHK)", "count_V2_FF", 3);
  } else {
    roomOptions.style.display = "none";
    return;
  }

  roomOptions.innerHTML = html;
  roomOptions.style.display = "block";
}

function toggleRoomCount(checkbox) {
  const select = document.querySelector(`select[data-room="${checkbox.value}"]`);
  if (checkbox.checked) {
    select.disabled = false;
  } else {
    select.disabled = true;
    select.value = "0";
  }
}

// Calculate price
function calculatePrice() {
  const name = document.getElementById("name").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const email = document.getElementById("email").value.trim();
  const checkinValue = document.getElementById("checkin").value;
  const checkoutValue = document.getElementById("checkout").value;
  const guests = parseInt(document.getElementById("guests").value);
  const villa = document.getElementById("villa").value;
  const breakfast = document.getElementById("breakfast").value;

  if (!name || !mobile || !email || !checkinValue || !checkoutValue || !guests || !villa || !breakfast) {
    alert("Please fill in all required fields before checking the price.");
    return;
  }

  const checkin = new Date(checkinValue);
  const checkout = new Date(checkoutValue);
  const days = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    alert("Check-out must be after Check-in.");
    return;
  }

  const blocked = isBlockedDateRange(checkin, checkout);
  if (blocked.length > 0) {
    alert(`Booking not allowed. Blocked date(s): ${blocked.join(", ")}`);
    return;
  }

  const selectedRooms = Array.from(document.querySelectorAll('input[name="rooms"]:checked'));
  if (selectedRooms.length === 0) {
    alert("Please select at least one room.");
    return;
  }

  let totalPrice = 0;
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(checkin);
    currentDate.setDate(currentDate.getDate() + i);
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    totalPrice += (breakfast === "yes") ? 1200 : 1000;
  }

  totalPrice *= guests;
  const advance = Math.round(totalPrice * 0.2);
  const remaining = totalPrice - advance;

  document.getElementById("total-price").innerText = totalPrice;
  document.getElementById("advance-price").innerText = advance;
  document.getElementById("balance-price").innerText = remaining;
  document.getElementById("price-summary").style.display = "block";
}

//  Check if any date in range is blocked
function isBlockedDateRange(checkin, checkout) {
  const closedDatesRaw = JSON.parse(localStorage.getItem("closedDates")) || [];

  const closedDates = closedDatesRaw.map(d => {
    const date = new Date(d);
    return date.toISOString().split("T")[0];
  });

  const blockedDate = [];

  let current = new Date(checkin);
  while (current <= checkout) {
    const dateStr = current.toISOString().split("T")[0];
    if (closedDates.includes(dateStr)) {
      blockedDate.push(dateStr);
    }
    current.setDate(current.getDate() + 1);
  }

  return blockedDate;
}

// Show closed dates
function displayClosedDates() {
  const closedDatesList = document.getElementById("closedDatesList");
  const noticeBox = document.getElementById("closedDatesNotice");

  if (!closedDatesList || !noticeBox) return;

  closedDatesList.innerHTML = "";

  const closedDates = JSON.parse(localStorage.getItem("closedDates")) || [];

  if (closedDates.length === 0) {
    noticeBox.style.display = "none";
    return;
  }

  closedDates.forEach((date) => {
    const li = document.createElement("li");
    li.textContent = `📅 ${date}`;
    closedDatesList.appendChild(li);
  });

  noticeBox.style.display = "block";
}

// DOM Load
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const selectedVilla = params.get("villa");
  
  if (selectedVilla) {
    const villaSelect = document.getElementById("villa");
    villaSelect.value = selectedVilla;
    updateRoomOptions();
  }

  displayClosedDates();
});
