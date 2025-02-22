"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const services = [
  {
    title: "Rapid Prototyping",
    description: "Turn your ideas into reality within hours",
    image: "/3dPrinterImage1.jpeg",
  },
  {
    title: "Custom Parts Manufacturing",
    description: "Precision-engineered parts tailored to your needs",
    image: "/3dPrinterImage2.jpeg",
  },
  {
    title: "3D Model Design Assistance",
    description: "Expert guidance to perfect your 3D models",
    image: "/3dPrinterImage3.jpeg",
  },
  {
    title: "Large-scale 3D Printing",
    description: "Bringing your biggest ideas to life",
    image: "/3dPrinterImage4.jpg",
  },
];

export default function ServicesSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % services.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[400px] overflow-hidden rounded-xl shadow-2xl">
      {services.map((service, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={service.image}
            alt={service.title}
            layout="fill"
            objectFit="cover"
            className="brightness-50"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 bg-gray-900 bg-opacity-50">
            <h3 className="text-4xl font-bold mb-4 text-white">
              {service.title}
            </h3>
            <p className="text-xl text-gray-200">{service.description}</p>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        {services.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full mx-2 ${
              index === currentSlide ? "bg-blue-500" : "bg-gray-400"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
