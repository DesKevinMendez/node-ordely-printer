export function textToBuffer(text: string) {
  return Buffer.from(text.normalize('NFD').replace(/[\u0300-\u036f]/g, ""), 'ascii')
}

export function centerText(text: string, width = 32) {
  const padding = Math.max(0, width - text.length)
  const leftPad = Math.floor(padding / 2)
  return ' '.repeat(leftPad) + text
}

export function formatAmount(amount: number) {
  return (amount / 100).toFixed(2)
} 