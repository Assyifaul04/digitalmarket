import Link from "next/link";
import { Icons } from "./Icons";
import MaxWidthWrapper from "./MaxWidthWrapper";
import NavItems from "./NavItems";

const Navbar = () => {
  return (
    <div className="bg-white sticky top-0 z-50 inset-x-0 h-16 shadow">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          {/* Container utama */}
          <div className="flex items-center h-16 border-b border-gray-200 px-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1">
              <Icons.logo className="h-8 w-auto" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                za market
              </span>
            </Link>

            {/* Menu navigasi (hidden di mobile, tampil di lg ke atas) */}
            <div className="hidden z-50 lg:ml-8 lg:block lg:self-stretch">
              <NavItems />
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
