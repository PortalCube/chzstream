export function formatFollowerCount(count: number): string {
  if (count < 1000) {
    return count.toString() + "명";
  }

  return (
    count.toLocaleString("ko-KR", {
      notation: "compact",
      maximumFractionDigits: 1,
    }) + "명"
  );
}
