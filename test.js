const availableDates = [
  '2025-05-01',
  '2025-05-02',
  '2025-05-03',
  '2025-05-05',
  '2025-05-07',
  '2025-05-09',
  '2025-05-11',
  '2025-05-12',
  '2025-05-15',
  '2025-05-20',
  '2025-05-21',
  '2025-05-25',
  '2025-05-27',
  '2025-05-28',
  '2025-05-29',
];

const chooseAvailableDate = (daysAhead) => {
  const now = new Date();
  now.setDate(now.getDate() + daysAhead);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const formattedFutureDate = `${year}-${month}-${day}`;

  // First, check for exact match
  if (availableDates.includes(formattedFutureDate)) {
    return formattedFutureDate;
  }

  // Otherwise, return the first available date after the target date
  const futureDateTime = now.getTime();

  const nextAvailableDate = availableDates.find(date => {
    const dateTime = new Date(date).getTime();
    if (dateTime >= futureDateTime) {
      return date;
    }
  })

  return nextAvailableDate;
};

console.log(chooseAvailableDate(14));
