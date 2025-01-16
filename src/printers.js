import usb from 'usb'

export async function findPrinter() {
  try {
    const devices = usb.getDeviceList()
    console.log('USB devices found:', devices.length)

    // Show information for all devices
    devices.forEach((device, index) => {
      console.log(`Device ${index + 1}:`, {
        vendorId: device.deviceDescriptor.idVendor.toString(16),
        productId: device.deviceDescriptor.idProduct.toString(16)
      })
    })

    if (devices.length === 0) {
      throw new Error('No USB devices found')
    }

    // Use first device found
    return devices[0]
  } catch (error) {
    console.error('Error finding device:', error)
    throw error
  }
}

export async function print(device, data) {
  return new Promise((resolve, reject) => {
    try {
      const iface = device.interface(0)
      
      // Claim interface
      if (iface.isKernelDriverActive()) {
        console.log('Detaching kernel driver...')
        iface.detachKernelDriver()
      }
      iface.claim()
      console.log('Interface claimed')

      // Find output endpoint
      const endpoint = iface.endpoints.find(ep => ep.direction === 'out')
      console.log('Endpoint found:', endpoint)
      
      if (!endpoint) {
        throw new Error('Output endpoint not found')
      }

      // Send data
      console.log('Sending data...')
      endpoint.transfer(data, (error) => {
        try {
          iface.release(() => {
            if (error) {
              console.error('Transfer error:', error)
              reject(error)
            } else {
              console.log('Transfer completed')
              resolve()
            }
          })
        } catch (e) {
          console.error('Error releasing interface:', e)
          reject(e)
        }
      })
    } catch (error) {
      console.error('Error in print:', error)
      reject(error)
    }
  })
} 