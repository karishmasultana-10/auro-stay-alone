// Function to load closed dates from localStorage and display them
function loadClosedDates() {
    const storedClosedDates = JSON.parse(localStorage.getItem("closedDates")) || [];
    const list = document.getElementById("closedDatesList");
    list.innerHTML = ""; 

    storedClosedDates.forEach(date => {
        const li = document.createElement("li");
        li.textContent = date;
        list.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    showClosedDates();
});

// Function to add a closed date
function addClosedDate() {
    const dateInput = document.getElementById("closed-date-picker");
    const selectedDate = dateInput.value;

    if (!selectedDate) {
        alert("Please select a date.");
        return;
    }

    let closedDates = JSON.parse(localStorage.getItem("closedDates")) || [];

    if (closedDates.includes(selectedDate)) {
        alert("This date is already closed.");
        return;
    }

    closedDates.push(selectedDate);
    localStorage.setItem("closedDates", JSON.stringify(closedDates));

    dateInput.value = ""; 
    showClosedDates();
}

// Function to display closed dates with delete buttons
function showClosedDates() {
    const closedDatesList = document.getElementById("closedDatesList");
    closedDatesList.innerHTML = "";

    let closedDates = JSON.parse(localStorage.getItem("closedDates")) || [];

    if (closedDates.length === 0) {
        closedDatesList.innerHTML = "<li>No closed dates yet.</li>";
        return;
    }

    closedDates.forEach((date, index) => {
        let li = document.createElement("li");
        li.textContent = date;

        // Create Delete Button
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.onclick = function () {
            deleteClosedDate(index);
        };

        li.appendChild(deleteBtn);
        closedDatesList.appendChild(li);
    });
}

// Function to delete a closed date
function deleteClosedDate(index) {
    let closedDates = JSON.parse(localStorage.getItem("closedDates")) || [];

    closedDates.splice(index, 1); 
    localStorage.setItem("closedDates", JSON.stringify(closedDates));

    showClosedDates(); 
}


// Function to handle admin authentication
document.getElementById("admin-btn").addEventListener("click", function () {
    let password = prompt("Enter Admin Password:");
    if (password === "paradise") {
        document.getElementById("admin-btn").style.display = "none"; 
        document.getElementById("admin-panel").style.display = "block"; 
    } else {
        alert("Incorrect password!");
    }
});

