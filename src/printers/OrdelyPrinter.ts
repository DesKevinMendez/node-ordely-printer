import { COMMANDS } from '@/utils/commands.js'
import { textToBuffer, formatAmount } from '@/utils/index.js'
import usb from 'usb'

export class OrderlyPrinter {
  device: usb.Device | null = null

  constructor() {
    this.device = null
  }

  // Get list of available printers
  getPrinters() {
    try {
      const devices = usb.getDeviceList()
      return devices.map((device, index) => ({
        id: index,
        vendorId: device.deviceDescriptor.idVendor.toString(16),
        productId: device.deviceDescriptor.idProduct.toString(16),
        device: device
      }))
    } catch (error) {
      console.error('Error getting printers:', error)
      throw error
    }
  }

  // Initialize printer
  initialize() {
    const devices = this.getPrinters()
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
      this.initialize()
    }

    return new Promise((resolve, reject) => {
      try {
        if (!this.device) {
          throw new Error('Device not initialized')
        }
        this.device.open()
        const iface = this.device.interface(0)
        
        // Claim interface
        if (iface.isKernelDriverActive()) {
          console.log('Detaching kernel driver...')
          iface.detachKernelDriver()
        }
        iface.claim()

        // Find output endpoint
        const endpoint = iface.endpoints.find(ep => ep.direction === 'out')
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
          data.orderTime ? textToBuffer('FECHA: ' + data.orderTime + '\n') : Buffer.from([]),
          textToBuffer('*'.repeat(40) + '\n'),
          textToBuffer('¡GRACIAS POR SU PREFERENCIA!\n'),
          COMMANDS.PAPER_CUT
        ])

        // Send data
        console.log('Sending data...');
        
        if (endpoint instanceof usb.OutEndpoint) {
          endpoint.transfer(receipt, (error: any) => {
            try {
              iface.release(() => {
                if (this.device) {
                  this.device.close()
                }
                if (error) {
                  console.error('Transfer error:', error)
                  reject(error)
                } else {
                  console.log('Transfer completed')
                  resolve(true)
                }
              })
            } catch (e) {
              console.error('Error releasing interface:', e)
              reject(e)
            }
          })
        }
      } catch (error) {
        console.error('Error in print:', error)
        reject(error)
      }
    })
  }
} 