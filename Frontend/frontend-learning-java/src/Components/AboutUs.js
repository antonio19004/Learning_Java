import React from 'react';
import NavMenu from '../Layouts/NavMenu.js';
import Footer from '../Layouts/Footer.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Static/Styles/AboutUs.css';
import Developer1 from '../Static/Img/Developer1.jpeg';
import Developer2 from '../Static/Img/Developer2.jpeg';

const AboutUs = () => {

    document.title = 'Sobre Nosotros';

    return (
        <div>
            <header>
                <NavMenu />
            </header>
            <div className='content'>
                <section className='about'>
                    <h1 className='fw-bold'>¿Quiénes Somos?</h1><br />
                    <p style={{ fontSize: '17px' }}>
                        En Learning Java somos dos programadores dedicados a la enseñanza y el aprendizaje. Nos enfocamos en fomentar
                        el conocimiento de la programación a través de nuestros cursos diseñados para facilitar la comprensión y el dominio
                        práctico de los conceptos esenciales. Nuestro objetivo es ayudar a cualquier persona que quiera entrar al mundo de la
                        programación a adquirir habilidades valiosas.
                    </p>
                    <p style={{ fontSize: '17px' }}>En Learning Java ofrecemos un enfoque accesible y actualizado. Únete a nosotros y descubre como transformar tu futuro en la programación.</p>
                </section>
                <section className='developers'>
                    <h2 className='fw-bold text-center' style={{ marginBottom: '50px' }}>Conoce a Nuestros Programadores</h2>
                    <div className='card-container'>
                        <div className='img-container'>
                            <img src={Developer1}></img>
                        </div>
                        <div className='info-container'>
                            <h3>Diego Fabian Cediel Diaz</h3>
                            <h4>Desarrollador JR</h4>
                            <p style={{ fontSize: '17px' }}>
                                Estudiante de Tecnología en Desarrollo de Sistemas Informáticos en las Unidades Tecnológicas de Santander. A lo largo de su
                                formación académica, ha demostrado interés por el área de programación y desarrollo de software.
                            </p>
                            <p style={{ fontSize: '17px' }}>
                                Sobresale por su habilidad para adquirir conocimiento sobre nuevas tecnologías con rapidez y su enfoque orientado a la resolución eficiente de problemas.
                                Además, su curiosidad y pasión por el aprendizaje continuo lo impulsan a mantenerse al tanto de las últimas tendencias en el campo tecnológico.
                            </p>
                            <p style={{ fontSize: '17px' }}><strong>Habilidades:</strong></p>
                            <ul>
                                <li className='list' style={{ fontSize: '17px' }}><strong>Manejo de Bases de Datos:</strong> MySQL y MongoDB</li>
                                <li className='list' style={{ fontSize: '17px' }}><strong>Programación Backend:</strong> Java, PHP, C#</li>
                                <li className='list' style={{ fontSize: '17px' }}><strong>Manejo de Frameworks Backend:</strong> Spring Boot, Laravel y .NET</li>
                                <li className='list' style={{ fontSize: '17px' }}><strong>Desarrollo Frontend:</strong> HTML, CSS y JavaScript</li>
                                <li className='list' style={{ fontSize: '17px' }}><strong>Manejo de Frameworks Frontend:</strong> React, Vue.js, Tailwind y Bootstrap</li>
                            </ul>
                        </div>
                    </div><br />
                    <div className='card-container'>
                        <div className='img-container'>
                            <img src={Developer2}></img>
                        </div>
                        <div className='info-container'>
                            <h3>Hermes Antonio Herrera Matajira</h3>
                            <h4>Desarrollador JR</h4>
                            <p style={{ fontSize: '17px' }}>
                                Estudiante de Tecnología en Desarrollo de Sistemas Informáticos en las Unidades Tecnológicas de Santander. A lo largo de su
                                formación académica, ha demostrado interés por el área de programación y desarrollo de software.
                            </p>
                            <p style={{ fontSize: '17px' }}>
                                Se destaca su capacidad para aprender nuevas tecnologías rápidamente y por su enfoque en resolver problemas de manera eficiente.
                                Además, posee habilidades sólidas para el trabajo en equipo, lo que le permite contribuir en proyectos grupales y adaptarse a diferentes
                                entornos de trabajo.
                            </p>
                            <p style={{ fontSize: '17px' }}><strong>Habilidades:</strong></p>
                            <ul>
                                <li className='list' style={{ fontSize: '17px' }}><strong>Manejo de Bases de Datos:</strong> MySQL y MongoDB</li>
                                <li className='list' style={{ fontSize: '17px' }}><strong>Programación Backend:</strong> Java, PHP</li>
                                <li className='list' style={{ fontSize: '17px' }}><strong>Manejo de Frameworks Backend:</strong> Spring Boot y Laravel</li>
                                <li className='list' style={{ fontSize: '17px' }}><strong>Desarrollo Frontend:</strong> HTML, CSS y JavaScript</li>
                                <li className='list' style={{ fontSize: '17px' }}><strong>Manejo de Frameworks Frontend:</strong> React, Vue.js, Tailwind y Bootstrap</li>
                            </ul>
                        </div>
                    </div>
                </section><br />
                <section className='university'>
                    <h2 className='fw-bold' style={{ textAlign: 'left' }}>Unidades Tecnológicas de Santander (UTS)</h2><br />
                    <p style={{ fontSize: '17px' }}>
                        En Learning Java, valoramos nuestra formación académica. Ambos cofundadores somos estudiantes del programa Tecnología en Desarrollo
                        de Sistemas Informáticos de las Unidades Tecnológicas de Santander, institución que nos proporcionó una base en tecnología, desarrollo
                        de software y bases de datos, perparándonos para enfrentar a los desafíos del mundo de la programación.
                    </p>
                    <p style={{ fontSize: '17px' }}>
                        La formación recibida en la UTS ha sido fundamental para desarrollar nuestra metodología de enseñanza permitiéndonos ofrecer un enfoque
                        práctico y actualizado en nuestros cursos.
                    </p>
                    <p><strong>Datos de contacto:</strong></p>
                    <center><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.1811494526637!2d-73.12638172626588!3d7.104993716135542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e683fc8a8b0973f%3A0x5f50c91e41f0ac6e!2sUnidades%20Tecnol%C3%B3gicas%20de%20Santander!5e0!3m2!1ses-419!2sco!4v1724699074445!5m2!1ses-419!2sco" style={{ width:'600', height: '450', style: 'border:0;', allowfullscreen: '', loading: 'lazy', referrerpolicy: 'no-referrer-when-downgrade', border: 'none' }}></iframe></center><br />
                    <ul>
                        <li className='list' style={{ fontSize: '17px' }}><strong>Dirección (Sede Principal):</strong> Av. Los Estudiantes #9-82, Bucaramanga, Santander</li>
                        <li className='list' style={{ fontSize: '17px' }}><strong>Teléfono:</strong> (607) 6917700</li>
                        <li className='list' style={{ fontSize: '17px' }}><strong>Página Institucional:</strong><a href='https://www.uts.edu.co/sitio/' style={{ textDecoration: 'none', cursor: 'pointer', color: '#0056b3' }}> Web Site UTS</a></li>
                    </ul>
                </section><br />
                <section className='history'>
                    <h2 className='fw-bold' style={{ textAlign: 'right' }}>Nuestra Historia</h2><br />
                    <p style={{ fontSize: '17px' }}>
                        Todo comenzo con la visión de un profesor de la institución donde planteaba la idea de crear una plataforma educativa dedicada a la enseñanza
                        de la programación. Esta propuesta buscaba ofrecer un enfoque accesible y práctico para la enseñanza de programación a cualquier persona sin
                        importar su experiencia previa.
                    </p>
                    <p style={{ fontSize: '17px' }}>
                        Inspirados por esta visión, decidimos tomar la idea y llevarla a la realidad. Como cofundadores de Learning Java, nos dedicamos a desarrollar
                        la plataforma desde sus inicios. Nos encargamos de diseñar la estructura de los cursos asegurando que cada lección y actividad reflejara un enfoque
                        educativo y eficaz.
                    </p>
                    <p style={{ fontSize: '17px' }}>
                        En el desarrollo de los materiales educativos realizamos una combinación de recursos, en donde creamos algunos de los videos y ejercicios, mientras
                        que otros se basaron en recursos disponibles de internet. Esta integración nos permitió ofrecer una experiencia de aprendizaje enriquecedora, aprovechando
                        tanto nuestros conocimientos como recursos externos.
                    </p>
                </section><br />
                <section className='valores'>
                    <h2 className='fw-bold'>Nuestros Valores</h2><br />
                    <p style={{ fontSize: '17px' }}>En Learning Java creemos firmemente en la importancia de una educación de calidad y en valores que guíen nuestra enseñanza:</p>
                    <ul>
                        <li className='list' style={{ fontSize: '17px' }}><strong>Inclusión:</strong> Facilitar el acceso a la programación para todos, sin importar su experiencia previa.</li>
                        <li className='list' style={{ fontSize: '17px' }}><strong>Calidad:</strong> Brindar educación de primera calidad, con un enfoque práctico y actualizado.</li>
                        <li className='list' style={{ fontSize: '17px' }}><strong>Aprendizaje Continuo:</strong> Fomentar un entorno de aprendizaje constante, adaptándonos a las nuevas tendencias.</li>
                    </ul>
                </section>
                <section className='start'>
                    <h2 className='fw-bold text-center'>¿Listo para Aprender Programación?</h2><br />
                    <center><a href='/courses' className='btn btn-dark btn-courses'>Explora Nuestros Cursos</a></center>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default AboutUs;
