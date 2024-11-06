export default function formatDate(date) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  const [month, day, year] = formattedDate.replace(",", "").split(" ");
  return { day, month, year };
}
