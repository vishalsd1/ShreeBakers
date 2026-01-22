import { MdStarRate } from "react-icons/md";
import { useLanguage } from "../context/LanguageContext";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    text: "The best cakes in Phulambri! I ordered a custom birthday cake and it was absolutely delicious and beautiful.",
    rating: 5
  },
  {
    id: 2,
    name: "Rahul Patil",
    text: "Fresh and tasty. The delivery was on time. Highly recommended for any celebration.",
    rating: 5
  },
  {
    id: 3,
    name: "Sneha Deshmukh",
    text: "Loved the Rasmalai cake. It was so moist and flavorful. Will definitely order again.",
    rating: 4
  }
];

export default function Testimonials() {
  const { language } = useLanguage();

  return (
    <section className="py-12 sm:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-chocolate text-center mb-8 sm:mb-12">
          {language === 'mr' ? 'ग्राहक प्रतिक्रिया' : 'What Our Customers Say'}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <MdStarRate key={i} className="text-xl" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
              <h4 className="font-bold text-chocolate">- {testimonial.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
