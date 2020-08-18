import intervalToDuration from "date-fns/intervalToDuration";

export default function formatSinceLastFetch(
  lastFetchAt?: number
): string | undefined {
  if (!lastFetchAt) return undefined;

  const now = new Date();

  let sinceLastFetch = "";
  const duration = intervalToDuration({ start: lastFetchAt, end: now });
  ["years", "months", "weeks", "days", "hours", "minutes", "seconds"].forEach(
    (p) => {
      if (!sinceLastFetch && duration[p as keyof Duration]) {
        sinceLastFetch = `${duration[p as keyof Duration]} ${p}`;
      }
    }
  );
  return sinceLastFetch;
}
