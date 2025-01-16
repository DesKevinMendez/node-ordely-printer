import { PrinterData } from "@/types/Printer.js";

export const printExample: PrinterData = {
  commerce: {
    name: 'Test Commerce',
    description: 'Test Description',
    address: 'Test Address',
    phone: '+503 6562 0613',
  },
  order: {
    id: '9dfaab2c-8b08-4143-9858-bea49f3b0596',
    order: 2,
    total: 325,
    commerce_id: '9dfa9f8e-d6cf-4151-80a0-69a37e7a4e13',
    identify: null,
    description: null,
    status: 'pending',
    created_at: '2025-01-16T03:49:52.000000Z',
    updated_at: '2025-01-16T03:49:52.000000Z',
    send_notification_to_customer: false,
    is_service: false,
    table_id: '9dfaab1d-f0be-4a5d-a052-19c6c0831177',
    source: 'dashboard',
    is_delivery: false,
    tip: 0,
    subtotal: 325,
    meta: [
      {
        id: '9dfaab2c-8d2f-4712-8227-ca8f6b1d6490',
        product_id: '9dfa9f8e-f1bc-4e82-8df4-713fbe1b76a1',
        name: 'Café expresso',
        price: 100,
        quantity: 1,
        tag_number: 1
      },
      {
        id: '9dfaab2c-8d6b-4bba-9d9d-3b103e22840f',
        product_id: '9dfa9f8e-f261-4b23-9e04-546de7831977',
        name: 'Café américano',
        price: 100,
        quantity: 1,
        tag_number: 1
      },
      {
        id: '9dfaab2c-8d95-4a75-8fcd-6f58826b391f',
        product_id: '9dfa9f8e-f2f6-47d2-8fd5-7a2b06a1d540',
        name: 'Café con leche',
        price: 125,
        quantity: 1,
        tag_number: 1
      }
    ],
    user: {
      id: '9dfa9f8e-e66a-465f-b506-f53e1833e949',
      first_name: 'Admin',
      last_name: 'Corkery',
    } ,
    customer: null,
    table: {
      id: '9dfaab1d-f0be-4a5d-a052-19c6c0831177',
      code: 'TC-537',
      slug: 'mesa-4',
      name: 'Mesa 4'
    }
  }
}