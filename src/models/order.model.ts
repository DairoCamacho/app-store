import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Person} from './person.model';
import {Product} from './product.model';
import {OrderProduct} from './order-product.model';

@model()
export class Order extends Entity {
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
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'number',
    required: true,
  })
  total: number;

  @property({
    type: 'number',
    required: true,
  })
  status?: number;

  @belongsTo(() => Person)
  personId: string;

  @hasMany(() => Product, {through: {model: () => OrderProduct}})
  products: Product[];

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;
