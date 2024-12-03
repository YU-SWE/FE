// NavigateWrapper.js
import { useNavigate } from 'react-router-dom';

function NavigateWrapper(Component) {
    return function WrappedComponent(props) {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

export default NavigateWrapper;
