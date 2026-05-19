import { z } from "zod";

export const CartSchema = z.object({
  id: z.string(),
  category: z.string(),
  image: z.string(),
  price: z.number(),
  productQuantity: z.number(),
  quantity: z.number(),
})

export type Cart = z.infer<typeof CartSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  category: z.string().nullable().optional(),
  productName: z.string(),
  image: z.string(),
  productPrice: z.number(),
  freight: z.number(),
  totalPrice: z.number(),
  status: z.string(),
  payment: z.string(),
  installments: z.number(),
  orderedAt: z.string(),
  estimatedDelivery: z.string(),
});

export type Order = z.infer<typeof OrderSchema>;