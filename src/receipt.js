import { COMMANDS } from './commands.js'
import { textToBuffer, formatAmount } from './utils.js'
import { findPrinter, print } from './printers.js'

export async function printReceipt(data) {
  try {
    const printer = await findPrinter()
    printer.open()

    // Calculate totals
    const subtotal = data.subtotal || data.items.reduce((sum, item) => sum + (item.qty * item.price), 0)
    const tip = data.tip || 0
    const total = data.total || subtotal + tip

    const receipt = Buffer.concat([
      COMMANDS.INIT,
      COMMANDS.CHARSET_PC850,
      COMMANDS.ALIGN_CENTER,
      COMMANDS.BOLD_ON,
      textToBuffer(data.businessName + '\n'),
      COMMANDS.BOLD_OFF,
      textToBuffer(data.legalName + '\n'),
      textToBuffer(data.address + '\n'),
      textToBuffer(data.location + '\n'),
      textToBuffer(data.city + '\n'),
      COMMANDS.LINE_FEED,
      COMMANDS.ALIGN_LEFT,
      textToBuffer('ATENDIÓ: ' + data.cashier + '\n'),
      textToBuffer('*'.repeat(40) + '\n'),
      textToBuffer('TICKET #: ' + data.ticket + '\n'),
      textToBuffer('ORDEN ID: ' + data.orderId + '\n'),
      ...(data.table ? [textToBuffer('MESA: ' + data.table + '\n')] : []),
      textToBuffer('*'.repeat(40) + '\n'),
      textToBuffer('CANT  PRODUCTO          P.UNIT    TOTAL\n'),
      // Items
      ...data.items.map(item => 
        textToBuffer(
          `${item.qty.toString().padEnd(4)} ${
            item.name.padEnd(16)} ${
            formatAmount(item.price).padStart(8)} ${
            formatAmount(item.qty * item.price).padStart(8)}\n`
        )
      ),
      COMMANDS.LINE_FEED,
      textToBuffer('-'.repeat(40) + '\n'),
      textToBuffer('SUBTOTAL:'.padEnd(32) + formatAmount(subtotal) + '\n'),
      textToBuffer('PROPINA:'.padEnd(32) + formatAmount(tip) + '\n'),
      textToBuffer('TOTAL:'.padEnd(32) + formatAmount(total) + '\n'),
      COMMANDS.LINE_FEED,
      COMMANDS.ALIGN_CENTER,
      textToBuffer('FECHA: ' + data.orderTime + '\n'),
      textToBuffer('*'.repeat(40) + '\n'),
      textToBuffer('¡GRACIAS POR SU PREFERENCIA!\n'),
      COMMANDS.PAPER_CUT
    ])

    await print(printer, receipt)
    printer.close()
    console.log('Receipt printed successfully')
  } catch (error) {
    console.error('Error printing receipt:', error)
    throw error
  }
} 