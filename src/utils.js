export function textToBuffer(text) {
  return Buffer.from(text.normalize('NFD').replace(/[\u0300-\u036f]/g, ""), 'ascii')
}

export function centerText(text, width = 32) {
  const padding = Math.max(0, width - text.length)
  const leftPad = Math.floor(padding / 2)
  return ' '.repeat(leftPad) + text
}

export function formatAmount(amount) {
  return amount.toFixed(2)
} 