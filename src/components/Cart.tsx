"use client";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const Cart = () => {
  const itemCount = 0;
  const fee = 1;
  
  return (
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors duration-200">
        <ShoppingCart
          aria-hidden="true"
          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors duration-200"
        />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
          {itemCount}
        </span>
      </SheetTrigger>
      
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg bg-white">
        <SheetHeader className="space-y-2.5 pr-6 border-b pb-4">
          <SheetTitle className="text-lg font-semibold text-gray-900">
            Keranjang ({itemCount})
          </SheetTitle>
        </SheetHeader>
        
        {itemCount > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6 flex-1 overflow-y-auto py-4">
              {/* TODO: logika keranjang */}
              <div className="text-center text-gray-500 py-8">
                Item keranjang akan ditampilkan di sini
              </div>
            </div>
            
            <div className="space-y-4 text-sm border-t pt-4 bg-gray-50 px-6 py-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ongkos Kirim</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Biaya Transaksi</span>
                  <span className="font-medium">{formatPrice(16000 + fee, { currency: "IDR" })}</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between items-center text-base">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-gray-900">
                    {formatPrice(16000 + fee, { currency: "IDR" })}
                  </span>
                </div>
              </div>
              
              <SheetFooter className="mt-4">
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className={buttonVariants({
                      className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg",
                    })}
                  >
                    Lanjutkan ke Pembayaran
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-4 px-6">
            <div
              aria-hidden="true"
              className="relative mb-4 h-32 w-60 text-muted-foreground"
            >
              <Image
                src="/hippo-empty-cart.png"
                fill
                alt="Keranjang belanja kosong"
                className="object-contain"
              />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                Keranjang Anda Kosong
              </h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Mulai berbelanja dan tambahkan produk ke keranjang Anda
              </p>
            </div>
            
            <SheetTrigger asChild>
              <Link
                href="/cart"
                className={buttonVariants({
                  variant: "outline",
                  className: "mt-4 bg-white border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-md transition-colors duration-200",
                })}
              >
                Mulai Belanja
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;