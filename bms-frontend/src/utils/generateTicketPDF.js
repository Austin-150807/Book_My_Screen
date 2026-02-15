import jsPDF from "jspdf";

export const generateTicketPDF = ({
  showData,
  selectedSeats,
  totalAmount,
  bookingId,
}) => {
  try {
    const doc = new jsPDF("p", "mm", "a4");

    const seatList = selectedSeats
      ?.map((seat) => `${seat.row}${seat.number}`)
      .join(", ");

    const seatCount = selectedSeats?.length || 1;

    const finalBookingId = bookingId || "BMS-LUXE";
    const issueDate = new Date().toLocaleString();

    // ===============================
    // LUXURY STRIP DIMENSIONS
    // ===============================
    const stripWidth = 120;
    const stripHeight = 220;
    const stripX = (210 - stripWidth) / 2;
    const stripY = 30;

    // ===============================
    // BLACK BACKGROUND
    // ===============================
    doc.setFillColor(10, 10, 10);
    doc.roundedRect(stripX, stripY, stripWidth, stripHeight, 4, 4, "F");

    // ===============================
    // GOLD ACCENT LINE
    // ===============================
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.8);
    doc.line(stripX + 10, stripY + 12, stripX + stripWidth - 10, stripY + 12);

    // ===============================
    // HEADER
    // ===============================
    doc.setTextColor(212, 175, 55);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("BOOK MY SCREEN", 105, stripY + 22, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Luxury Cinema Admission", 105, stripY + 28, {
      align: "center",
    });

    // ===============================
    // MOVIE TITLE
    // ===============================
    let y = stripY + 50;

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(showData.movie.title, 105, y, { align: "center" });

    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    doc.text(`${showData.theater?.name}, ${showData.theater?.city}`, 105, y, {
      align: "center",
    });

    // ===============================
    // GOLD DIVIDER
    // ===============================
    y += 15;
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.3);
    doc.line(stripX + 15, y, stripX + stripWidth - 15, y);

    // ===============================
    // DETAILS SECTION
    // ===============================
    y += 15;

    const left = stripX + 18;
    const right = stripX + stripWidth - 18;

    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);

    doc.text("Seats", left, y);
    doc.text(seatList, right, y, { align: "right" });

    y += 12;
    doc.text("Booking ID", left, y);
    doc.text(finalBookingId, right, y, { align: "right" });

    y += 12;
    doc.text("Issued On", left, y);
    doc.text(issueDate, right, y, { align: "right" });

    y += 15;

    // TOTAL PAID
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(212, 175, 55);
    doc.text("TOTAL PAID", left, y);
    doc.text(`₹ ${totalAmount}`, right, y, { align: "right" });

    // ===============================
    // PERFORATION
    // ===============================
    const perforationY = stripY + stripHeight - 45;

    doc.setDrawColor(150);
    doc.setLineDash([2, 2], 0);
    doc.line(stripX + 5, perforationY, stripX + stripWidth - 5, perforationY);
    doc.setLineDash([]);

    // ===============================
    // FOOTER ADMISSION SECTION
    // ===============================
    doc.setTextColor(212, 175, 55);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    // 🔥 DYNAMIC ADMIT COUNT
    doc.text(`ADMIT ${seatCount}`, 105, perforationY + 18, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(170, 170, 170);
    doc.text(
      `${seatCount} Seat${seatCount > 1 ? "s" : ""} Admission`,
      105,
      perforationY + 25,
      { align: "center" },
    );

    doc.setFontSize(7);
    doc.text(
      "Tickets once booked cannot be refunded.",
      105,
      stripY + stripHeight - 8,
      { align: "center" },
    );

    doc.save(`Luxury-Ticket-${finalBookingId}.pdf`);
  } catch (error) {
    console.error("PDF generation failed:", error);
  }
};
