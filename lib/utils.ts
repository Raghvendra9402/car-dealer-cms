import { clsx, type ClassValue } from "clsx";
import { format, parse } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateTimeOptions = () => {
  const times = [];
  const startHour = 8;
  const endHour = 18;

  for (let hour = startHour; hour < endHour; hour++) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(hour);
    date.setMinutes(0);

    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    times.push({
      label: formattedTime,
      value: formattedTime,
    });
  }
  return times;
};

export const generateDateOptions = () => {
  const today = new Date();
  const dates = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      label: format(date, "dd MMM yyyy"),
      value: format(date, "dd MMM yyyy"),
    });
  }
  return dates;
};

export const formatDate = (date: string, time: string) => {
  const parsedDate = parse(date, "dd MMM yyyy", new Date());
  const parsedTime = parse(time, "hh:mm aa", new Date());

  parsedDate.setHours(parsedTime.getHours(), parsedTime.getMinutes(), 0, 0);

  return parsedDate;
};
