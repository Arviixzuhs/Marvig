import image1 from '@/assets/gallery/1.jpeg'
import image2 from '@/assets/gallery/2.jpeg'
import image3 from '@/assets/gallery/3.jpeg'
import image4 from '@/assets/gallery/4.jpeg'
import image5 from '@/assets/gallery/5.jpeg'
import image6 from '@/assets/gallery/6.jpeg'
import image7 from '@/assets/gallery/7.jpeg'
import image8 from '@/assets/gallery/8.jpg'
import image9 from '@/assets/gallery/9.jpg'
import { Gallery } from '@/components/Gallery'

const images = [image1, image2, image3, image4, image5, image6, image7, image8, image9].map(
  (url) => ({
    url,
  }),
)

export const GallerySection = () => (
  <section id='gallery' className='bg-white text-black scroll-mt-10'>
    <div className='max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24'>
      <h2 className='font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight text-balance'>
        Galería
      </h2>
      <p className='mt-3 max-w-xl text-base sm:text-lg leading-relaxed text-black/75'>
        Un vistazo a la posada y a los rincones más bonitos de la Isla.
      </p>
      <Gallery images={images} variant='masonry' className='mt-10' />
    </div>
  </section>
)
