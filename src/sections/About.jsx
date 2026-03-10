import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const stats = [
    { value: '2+', label: t({ es: 'Años de Experiencia', en: 'Years of Experience' }) },
    { value: '3+', label: t({ es: 'Proyectos Completados', en: 'Projects Completed' }) },
    { value: '3+', label: t({ es: 'Clientes Satisfechos', en: 'Happy Clients' }) },
    { value: '100%', label: t({ es: 'Compromiso', en: 'Commitment' }) },
  ];

  return (
    <section id="about" className="section-padding bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-full max-w-md mx-auto aspect-square bg-gradient-to-br from-primary to-secondary rounded-[2.5rem] flex items-center justify-center shadow-2xl">
              <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300">
                <svg
                  className="w-16 h-16 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4 transition-colors duration-300"
            >
              {t({ es: 'Sobre', en: 'About' })} <span className="text-primary">{t({ es: 'Mí', en: 'Me' })}</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed transition-colors duration-300"
            >
              {t({
                es: 'Soy un desarrollador web apasionado por crear experiencias digitales excepcionales. Con experiencia en tecnologías modernas de frontend y backend, me especializo en construir aplicaciones web escalables y de alto rendimiento.',
                en: 'I am a web developer passionate about creating exceptional digital experiences. With experience in modern frontend and backend technologies, I specialize in building scalable, high-performance web applications.'
              })}
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed transition-colors duration-300"
            >
              {t({
                es: 'Me encanta resolver problemas complejos y aprender nuevas tecnologías constantemente. Mi objetivo es crear productos digitales que no solo funcionen perfectamente, sino que también ofrezcan una excelente experiencia de usuario.',
                en: 'I love solving complex problems and constantly learning new technologies. My goal is to create digital products that not only work perfectly but also provide an excellent user experience.'
              })}
            </motion.p>

            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={containerVariants}
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 cursor-default"
                >
                  <h3 className="font-bold text-2xl text-primary mb-1">{stat.value}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
