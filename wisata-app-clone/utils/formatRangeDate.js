export default function formatRangeDate(first, last) {
  let omitYear = true;

  if (first && last) {
    const currentDate = formatDate(new Date());
    const startDate = formatDate(new Date(first));
    const endDate = formatDate(new Date(last));

    omitYear =
      currentDate.year === startDate.year && currentDate.year === endDate.year;
      
    if (first === last) {
      return omitYear
        ? `${startDate.day} ${startDate.month}`
        : `${startDate.day} ${startDate.month} ${startDate.year}`;
    }

    if (startDate.year === endDate.year) {
      if (startDate.month === endDate.month) {
        return omitYear
          ? `${startDate.day} - ${endDate.day} ${startDate.month}`
          : `${startDate.day} - ${endDate.day} ${startDate.month} ${startDate.year}`;
      } else {
        return omitYear
          ? `${startDate.day} ${startDate.month} - ${endDate.day} ${endDate.month} ${startDate.year}`
          : `${startDate.day} ${startDate.month} - ${endDate.day} ${endDate.month} ${startDate.year}`;
      }
    } else {
      return omitYear
        ? `${startDate.day} ${startDate.month} ${startDate.year} - ${endDate.day} ${endDate.month}`
        : `${startDate.day} ${startDate.month} ${startDate.year} - ${endDate.day} ${endDate.month} ${endDate.year}`;
    }
  } else if (first && !last) {
    const singleDate = formatDate(new Date(first));
    return omitYear
      ? `${singleDate.day} ${singleDate.month}`
      : `${singleDate.day} ${singleDate.month} ${singleDate.year}`;
  }

  return "";
}
