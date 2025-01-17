import { OrdelyPrinter } from '@/printers/OrdelyPrinter.js'

async function main() {
  try {
    // Create printer instance
    const printer = new OrdelyPrinter()
    
    // List available printers
    const printers = await printer.getPrinters()
    console.log('Available printers:', printers[0])
    
    // Print test page
    await printer.printTest()
  } catch (error) {
    console.error('Error in main:', error)
  }
}

main()

export { OrdelyPrinter }