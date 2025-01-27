import Link from "next/link";

export default function GetPrintingButton() {
  return (
    <Link href="/print" className="inline-block">
      <button className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
        <span className="relative z-10">
          Get Printing Now!
          <span className="block text-sm mt-1">
            Upload your 3D model and start creating
          </span>
        </span>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient-x"></div>
      </button>
    </Link>
  );
}
