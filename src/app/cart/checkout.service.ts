import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { ProductsService } from '../products/products.service';
import { EMPTY, Observable } from 'rxjs';
import { ProductCheckout } from '../products/product.interface';
import { map, switchMap } from 'rxjs/operators';
import { ApiService } from '../core/api.service';

const userId = 'da1f9560-5385-44ff-b403-97d4a0a240c3';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService{
  constructor(
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
    private apiService: ApiService
  ) {}

  getProductsForCheckout(): Observable<ProductCheckout[]> {
    return this.cartService.cart$.pipe(
      switchMap((cart) =>
        this.productsService.getProductsForCheckout(Object.keys(cart)).pipe(
          map((products) =>
            products.map((product) => ({
              ...product,
              orderedCount: cart[product.id],
              totalPrice: +(cart[product.id] * product.price).toFixed(2),
            }))
          )
        )
      )
    );
  }

  placeOrder(orderDetails:any){
    if (!this.apiService.endpointEnabled('order')) {
      console.warn(
        'Endpoint "order" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    const url = this.apiService.getUrl('order', `/api/profile/${userId}/cart/checkout`);
    return this.apiService.http.post(url, orderDetails);
  }
}
