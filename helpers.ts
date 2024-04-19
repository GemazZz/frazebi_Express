const getDataFunc = (): string => {
  const minutes: string = new Date().getMinutes() > 9 ? new Date().getMinutes().toString() : "0" + new Date().getMinutes();
  const date: string =
    new Date().getFullYear() +
    "წ. " +
    new Date().getDate() +
    " " +
    (new Date().getMonth() === 0
      ? "იანვარი"
      : new Date().getMonth() === 1
      ? "თებერვალი"
      : new Date().getMonth() === 2
      ? "მარტი"
      : new Date().getMonth() === 3
      ? "აპრილი"
      : new Date().getMonth() === 4
      ? "მაისი"
      : new Date().getMonth() === 5
      ? "ივნისი"
      : new Date().getMonth() === 6
      ? "ივლისი"
      : new Date().getMonth() === 7
      ? "აგვისტო"
      : new Date().getMonth() === 8
      ? "სექტემბერი"
      : new Date().getMonth() === 9
      ? "ოქტომბერი"
      : new Date().getMonth() === 10
      ? "ნოემბერი"
      : new Date().getMonth() === 11
      ? "დეკემბერი"
      : new Error("Invalid month")) +
    ", " +
    new Date().getHours() +
    ":" +
    minutes;
  return date;
};

export { getDataFunc };
