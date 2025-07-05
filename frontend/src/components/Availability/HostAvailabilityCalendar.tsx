import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
interface BlockedDate {
  start: Date;
  end: Date;
}

interface HostAvailabilityCalendarProps {
  propertyId: number;
}
export const HostAvailabilityCalendar: React.FC<HostAvailabilityCalendarProps> = ({ propertyId }) => {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [action, setAction] = useState<'block' | 'release'>('block');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch blocked dates
  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/availability/${propertyId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        // Convert string dates to Date objects for display
        console.log("Blocked dates response:", res.data);

        const dates = res.data.map((date: { start: string; end: string }) => ({
  start: new Date(date.start),
  end: new Date(date.end)
}));
        setBlockedDates(dates);
        setStartDate(null);
       setEndDate(null);
       setAction('block');

      } catch (err) {
        console.error("Failed to fetch blocked dates:", err);
      }
    };
    fetchBlockedDates();
  }, [propertyId]);

  const handleSubmit = async () => {
    if (!startDate || !endDate || !propertyId) return;

    setIsLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/availability/${propertyId}`,
        {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          action
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      // Refresh the list
      const res = await axios.get(`${BACKEND_URL}/availability/${propertyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Convert string dates to Date objects
     const dates = res.data.map((date: { start: string; end: string }) => ({
  start: new Date(date.start),
  end: new Date(date.end),
}));

      setBlockedDates(dates);
    } catch (err) {
      console.error("Error updating availability:", err);
      alert("Failed to update availability. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
// Generate individual dates in blocked ranges
  const getBlockedDateList = (): Date[] => {
    const result: Date[] = [];
    blockedDates.forEach(({ start, end }) => {
      const current = new Date(start);
      while (current <= end) {
        result.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return result;
  };
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Manage Availability</h2>

      <div className="mb-4">
        <label className="block mb-2">Select Dates</label>
        <DatePicker
          selected={startDate}
          onChange={(dates: [Date | null, Date | null]) => {
            const [start, end] = dates;
            setStartDate(start);
            setEndDate(end);
          }}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          minDate={new Date()}
          highlightDates={[
            {
              "react-datepicker__day--highlighted-custom-1": getBlockedDateList()
            }
          ]}
          dayClassName={(date) => {
            const isBlocked = getBlockedDateList().some(d => d.toDateString() === date.toDateString());
            return isBlocked ? "bg-red-200 text-red-800 rounded-full" : "";
          }}
        />
      </div>

      <div className="mb-4 flex gap-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            checked={action === 'block'}
            onChange={() => setAction('block')}
            className="mr-2"
          />
          Block Dates
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            checked={action === 'release'}
            onChange={() => setAction('release')}
            className="mr-2"
          />
          Release Dates
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!startDate || !endDate || isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400 w-full"
      >
        {isLoading ? 'Processing...' : 'Confirm'}
      </button>
    </div>
  );
};