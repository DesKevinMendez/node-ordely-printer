import { PrinterData } from "@/types/Printer.js"
import { formatAmount, textToBuffer } from "@/utils/index.js"
import { COMMANDS } from "@/utils/commands.js"
import { dateFormat } from "@/utils/dateFormat.js"

export const buildReceipt = (data: PrinterData) => {
  const receipt = Buffer.concat([
    COMMANDS.INIT,
    COMMANDS.CHARSET_PC850,
    COMMANDS.ALIGN_CENTER,
    COMMANDS.BOLD_ON,
    textToBuffer(data.commerce.name + '\n'),
    COMMANDS.BOLD_OFF,
    textToBuffer(data.commerce.description + '\n'),
    textToBuffer(data.commerce.address + '\n'),
    textToBuffer(data.commerce.phone + '\n'),
    COMMANDS.LINE_FEED,
    COMMANDS.ALIGN_LEFT,
    data.order.user ? textToBuffer('ATENDIDO POR: ' + data.order.user.first_name + ' ' + data.order.user.last_name + '\n') : Buffer.from([]),
    textToBuffer('*'.repeat(40) + '\n'),
    textToBuffer('TICKET #: ' + data.order.id + '\n'),
    data.order.table ? textToBuffer('MESA: ' + data.order.table.name + '\n') : Buffer.from([]),
    COMMANDS.LINE_FEED,
    textToBuffer('*'.repeat(40) + '\n'),
    textToBuffer('CANT  PRODUCTO          P.UNIT    TOTAL\n'),
    ...data.order.meta.map((item: any) =>
      textToBuffer(
        `${item.quantity.toString().padEnd(4)} ${item.name.padEnd(16)} ${formatAmount(item.price).padStart(8)} ${formatAmount(item.quantity * item.price).padStart(8)}\n`
      )
    ),
    COMMANDS.LINE_FEED,
    textToBuffer('-'.repeat(40) + '\n'),
    textToBuffer('SUBTOTAL:'.padEnd(32) + formatAmount(data.order.subtotal) + '\n'),
    textToBuffer('PROPINA:'.padEnd(32) + formatAmount(data.order.tip) + '\n'),
    textToBuffer('TOTAL:'.padEnd(32) + formatAmount(data.order.total) + '\n'),
    COMMANDS.LINE_FEED,
    COMMANDS.ALIGN_CENTER,
    data.order.created_at ? textToBuffer('FECHA: ' + dateFormat(data.order.created_at) + '\n') : Buffer.from([]),
    textToBuffer('*'.repeat(40) + '\n'),
    textToBuffer('GRACIAS POR SU PREFERENCIA\n'),
    COMMANDS.PAPER_CUT
  ])

  return receipt
}