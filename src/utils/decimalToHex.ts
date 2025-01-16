// Helper function to convert decimal to hex with 0x prefix
export function toHexString(num: number): string {
  return `0x${num.toString(16).padStart(4, '0')}`
}
