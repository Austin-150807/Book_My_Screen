import Header from "../components/seat-layout/Header";
import Footer from "../components/seat-layout/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getShowById } from "../apis/index";
import { useState } from "react";
import screenImg from "../assets/screen.png";

const SeatLayout = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);

  const {
    data: showData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["show", showId],
    queryFn: async () => await getShowById(showId),
    enabled: !!showId,

    // 🔥 CRITICAL PART — Always fetch fresh data
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,

    select: (res) => res.data,
  });

  const handleSeatClick = (seat, row, price) => {
    const seatId = `${row}${seat.number}`;

    const exists = selectedSeats.find((s) => s.id === seatId);

    if (exists) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seatId));
    } else {
      setSelectedSeats([
        ...selectedSeats,
        {
          id: seatId,
          row,
          number: seat.number,
          price,
        },
      ]);
    }
  };

  const totalAmount = selectedSeats.reduce((acc, curr) => acc + curr.price, 0);

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (isError) return <div className="p-10">Error loading seats</div>;

  return (
    <div className="h-screen overflow-y-hidden">
      {/* HEADER */}
      <div className="fixed top-0 left-0 w-full z-10">
        <Header showData={showData} />
      </div>

      {/* SEAT LAYOUT */}
      <div className="max-w-7xl mx-auto mt-[210px] px-6 pb-4 bg-white h-[calc(100vh-320px)] overflow-y-scroll scrollbar-hide">
        <div className="flex flex-col items-center justify-center">
          {showData?.seatLayout && (
            <div className="flex flex-col items-center justify-center">
              {Object.entries(
                showData.seatLayout.reduce((acc, curr) => {
                  if (!acc[curr.type])
                    acc[curr.type] = { price: curr.price, rows: [] };
                  acc[curr.type].rows.push(curr);
                  return acc;
                }, {}),
              ).map(([type, { price, rows }]) => (
                <div
                  key={type}
                  className="mb-12 w-full flex flex-col items-center justify-center"
                >
                  <h2 className="text-center font-semibold text-lg mb-4">
                    {type} : ₹{price}
                  </h2>

                  <div className="space-y-2">
                    {rows.map((rowObj) => (
                      <div key={rowObj.row} className="flex items-center">
                        <div className="w-6 text-right mr-2 text-sm text-gray-600">
                          {rowObj.row}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {rowObj.seats.map((seat, i) => {
                            const seatId = `${rowObj.row}${seat.number}`;
                            const isSelected = selectedSeats.find(
                              (s) => s.id === seatId,
                            );

                            const isBooked = seat.status === "BOOKED";

                            return (
                              <button
                                key={i}
                                onClick={() =>
                                  !isBooked &&
                                  handleSeatClick(seat, rowObj.row, price)
                                }
                                disabled={isBooked}
                                className={`w-9 h-9 m-[2px] rounded-lg border text-sm
                                  ${
                                    isBooked
                                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                      : isSelected
                                        ? "bg-purple-600 text-white"
                                        : "hover:bg-gray-100 border-black cursor-pointer"
                                  }`}
                              >
                                {isBooked ? "X" : seat.number}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SCREEN IMAGE */}
          <div className="flex justify-center mt-5">
            <img
              src={screenImg}
              alt="Screen"
              className="w-[300px] md:w-[400px] object-contain opacity-80"
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 w-full h-[100px] bg-white border-t border-gray-200 py-4 px-4 z-10">
        <Footer
          selectedSeats={selectedSeats}
          totalAmount={totalAmount}
          onProceed={() =>
            navigate(`/shows/${showId}/${showData?.theater?.city}/checkout`, {
              state: {
                selectedSeats,
                totalAmount,
                showData,
              },
            })
          }
        />
      </div>
    </div>
  );
};

export default SeatLayout;
