import { motion } from "framer-motion";

interface CountryCardProps {
  name: string;
  image: string;
  description: string;
}

const Country3DCard = ({ name, image, description }: CountryCardProps) => {
  return (
    <div className="w-full h-96 cursor-pointer group perspective-1000">
      <motion.div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:scale-[1.02]">
        {/* Exterior Frame / Window Shape */}
        <div className="absolute inset-0 bg-white rounded-[40px] shadow-2xl overflow-hidden ring-1 ring-white/50 transform translate-z-0">
          {/* BEZEL & GLASS EFFECTS */}
          {/* Outer rim reflection */}
          <div className="absolute inset-0 rounded-[40px] border-2 border-white/80 pointer-events-none z-30 opacity-70"></div>

          {/* Inner inset shadow for depth */}
          <div className="absolute inset-0 rounded-[40px] shadow-[inset_0_4px_20px_rgba(0,0,0,0.2)] pointer-events-none z-20"></div>

          {/* Frosty/Cloudy Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 backdrop-blur-[0.5px] pointer-events-none z-20"></div>

          {/* THE SHEEN ANIMATION (Left to Right) */}
          <div className="absolute -inset-[100%] top-0 block w-[200%] h-full -skew-x-[30deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-[1500ms] group-hover:left-[100%] ease-in-out z-30 pointer-events-none filter blur-md"></div>

          {/* IMAGE CONTAINER */}
          <div className="h-full w-full relative overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Dark Gradient Overlay for Text Visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10 transition-opacity duration-300"></div>

            {/* CONTENT */}
            <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-white text-3xl font-extrabold mb-2 tracking-tight drop-shadow-lg">
                {name}
              </h3>
              <p className="text-blue-100/90 text-sm font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                {description}
              </p>
              {/* Learn More Indicator */}
              <div className="w-12 h-1 bg-blue-500 mt-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200 shadow-glow-blue"></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Country3DCard;
