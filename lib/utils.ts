import { Ride } from "@/types/type";

// Sort rides by date and time
export const sortRides = (rides: Ride[]): Ride[] => {
  // result is the sorted array of rides
  const result = rides.sort((a, b) => {
    const dateA = new Date(`${a.created_at}T${a.ride_time}`);
    const dateB = new Date(`${b.created_at}T${b.ride_time}`);
    return dateB.getTime() - dateA.getTime();
  });

  // return the sorted array of rides
  return result.reverse();
};

// Filter rides by date and time
export function formatTime(minutes: number): string {
  // Format the minutes to be a number
  const formattedMinutes = +minutes?.toFixed(0) || 0;

  // If the minutes are less than 60, return the minutes
  if (formattedMinutes < 60) {
    return `${minutes} min`;
  } else {
    const hours = Math.floor(formattedMinutes / 60);
    const remainingMinutes = formattedMinutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
}

// Format the date to be a string
export function formatDate(dateString: string): string {
  // Create a new date object
  const date = new Date(dateString);
  const day = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  // Get the month and year
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Return the formatted date
  return `${day < 10 ? "0" + day : day} ${month} ${year}`;
}
