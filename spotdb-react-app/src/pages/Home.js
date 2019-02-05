import React from 'react';
import '../layouts/Home.css';
import Navbar from '../components/Navbar';

class Home extends React.Component {
    render() {
        return (
            <div>
            		<Navbar />
                <h1>Welcome to SpotDB</h1>
            </div>
        );
    }
}

export default Home;