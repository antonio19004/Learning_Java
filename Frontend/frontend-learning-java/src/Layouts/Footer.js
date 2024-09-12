import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../Static/Styles/Style.css'
import { faBook, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faHtml5, faJava, faReact } from '@fortawesome/free-brands-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Logo from '../Static/Img/Logo-LJ.png'

const Footer = () => {

    return(
        <div className='bg-dark bg-gradient pt-4 pb-2 mt-5'>
            <nav className="navbar navbar-expand-lg">
                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav w-100 justify-content-center">
                        <li className="nav-item">
                            <a className="nav-link active text-light" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active text-light" aria-current="page" href="#">FAQ</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active text-light" aria-current="page" href="#">Acerca de </a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className='d-flex justify-content-center mt-2 mb-4'> 
                <span className='px-2'><FontAwesomeIcon icon={faGithub} size='2xl' color='#cfcfcf'/></span>
                <span className='px-2'><FontAwesomeIcon icon={faHtml5} size='2xl' color='#cfcfcf'/></span>
                <span className='px-2'><FontAwesomeIcon icon={faReact} size='2xl' color='#cfcfcf'/></span>
                <span className='px-2'><FontAwesomeIcon icon={faJava} size='2xl' color='#cfcfcf'/></span>
            </div>

            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content" style={{ width: '110%' }}>
                        <div className="modal-header">
                            <div>
                                <img src={Logo} className='NavLogo' alt='Logo...' />
                            </div>
                            <h5 className="modal-title" id="exampleModalLabel" style={{ marginLeft: '20px' }}>Términos y Condiciones de Uso para LEARNING JAVA<br></br>
                            <p className='text-muted fs-6 fw-normal'>Última actualización: 08 Abril 2024</p></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: '20px' }}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3 mt-3">
                                <h2>Introducción</h2>
                                <p>Gracias por visitar LEARNING JAVA. Al utilizar el Sitio Web, aceptas estar sujeto a los siguientes términos y condiciones.</p>
                            </div>
                            
                            <div className="mb-3">
                                <h4>Propósito del Sitio Web</h4>
                                <p>LEARNING JAVA es una plataforma educativa diseñada para ayudar a los estudiantes a aprender programación en Java. Ofrece tutoriales, foros de discusión, documentación y otros recursos para facilitar el aprendizaje de Java.</p>
                            </div>
                            
                            <div className="mb-3">
                                <h4>Registro y Cuenta de Usuario</h4>
                                <p>Para acceder a ciertas funcionalidades del Sitio Web, como participar en foros o descargar materiales, es posible que necesites crear una cuenta. Al registrarte, proporcionarás información verdadera y precisa. Mantén actualizada tu información de perfil.</p>
                            </div>
                            
                            <div className="mb-3">
                                <h4>Uso Responsable</h4>
                                <p>Reserva el derecho de utilizar el Sitio Web de manera responsable y respetando las leyes aplicables. No autorizamos el uso del Sitio Web para fines ilegales o dañinos.</p>
                            </div>
                            
                            <div className="mb-3">
                                <h4>Contenido del Sitio Web</h4>
                                <p>Todas las obras literarias, gráficas, audiovisuales y otras creaciones contenidas en el Sitio Web están sujetas a derechos de autor. Su uso no autorizado puede resultar en acciones legales.</p>
                            </div>
                            
                            <div className="mb-3">
                                <h4>Foro y Comunicación</h4>
                                <p>El foro y otras áreas de comunicación dentro del Sitio Web están destinadas a fomentar el debate constructivo y el intercambio de ideas. Reserva el derecho de moderar y eliminar contenido inapropiado.</p>
                            </div>
                            
                            <div className="mb-3">
                                <h4>Limitación de Responsabilidad</h4>
                                <p>No somos responsables de errores, omisiones, o retrasos en el funcionamiento del Sitio Web, ni de daños resultantes del acceso o uso del mismo. El uso del Sitio Web es bajo tu propio riesgo.</p>
                            </div>
                            
                            <div className="mb-3">
                                <h4>Cambios en los Términos y Condiciones</h4>
                                <p>Reserva el derecho de modificar estos términos y condiciones en cualquier momento. Te notificará de tales cambios a través de una actualización visible en el Sitio Web.</p>
                            </div>
                            
                            <div className="mb-3">
                                <h4>Ley Aplicable</h4>
                                <p>Estos términos y condiciones se rigen por las leyes de Colombia CO. En caso de disputa, acudirá ante los tribunales competentes en Bucaramanga/Colombia.</p>
                            </div>
                            
                            <div className="mb-3">
                                <h4>Contacto</h4>
                                <p>Para cualquier consulta o problema relacionado con estos términos y condiciones, ponte en contacto con nosotros a través de <strong>pruebastrabajos25@gmail.com.</strong></p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <a target="_blank" rel="noreferrer noopener" className='d-flex justify-content-center text-light fw-bold cursor-pointer text-decoration-none pb-3' href='mailto:pruebastrabajos25@gmail.com'><span className='me-2'><FontAwesomeIcon icon={faEnvelope} /></span>pruebastrabajos25@gmail.com</a>
            <p className='text-center text-primary fw-bold cursor-pointer text-decoration-none' data-bs-toggle="modal" data-bs-target="#exampleModal">
                <span className='me-2'><FontAwesomeIcon icon={faBook}/></span>Terminos y condiciones.
            </p>
            <hr style={{color:'#6c757d', marginLeft:'20rem',marginRight:'20rem'}}></hr>
            <p className='text-center text-secondary fs-5'>&copy; {new Date().getFullYear()} Learning Java.</p>
            <p style={{fontSize:'small', color:'#6c757d',textAlign:'center'}}>Pagina creada y diseñada por: Hermes Herrera & Diego Cediel</p>
        </div>
    );
};

export default Footer;
