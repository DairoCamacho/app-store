import {Entity, model, property} from '@loopback/repository';

@model()
export class OrderProduct extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  idProduct: string;

  @property({
    type: 'string',
    required: true,
  })
  idOrder: string;

  @property({
    type: 'string',
  })
  orderId?: string;

  @property({
    type: 'string',
  })
  productId?: string;

  constructor(data?: Partial<OrderProduct>) {
    super(data);
  }
}

export interface OrderProductRelations {
  // describe navigational properties here
}

export type OrderProductWithRelations = OrderProduct & OrderProductRelations;
