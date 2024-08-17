import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import gif from '../Static/Img/GIFLOGO.gif'
import '../Static/Styles/Style.css'

const Loader =()=>{

    return(
        <div>
        <img className='gifloader' src={gif}/>
    </div>
    );
}

export default Loader;