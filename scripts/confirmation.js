function formatDate(dateStr) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [year, month, day] = dateStr.split("-");
  return `${day.padStart(2, '0')}-${months[parseInt(month) - 1]}-${year}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("bookingData"));

  if (!data) {
    document.getElementById("confirmation-details").innerHTML = "<p>No booking found.</p>";
    return;
  }

  const advance = Math.round(data.totalPrice * 0.2);
  const balance = data.totalPrice - advance;

  // Get room counts
  const roomCounts = data.selectedRooms.map(roomId => {
    const count = localStorage.getItem(`roomCount-${roomId}`) || "1"; // fallback if not stored
    return `${roomId} – ${count} room${count > 1 ? "s" : ""}`;
  });

  const roomListHTML = roomCounts.map(r => `<li>${r}</li>`).join("");

  const html = `
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Mobile:</strong> ${data.mobile}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Check-in:</strong> ${formatDate(data.checkin)}</p>
    <p><strong>Check-out:</strong> ${formatDate(data.checkout)}</p>
    <p><strong>No. of Guests:</strong> ${data.guests}</p>
    <p><strong>Villa:</strong> ${data.villa}</p>
    <p><strong>Selected Rooms:</strong></p>
    <ul>${roomListHTML}</ul>
    <p><strong>Breakfast:</strong> ${data.breakfast === "yes" ? "Included" : "Not Included"}</p>
    <hr />
    <p><strong>Total Price:</strong> ₹${data.totalPrice}</p>
    <p><strong>Advance to Pay:</strong> ₹${advance}</p>
    <p><strong>Remaining Balance:</strong> ₹${balance}</p>
  `;

  document.getElementById("confirmation-details").innerHTML = html;

 document.getElementById("proceedPayment").addEventListener("click", () => {
  const options = {
    key: "rzp_live_olZWPNDyOHUUTe", 
    amount: advance * 100, 
    currency: "INR",
    name: "Paradise Wild Sand Booking",
    description: "Advance Booking Payment",
    image: "https://yourdomain.com/logo.png", 
    handler: function (response) {
      alert("Payment Successful! Razorpay ID: " + response.razorpay_payment_id);
      
    },
    prefill: {
      name: data.name,
      email: data.email,
      contact: data.mobile
    },
    notes: {
      booking_id: "PW" + new Date().getTime(), // example note
    },
    theme: {
      color: "#0a3d62"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
});

});
