
import { Outlet } from 'react-router-dom';
import Header from '../components/common/navbar.jsx';
import Footer from '../components/common/footer.jsx';
import ScrollTop from "../components/common/scrollTop.js"

const RootLayout = () => {
  return (
    <><ScrollTop/>
      <Header />
      <main className="min-h-screen">
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
};

export default RootLayout;