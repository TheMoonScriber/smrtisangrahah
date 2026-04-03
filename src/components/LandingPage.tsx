import React from 'react';
import { motion } from 'motion/react';
import { History, Compass, Bookmark } from 'lucide-react';

interface LandingPageProps {
  setView: (view: 'landing' | 'login' | 'signup' | 'admin' | 'member') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setView }) => (
  <div className="bg-[#f5f2ed] min-h-screen pt-24 pb-20 font-serif">
    {/* Hero Section */}
    <section className="px-6 mb-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-[#8b4513] text-sm uppercase tracking-[0.4em] mb-4 block font-sans font-bold">स्मृतिपथस्य आरम्भः</span>
          <h1 className="text-[8vw] md:text-[6vw] leading-none font-bold text-[#2c1e12] mb-6">
            स्मृतिसंग्रहः
          </h1>
          <p className="text-[#5d4037] text-xl md:text-2xl italic max-w-2xl mx-auto leading-relaxed">
            "A sanctuary where wisdom is preserved, and the journey of memory begins."
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="p-8 border border-[#8b4513]/20 bg-white/50 backdrop-blur-sm rounded-lg text-center">
            <History className="w-8 h-8 text-[#8b4513] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#2c1e12] mb-2">Ancient Wisdom</h3>
            <p className="text-[#5d4037] text-sm">Preserving the timeless knowledge of our ancestors for future generations.</p>
          </div>
          <div className="p-8 border border-[#8b4513]/20 bg-white/50 backdrop-blur-sm rounded-lg text-center">
            <Compass className="w-8 h-8 text-[#8b4513] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#2c1e12] mb-2">Guided Journey</h3>
            <p className="text-[#5d4037] text-sm">Navigating the vast ocean of literature to find the pearls of truth.</p>
          </div>
          <div className="p-8 border border-[#8b4513]/20 bg-white/50 backdrop-blur-sm rounded-lg text-center">
            <Bookmark className="w-8 h-8 text-[#8b4513] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#2c1e12] mb-2">Curated Collection</h3>
            <p className="text-[#5d4037] text-sm">Every volume hand-selected for its depth, beauty, and enduring value.</p>
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#d4af37]/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8b4513]/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
    </section>

    {/* Content Section */}
    <section className="px-6 py-20 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="prose prose-stone lg:prose-xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-[#2c1e12] mb-10 text-center border-b-2 border-[#d4af37]/30 pb-6">
            पुस्तकालयस्य महत्त्वम् [The Significance of the Library]
          </h2>
          
          <div className="space-y-12 text-[#5d4037] leading-relaxed text-lg">
            <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-[#8b4513] first-letter:mr-3 first-letter:float-left">
              पुस्तकालयः ज्ञानस्य मन्दिरम् अस्ति। अत्र वयं प्राचीनग्रन्थानां आधुनिकसाहित्यस्य च सङ्गमं पश्यामः। 
              A library is a temple of knowledge. Here, we witness the convergence of ancient scriptures and modern literature. 
              Our mission is to preserve these treasures for the generations to come, ensuring that the light of wisdom never fades.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-16">
              <div className="bg-[#f5f2ed] p-8 rounded-sm border-l-4 border-[#d4af37]">
                <h4 className="text-[#2c1e12] font-bold mb-4 uppercase tracking-widest text-sm">संरक्षणम् [Preservation]</h4>
                <p className="text-base italic">"Every page turned is a step back in time, and every volume preserved is a gift to the future."</p>
              </div>
              <div className="bg-[#f5f2ed] p-8 rounded-sm border-l-4 border-[#d4af37]">
                <h4 className="text-[#2c1e12] font-bold mb-4 uppercase tracking-widest text-sm">अन्वेषणम् [Discovery]</h4>
                <p className="text-base italic">"In the silence of these halls, one finds the answers to questions yet unasked."</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-[#2c1e12] mt-16 mb-6">स्मृतिसंग्रहस्य इतिहासः [History of Smrtisangrahah]</h3>
            <p>
              Established with the vision of creating a digital sanctuary for rare and valuable manuscripts, 
              Smrtisangrahah has grown into a comprehensive repository. We believe that access to information 
              is a fundamental right, but the stewardship of that information is a sacred duty. 
              Our collection spans across philosophy, science, arts, and the profound spiritual traditions of India.
            </p>

            <blockquote className="border-l-4 border-[#d4af37] pl-8 py-4 my-12 bg-[#f9f7f2] italic text-2xl text-[#2c1e12]">
              "ज्ञानं परमं बलम् - Knowledge is the ultimate strength."
            </blockquote>

            <p>
              To explore our full catalog and access our digital archives, please register as a member. 
              Membership is subject to approval by our administrative council to maintain the integrity 
              and security of our collections.
            </p>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Blog/Updates Section */}
    <section className="px-6 py-20 bg-[#f5f2ed]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-[#2c1e12] mb-12 text-center uppercase tracking-[0.2em]">नूतन लेखाः [Recent Write-ups]</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "The Art of Manuscript Preservation",
              date: "March 15, 2026",
              excerpt: "Exploring the delicate techniques used to maintain the longevity of palm-leaf manuscripts...",
              image: "https://picsum.photos/seed/manuscript/800/600"
            },
            {
              title: "Sanskrit in the Modern Era",
              date: "March 10, 2026",
              excerpt: "How ancient linguistic structures are influencing modern computational linguistics and AI...",
              image: "https://picsum.photos/seed/sanskrit/800/600"
            },
            {
              title: "The Librarian's Duty",
              date: "March 5, 2026",
              excerpt: "Reflections on the role of information curators in an age of digital abundance...",
              image: "https://picsum.photos/seed/library/800/600"
            }
          ].map((post, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-sm overflow-hidden shadow-md group cursor-pointer"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <span className="text-[#8b4513] text-[10px] uppercase font-bold tracking-widest mb-2 block">{post.date}</span>
                <h3 className="text-xl font-bold text-[#2c1e12] mb-4 group-hover:text-[#d4af37] transition-colors">{post.title}</h3>
                <p className="text-[#5d4037] text-sm leading-relaxed mb-6">{post.excerpt}</p>
                <span className="text-[#2c1e12] text-xs font-bold uppercase tracking-widest border-b border-[#2c1e12] pb-1">Read More</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default LandingPage;
