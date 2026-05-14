import { z } from 'zod';

export const ProductSchema = z.object({
  _id: z.string(),
  product_id: z.string(),
  seller_id: z.string(),
  product_category_name: z.string(),
  product_qty: z.number().default(0),
  product_image_url: z.string().default(''),
  price: z.number().default(0),
  product_name: z.string().default('Unknown Product'),
  is_deleted: z.boolean().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
