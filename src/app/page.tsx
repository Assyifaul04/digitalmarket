import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Pasar digital untuk{" "}
          <span className="text-blue-600">aset berkualitas tinggi</span>.
        </h1>
        <p>
          Selamat datang di <b>digitalmarket</b>. Setiap aset di platform kami
          telah diverifikasi oleh tim kami untuk memastikan standar kualitas
          terbaik.
        </p>
      </div>
    </MaxWidthWrapper>
  );
}
