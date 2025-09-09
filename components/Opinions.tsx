// components/Carousel.tsx
'use client'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const Carousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const slides = ['image1.jpg', 'image2.jpg', 'image3.jpg']

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', () => setSelectedIndex(emblaApi.selectedScrollSnap()))
  }, [emblaApi])

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {slides.map((src, i) => (
          <div className="min-w-full" key={i}>
            <Image alt="" src={src} className="w-full h-64 object-cover" />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === selectedIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => emblaApi?.scrollTo(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel