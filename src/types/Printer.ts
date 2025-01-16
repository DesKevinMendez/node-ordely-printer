export interface Meta {
  id: string,
  product_id: string,
  name: string,
  price: number,
  quantity: number,
  tag_number: number,
}

export interface Table {
  id: string,
  code: string,
  slug: string,
  name: string,
}

export interface Customer {
  id: string,
  first_name: string,
  last_name: string,
}

export interface PrinterData {
  commerce: {
    name: string,
    description: string,
    address: string,
    phone: string,
  },
  order: {
    id: string,
    order: number,
    total: number,
    commerce_id: string,
    identify: string | null,
    description: string | null,
    status: string,
    created_at: string,
    updated_at: string,
    send_notification_to_customer: boolean,
    is_service: boolean,
    table_id: string | null,
    source: string,
    is_delivery: boolean,
    tip: number,
    subtotal: number,
    meta: Meta[],
    user: Customer | null,
    table: Table | null,
    customer: Customer | null,
  },
}
