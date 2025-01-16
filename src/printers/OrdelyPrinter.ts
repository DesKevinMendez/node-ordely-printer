import { buildReceipt } from '@/build/receipt.js'
import { printExample } from '@/dummy/printExample.js'
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
    return this.print(printExample)
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
      await this.device.selectConfiguration(1)
      await this.device.claimInterface(0)
      await this.device.selectAlternateInterface(0, 0)

      // Find output endpoint
      const endpoint = this.device.configuration?.interfaces[0].alternate.endpoints
        .find((ep: USBEndpoint) => ep.direction === 'out')
      if (!endpoint) {
        throw new Error('Output endpoint not found')
      }

      // Prepare receipt content
      const receipt = buildReceipt(data)

      // Send data
      console.log('Sending data...');

      // Transfer data using WebUSB
      await this.device.transferOut(endpoint.endpointNumber, receipt)

      // Release interface and close device
      await this.device.close()
    } catch (error) {
      console.error('Error in print:', error)
      throw error
    }
  }
} 