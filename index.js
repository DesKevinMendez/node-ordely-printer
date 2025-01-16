import { printReceipt } from './src/receipt.js'

const orderData = {
  "id": "9dfa9fde-9b67-4742-952f-3fbe7b59eac6",
  "order": 1,
  "total": 3075,
  "identify": "Una orden con identificador",
  "description": "Esta es la descripción",
  "created_at": "2025-01-16T03:18:15.000000Z",
  "tip": 0,
  "subtotal": 3075,
  "table": {
    "id": "9dfaab1d-f0be-4a5d-a052-19c6c0831177",
    "code": "TC-537",
    "slug": "mesa-4",
    "name": "Mesa 4"
  },
  "meta": [
    {
      "name": "Pai de limón",
      "price": 150,
      "quantity": 3,
      "tag_number": 1
    },
    {
      "name": "Budín",
      "price": 100,
      "quantity": 2,
      "tag_number": 1
    },
    {
      "name": "Tres leches",
      "price": 175,
      "quantity": 1,
      "tag_number": 1
    },
    {
      "name": "Café expresso",
      "price": 100,
      "quantity": 1,
      "tag_number": 1
    },
    {
      "name": "Café américano",
      "price": 100,
      "quantity": 6,
      "tag_number": 1
    },
    {
      "name": "Café con leche",
      "price": 125,
      "quantity": 2,
      "tag_number": 1
    },
    {
      "name": "Café helado",
      "price": 150,
      "quantity": 2,
      "tag_number": 1
    },
    {
      "name": "Capuchino",
      "price": 200,
      "quantity": 5,
      "tag_number": 1
    }
  ],
  "user": {
    "first_name": "Admin",
    "last_name": "Corkery"
  }
}

async function main() {
  try {
    await printReceipt({
      businessName: 'CAFÉ & POSTRES',
      legalName: 'CAFÉ & POSTRES, S.A. DE C.V.',
      address: 'CALLE PRINCIPAL #123',
      location: 'LOCAL 1, ZONA ROSA',
      city: 'SAN SALVADOR',
      cashier: `${orderData.user.first_name} ${orderData.user.last_name}`,
      ticket: orderData.order.toString(),
      table: orderData.table?.name,
      items: orderData.meta.map(item => ({
        qty: item.quantity,
        name: item.name,
        price: item.price / 100
      })),
      subtotal: orderData.subtotal / 100,
      tip: orderData.tip / 100,
      total: orderData.total / 100,
      orderTime: new Date(orderData.created_at).toLocaleString(),
      orderId: orderData.id
    })
  } catch (error) {
    console.error('Error in main:', error)
  }
}

main()