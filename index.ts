import { OrderlyPrinter } from '@/printers/OrdelyPrinter.js'

async function main() {
  try {
    // Create printer instance

    const printer = new OrderlyPrinter()
    
    // List available printers
    const printers = await printer.getPrinters()
    console.log('Available printers:', printers)
    
    // Print test page
    await printer.printTest()
  } catch (error) {
    console.error('Error in main:', error)
  }
}

main()