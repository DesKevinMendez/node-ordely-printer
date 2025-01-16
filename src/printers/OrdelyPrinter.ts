import { COMMANDS } from '@/utils/commands.js'
import { formatAmount, textToBuffer } from '@/utils/index.js'
import { webusb } from 'usb'

export class OrderlyPrinter {
  device: USBDevice | null = null

  constructor() {
    this.device = null
  }

  // Get list of available printers
  async getPrinters() {
    try {
      // Solicitar dispositivo USB con los filtros adecuados
      const device = await webusb.requestDevice({
        filters: [{}]
      })

      if (device) {
        return [{
          device,
          name: `${device.manufacturerName} ${device.productName}`
        }]
      }
      return []
    } catch (error) {
      console.error('Error getting printers:', error)
      throw error
    }
  }

  // Initialize printer
  async initialize() {
    const devices = await this.getPrinters()
    if (devices.length === 0) {
      throw new Error('No USB devices found')
    }
    this.device = devices[0].device
    return this
  }

  // Print test page
  async printTest() {
    const testData = {
      businessName: 'Ordely',
      legalName: 'Ordely S.A. de C.V.',
      address: '123 Test Street',
      location: 'Test Location',
      city: 'Test City',
      cashier: 'Kevin Méndez',
      ticket: 'TEST-001',
      subtotal: 2.50,
      tip: 0.50,
      total: 3.00,
      orderTime: '2024-01-16 12:00:00',
      orderId: '1234567890',
      table: '1',
      items: [
        { qty: 1, name: 'Test Item 1', price: 1.00 },
        { qty: 2, name: 'Test Item 2', price: 2.50 }
      ]
    }
    return this.print(testData)
  }

  // Print receipt
  async print(data: any) {
    if (!this.device) {
      await this.initialize()
    }

    try {
      if (!this.device) {
        throw new Error('Device not initialized')
      }
      await this.device.open()
      const configuration = await this.device.selectConfiguration(1)
      const iface = await this.device.claimInterface(0)
      const alternate = await this.device.selectAlternateInterface(0, 0)

      // Find output endpoint
      const endpoint = this.device.configuration?.interfaces[0].alternate.endpoints
        .find((ep: USBEndpoint) => ep.direction === 'out')
      if (!endpoint) {
        throw new Error('Output endpoint not found')
      }

      // Calculate totals
      const subtotal = data.subtotal;
      const tip = data.tip || 0
      const total = data.total

      // Prepare receipt content
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
        textToBuffer('ATENDIDO POR: ' + data.cashier + '\n'),
        textToBuffer('*'.repeat(40) + '\n'),
        textToBuffer('TICKET #: ' + data.ticket + '\n'),
        data.orderId ? textToBuffer('ORDEN ID: ' + data.orderId + '\n') : Buffer.from([]),
        data.table ? textToBuffer('MESA: ' + data.table + '\n') : Buffer.from([]),
        textToBuffer('*'.repeat(40) + '\n'),
        textToBuffer('CANT  PRODUCTO          P.UNIT    TOTAL\n'),
        ...data.items.map((item: any) =>
          textToBuffer(
            `${item.qty.toString().padEnd(4)} ${item.name.padEnd(16)} ${formatAmount(item.price).padStart(8)} ${formatAmount(item.qty * item.price).padStart(8)}\n`
          )
        ),
        COMMANDS.LINE_FEED,
        textToBuffer('-'.repeat(40) + '\n'),
        textToBuffer('SUBTOTAL:'.padEnd(32) + formatAmount(subtotal) + '\n'),
        textToBuffer('PROPINA:'.padEnd(32) + formatAmount(tip) + '\n'),
        textToBuffer('TOTAL:'.padEnd(32) + formatAmount(total) + '\n'),
        COMMANDS.LINE_FEED,
        COMMANDS.ALIGN_CENTER,
        data.orderTime ? textToBuffer('FECHA: ' + data.orderTime + '\n') : Buffer.from([]),
        textToBuffer('*'.repeat(40) + '\n'),
        textToBuffer('¡GRACIAS POR SU PREFERENCIA!\n'),
        COMMANDS.PAPER_CUT
      ])

      // Send data
      console.log('Sending data...');

      // Transferir datos usando WebUSB
      await this.device.transferOut(endpoint.endpointNumber, receipt)

      // Liberar interfaz y cerrar dispositivo
      await this.device.close()
    } catch (error) {
      console.error('Error in print:', error)
      throw error
    }
  }
} 