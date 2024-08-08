import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../Static/Styles/Style.css';
import Img1 from '../Static/Img/1.png'
import Img2 from '../Static/Img/2.png'
import Img3 from '../Static/Img/3.png'
import Img4 from '../Static/Img/4.png'



const Carrousel= () =>{
    

    return(
        <div>
            <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
            <div className="carousel-inner">
                <div className="carousel-item active">
                <img src={Img1} className="d-block w-100" alt=''></img>
                </div>
                <div className="carousel-item">
                <img src={Img2} className="d-block w-100" alt=''></img>
                </div>
                <div className="carousel-item">
                <img src={Img3} className="d-block w-100" alt=''></img>
                </div>
                <div className="carousel-item">
                <img src={Img4} className="d-block w-100" alt=''></img>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
            </div>
        </div>
    );
}


export default Carrousel;