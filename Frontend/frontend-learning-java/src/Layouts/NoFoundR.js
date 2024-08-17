
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import gif from '../Static/Img/gif1.gif';
import '../Static/Styles/Style.css'

const NoFoundR=()=>{

    return(
        <div className='pt-3'>
    <div className="px-5">
  <div className="alert alert-warning d-flex align-items-center" role="alert">
    <FontAwesomeIcon icon={faTriangleExclamation} />
    <div className="ms-2">
      Esta sección está en construcción o no se encuentra disponible actualmente.
    </div>
  </div>
</div>
<img className='gif' src={gif}/>
        </div>
    );
}
export default NoFoundR;