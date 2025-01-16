// Comandos ESC/POS básicos
export const COMMANDS = {
  INIT: Buffer.from([0x1B, 0x40]), // ESC @
  ALIGN_CENTER: Buffer.from([0x1B, 0x61, 0x01]), // ESC a 1
  ALIGN_LEFT: Buffer.from([0x1B, 0x61, 0x00]), // ESC a 0
  BOLD_ON: Buffer.from([0x1B, 0x45, 0x01]), // ESC E 1
  BOLD_OFF: Buffer.from([0x1B, 0x45, 0x00]), // ESC E 0
  PAPER_CUT: Buffer.from([0x1D, 0x56, 0x41]), // GS V A
  LINE_FEED: Buffer.from([0x0A]), // LF
  DOUBLE_WIDTH_ON: Buffer.from([0x1B, 0x21, 0x20]), // ESC ! 32
  DOUBLE_WIDTH_OFF: Buffer.from([0x1B, 0x21, 0x00]), // ESC ! 0
  CHAR_SIZE_NORMAL: Buffer.from([0x1D, 0x21, 0x00]), // GS ! 0
  CHAR_SIZE_DOUBLE: Buffer.from([0x1D, 0x21, 0x11]), // GS ! 17
  UNDERLINE_ON: Buffer.from([0x1B, 0x2D, 0x01]), // ESC - 1
  UNDERLINE_OFF: Buffer.from([0x1B, 0x2D, 0x00]), // ESC - 0
  CHARSET_PC437: Buffer.from([0x1B, 0x74, 0x00]), // ESC t 0 - USA/Standard Europe
  CHARSET_PC850: Buffer.from([0x1B, 0x74, 0x02]), // ESC t 2 - Multilingual
} 