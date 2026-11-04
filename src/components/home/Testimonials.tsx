import { TestimonialSlider } from "@/components/ui/testimonial-slider-1";

type Review = {
  id: number;
  name: string;
  affiliation: string;
  quote: string;
  imageSrc: string;
  thumbnailSrc: string;
};

// Real client reviews only, quoted with the client's permission.
// The section stays hidden on the homepage while this list is empty.
// If there is no photo of the person, use the client's logo from /public
// (for example "/chinalankamotors.webp") for both imageSrc and thumbnailSrc.
const reviews: Review[] = [];

export const Testimonials = () => {
  if (reviews.length === 0) return null;

  return (
    <section className="bg-[#0a0a0a] w-full">
      <div className="mx-auto w-full max-w-[1180px] px-4 md:px-6">
        <TestimonialSlider reviews={reviews} />
      </div>
    </section>
  );
};

export default Testimonials;
