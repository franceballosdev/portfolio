import { motion } from 'motion/react';

const Projects = () => {
  const realProjects = [
    {
      title: 'Carrozas Gualeguaychú',
      description: 'Sitio web profesional para cooperativa de carrozas estudiantiles de Gualeguaychú. Muestra servicios, galería y sistema de contacto.',
      image: 'bg-gradient-to-br from-red-400 to-red-600',
      technologies: ['PHP', 'MySQL', 'Tailwind CSS'],
      demo: 'https://carrozasgualeguaychu.ar',
      showCode: false,
    },
    {
      title: 'Tienda Online Silvina Andrea',
      description: 'Plataforma e-commerce de joyería con catálogo de productos, carrito de compras y sistema de pagos integrado.',
      image: 'bg-gradient-to-br from-pink-400 to-pink-600',
      technologies: ['PHP', 'MySQL', 'Tailwind CSS'],
      demo: 'https://silvinandrea.com',
      showCode: false,
    },
    {
      title: 'Larva Squad Gaming Project',
      description: 'Sitio web para equipo de esports y gaming, con información del team, consumo de API, torneos y sistema de reclutamiento.',
      image: 'bg-gradient-to-br from-green-400 to-green-600',
      technologies: ["HTML5", 'Tailwind CSS', "PUBG API"],
      demo: 'https://www.larvasquad.com/',
      showCode: false,
    },
  ];

  const learningProjects = [
    {
      title: 'E-commerce Frontend',
      description: 'Frontend moderno para plataforma de e-commerce con interfaz interactiva, carrito de compras y gestión de productos.',
      image: 'bg-gradient-to-br from-blue-400 to-blue-600',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      github: 'https://github.com/franceballosdev/ecommerceFrontend',
      demo: 'https://github.com/franceballosdev/ecommerceFrontend',
      showCode: true,
    },
    {
      title: 'E-commerce Backend',
      description: 'Backend robusto para plataforma de e-commerce desarrollado en C#, con gestión de bases de datos y APIs REST.',
      image: 'bg-gradient-to-br from-blue-600 to-blue-800',
      technologies: ['C#', '.NET', 'SQL Server'],
      github: 'https://github.com/franceballosdev/ecommerceBackend',
      demo: 'https://github.com/franceballosdev/ecommerceBackend',
      showCode: true,
    },
    {
      title: 'Bookstore PHP',
      description: 'Mi primer proyecto personal. Sistema de tienda de libros desarrollado con PHP, base de datos y gestión de inventario.',
      image: 'bg-gradient-to-br from-orange-400 to-orange-600',
      technologies: ['PHP', 'MySQL', 'HTML5', 'CSS3'],
      github: 'https://github.com/franceballosdev/Bookstore-php',
      demo: 'https://github.com/franceballosdev/Bookstore-php',
      showCode: true,
    },
    {
      title: 'Portfolio Personal',
      description: 'Portfolio digital personal que muestra mis proyectos, habilidades y experiencia como desarrollador.',
      image: 'bg-gradient-to-br from-purple-400 to-purple-600',
      technologies: ['React', 'Motion', 'Tailwind CSS', 'Vite', 'Three.js'],
      github: 'https://github.com/franceballosdev/franceballosdev.github.io',
      demo: 'https://franceballosdev.github.io',
      showCode: true,
    },
    {
      title: 'Sistema Recursos Humanos',
      description: 'Aplicación full-stack de gestión de recursos humanos con React en el frontend y Java en el backend. Sistema CRUD para empleados y departamentos.',
      image: 'bg-gradient-to-br from-teal-400 to-teal-600',
      technologies: ['React', 'Java', 'Spring Boot', 'MySQL'],
      github: 'https://github.com/francomceballos/recursos-humanos-app',
      demo: 'https://github.com/francomceballos/recursos-humanos-app',
      showCode: true,
    },
    {
      title: 'Sistema de Inventarios',
      description: 'Aplicación full-stack de gestión de inventarios con Angular en el frontend y Java Spring Boot en el backend. CRUD de productos con API REST.',
      image: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
      technologies: ['Angular', 'Bootstrap', 'Java', 'Spring Boot', 'MySQL'],
      github: 'https://github.com/francomceballos/Inventarios-APP-FrontEnd-Angular',
      demo: 'https://github.com/francomceballos/Inventarios-APP-FrontEnd-Angular',
      showCode: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const renderProjectCard = (project, index) => (
    <motion.div
      key={index}
      variants={cardVariants}
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col"
    >
      <div className={`h-48 ${project.image} flex items-center justify-center`}>
        <svg
          className="w-16 h-16 text-white opacity-80"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-dark dark:text-white mb-2 transition-colors duration-300">{project.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm transition-colors duration-300">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className={`grid gap-3 ${project.showCode ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {project.showCode && (
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center py-2.5 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 text-sm font-medium text-gray-700 dark:text-gray-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Código
            </motion.a>
          )}
          <motion.a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center py-2.5 bg-primary text-white rounded-full hover:bg-blue-600 transition duration-300 text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Demo
          </motion.a>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section id="projects" className="section-padding bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container-custom">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-4 transition-colors duration-300">
            Mis <span className="text-primary">Proyectos</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
            Una selección de proyectos que he desarrollado, mostrando mis habilidades y experiencia.
          </p>
        </motion.div>

        {/* Real Projects */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-2xl font-bold text-dark dark:text-white mb-6 text-center transition-colors duration-300">
            Proyectos <span className="text-primary">Reales</span>
          </h3>
          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {realProjects.map((project, index) => renderProjectCard(project, index))}
          </motion.div>
        </motion.div>

        {/* Learning Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-dark dark:text-white mb-6 text-center transition-colors duration-300">
            Proyectos de <span className="text-primary">Aprendizaje</span>
          </h3>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {learningProjects.map((project, index) => renderProjectCard(project, index))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
