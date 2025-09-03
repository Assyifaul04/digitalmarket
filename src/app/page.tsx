import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react";
import Link from "next/link";

const perks = [
  {
    name: "Pengiriman Instan",
    Icon: ArrowDownToLine,
    description:
      "Dapatkan aset Anda dikirim ke email dalam hitungan detik dan langsung dapat diunduh.",
  },
  {
    name: "Kualitas Terjamin",
    Icon: CheckCircle,
    description:
      "Setiap aset di platform kami diverifikasi oleh tim untuk memastikan standar kualitas tertinggi. Tidak puas? Kami menawarkan garansi pengembalian dana 30 hari.",
  },
  {
    name: "Untuk Planet ini",
    Icon: Leaf,
    description:
      "Kami berkomitmen menjaga bumi. Setiap aset yang Anda gunakan dibuat dengan cara yang ramah lingkungan dan mendukung keberlanjutan.",
  },
];

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Pasar digital untuk{" "}
            <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text">
              file pemrograman berkualitas
            </span>.
          </h1>
          <p className="mt-8 text-lg md:text-xl max-w-prose text-muted-foreground leading-relaxed">
            Selamat datang di <strong className="text-blue-600 font-semibold">CodeMarket</strong>. 
            Temukan koleksi lengkap <span className="font-medium text-gray-700">source code</span>, 
            <span className="font-medium text-gray-700">script</span>, 
            <span className="font-medium text-gray-700">template</span>, dan
            <span className="font-medium text-gray-700">komponen pemrograman</span> yang telah
            diverifikasi oleh developer berpengalaman untuk memastikan kualitas
            dan fungsionalitas terbaik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/products" className={buttonVariants()}>
              Jelajahi Source Code
            </Link>
            <Button variant="ghost">Jaminan kualitas code &rarr;</Button>
          </div>
        </div>

        {/* TODO: List products */}
      </MaxWidthWrapper>

      <section className="border-t border-gray-200 bg-gray-50">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div
                key={perk.name}
                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
              >
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900">
                    <perk.Icon className="w-1/2 h-1/2" />
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-4 lg:mt-2">
                  <h3 className="text-lg font-semibold">{perk.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}