import React from 'react';
import '../layouts/NoMatch.css';
import FooterNav from '../components/FooterNav';

class NoMatch extends React.Component {
    render() {
        return (
            <div className="main-content">
                <div className="NoMatch">
                	<h1>404!</h1>
                </div>
                <FooterNav />
            </div>
        );
    }
}

export default NoMatch;