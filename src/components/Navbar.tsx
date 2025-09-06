import Link from "next/link";
import Cart from "./Cart";
import { Icons } from "./Icons";
import MaxWidthWrapper from "./MaxWidthWrapper";
import NavItems from "./NavItems";
import { buttonVariants } from "./ui/button";

const Navbar = () => {
  const user = null;

  return (
    <div className="bg-white sticky top-0 z-50 inset-x-0 h-16 shadow">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          {/* Container utama */}
          <div className="flex items-center h-16 border-b border-gray-200 px-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1">
              <Icons.logo className="h-10 w-auto" />
            </Link>

            {/* Menu navigasi (hidden di mobile, tampil di lg ke atas) */}
            <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch">
              <NavItems />
            </div>

            <div className="ml-auto flex items-center">
              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                {user ? null : (
                  <Link
                    href="/auth/login"
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    Sign in
                  </Link>
                )}

                {user ? null : (
                  <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                )}

                {user ? (
                  <p></p>
                ) : (
                  <Link
                    href="/sign-in"
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    Create account
                  </Link>
                )}

                {user ? (
                  <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                ) : null}

                {user ? null : (
                  <div className="flex lg:ml-6">
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  </div>
                )}

                <div className="ml-4 flow-root lg:ml-6">
                  <Cart />
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;