import BarLoader from "react-spinners/BarLoader";
import '../styles/Loading.css'

const Loader = () => {
  return (
    <div className="d-flex align-items-center justify-content-center loader">
      <BarLoader color={'#71c7ec'} height={10} width={200}/>
    </div>
  );
}

export default Loader;