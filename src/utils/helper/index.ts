export function calculateDeadline(createdAt: string): string {
  const createdAtDate = new Date(createdAt);
  if (isNaN(createdAtDate.getTime())) {
    return "Invalid timestamp";
  }
  const deadline = new Date(createdAtDate);
  deadline.setDate(deadline.getDate() + 3);
  const differenceInMs = deadline.getTime() - Date.now();
  if (differenceInMs <= 0) {
    return "Expired";
  }
  const remainingDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
  const remainingHours = Math.floor((differenceInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((differenceInMs % (1000 * 60 * 60)) / (1000 * 60));
  if (remainingDays > 0) {
    return `${remainingDays} days left`;
  } else if (remainingHours > 0) {
    return `${remainingHours} hours left`;
  } else {
    return `${remainingMinutes} minutes left`;
  }
}

export function getDate(createdAt: string): string {
  const date = new Date(createdAt);
  return date.toDateString();
}
