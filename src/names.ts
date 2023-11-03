export function getPropertyName(
  fname: string,
  type: "status" | "interrupt" = "status"
) {
  return `gpoller-${fname}-${type}`;
}
